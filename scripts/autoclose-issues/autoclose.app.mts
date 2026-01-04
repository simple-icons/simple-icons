#!/usr/bin/env node
/**
 * @file Auto-close script for closing won't add icons.
 */

import process from 'node:process';
import rules from './autoclose.rules.mts';
import {type Issue} from './autoclose.types.mts';

const githubToken = process.env['GITHUB_TOKEN'];
const githubRepository = process.env['GITHUB_REPOSITORY'];
const issueNumber = process.env['ISSUE_NUMBER'];

if ([githubToken, githubRepository, issueNumber].some((v) => !v)) {
	console.error(
		`${Object.entries({githubToken, githubRepository, issueNumber})
			.filter(([, v]) => !v)
			.map(([k]) => k)
			.join(', ')} environment variable(s) must be set.`,
	);
	process.exit(1);
}

/**
 * Fetch data from GitHub API.
 * @param url The URL to fetch.
 * @param options The options to pass to the fetch function.
 * @returns The response data.
 */
const githubFetch = async (url: string, options: RequestInit) => {
	const response = await globalThis.fetch(new URL(url), {
		...options,
		headers: {
			/* eslint-disable @typescript-eslint/naming-convention */
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${githubToken}`,
			/* eslint-enable @typescript-eslint/naming-convention */
			'X-GitHub-Api-Version': '2022-11-28',
			...options?.headers,
		},
	});
	if (!response.ok) {
		throw new Error(
			`Failed to fetch ${url}: ${response.status} (${response.statusText}).`,
		);
	}

	return response;
};

/**
 * Check if the issue is a won't add icon issue.
 *
 * GitHub REST API: https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#get-an-issue.
 * @returns Returns reason if the issue is a won't add icon issue, undefined otherwise.
 */
const checkIfCanBeClosed = async () => {
	const url = `https://api.github.com/repos/${githubRepository}/issues/${issueNumber}`;
	const response = await githubFetch(url, {method: 'GET'});

	const json = (await response.json()) as Issue;
	const {labels, state, title, body} = json;
	const labelNames = new Set(labels.map((label) => label.name));
	if (state === 'closed') return undefined;
	if (labelNames.has('meta')) return undefined;
	if (labelNames.has('in discussion')) return undefined;
	if (!labelNames.has('new icon')) return undefined;
	const matched = rules.find((rule) =>
		rule.patterns.some((pattern) => {
			const brandNamePattern = new RegExp(
				`### Brand Name\n*${pattern.source.replaceAll('$', '')}\n*###`,
				'i',
			);
			return pattern.test(title) || brandNamePattern.test(body);
		}),
	);
	if (!matched) return undefined;
	return matched.reason;
};

/**
 * Close the issue as not planned.
 *
 * GitHub REST API: https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#update-an-issue.
 */
const closeAsNotPlanned = async () => {
	const url = `https://api.github.com/repos/${githubRepository}/issues/${issueNumber}`;
	await githubFetch(url, {
		method: 'PATCH',
		body: JSON.stringify({
			state: 'closed',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			state_reason: 'not_planned',
		}),
	});
};

/**
 * Add labels to the issue.
 *
 * GitHub REST API: https://docs.github.com/en/rest/issues/labels?apiVersion=2022-11-28#add-labels-to-an-issue.
 */
const addLabels = async () => {
	const url = `https://api.github.com/repos/${githubRepository}/issues/${issueNumber}/labels`;
	await githubFetch(url, {
		method: 'POST',
		body: JSON.stringify({
			labels: ['duplicate', "won't add"],
		}),
	});
};

/**
 * Post a comment on the issue.
 *
 * GitHub REST API: https://docs.github.com/en/rest/issues/comments?apiVersion=2022-11-28#create-an-issue-comment.
 * @param reason The reason for closing the issue.
 */
const commentWithReason = async (reason: string) => {
	const url = `https://api.github.com/repos/${githubRepository}/issues/${issueNumber}/comments`;
	await githubFetch(url, {
		method: 'POST',
		body: JSON.stringify({
			body: reason,
		}),
	});
};

try {
	const reason = await checkIfCanBeClosed();
	if (reason) {
		await closeAsNotPlanned();
		await addLabels();
		await commentWithReason(reason);
	}
} catch (error) {
	if (error instanceof Error) {
		console.error(error.message);
	} else {
		console.error(String(error));
	}

	process.exit(1);
}
