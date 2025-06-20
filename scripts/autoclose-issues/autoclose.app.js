#!/usr/bin/env node
// @ts-check
/**
 * @file Auto-close script for closing won't add icons.
 */
import path from 'node:path';
import process from 'node:process';

/**
 * @typedef {object} Rule
 * @property {RegExp[]} patterns - The pattern to match against the issue title.
 * @property {string} reason - The issue numbers to include in the reason text.
 */

/**
 * @typedef {Rule[]} Config
 */

/**
 * @typedef {object} Issue
 * @property {{name: string}[]} labels - Issue labels.
 * @property {string} state - Issue state, possible values are 'open' and 'closed'.
 * @property {string} title - Issue title.
 * @property {string} body - Issue body.
 */

/** @type {Config} */
const rules = await import(
	path.join(import.meta.dirname, 'autoclose.rules.js')
).then((module) => module.default);

const {GITHUB_TOKEN, GITHUB_REPOSITORY, ISSUE_NUMBER} = process.env;

if ([GITHUB_TOKEN, GITHUB_REPOSITORY, ISSUE_NUMBER].some((v) => !v)) {
	console.error(
		`${Object.entries({GITHUB_TOKEN, GITHUB_REPOSITORY, ISSUE_NUMBER})
			.filter(([, v]) => !v)
			.map(([k]) => k)
			.join(', ')} environment variable(s) must be set.`,
	);
	process.exit(1);
}

/**
 * Fetch data from GitHub API.
 * @param {string} url The URL to fetch.
 * @param {globalThis.RequestInit} options The options to pass to the fetch function.
 * @returns {Promise<any>} - The response data.
 */
const githubFetch = async (url, options) => {
	const response = await globalThis.fetch(new URL(url), {
		...options,
		headers: {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${GITHUB_TOKEN}`,
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
 * GitHub REST API: https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#get-an-issue.
 * @returns {Promise<string | undefined>} - Returns reason if the issue is a won't add icon issue, undefined otherwise.
 */
const checkIfCanBeClosed = async () => {
	const url = `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${ISSUE_NUMBER}`;
	const response = await githubFetch(url, {method: 'GET'});

	/** @type {Issue} */
	const json = await response.json();
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
 * GitHub REST API: https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#update-an-issue.
 */
const closeAsNotPlanned = async () => {
	const url = `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${ISSUE_NUMBER}`;
	await githubFetch(url, {
		method: 'PATCH',
		body: JSON.stringify({
			state: 'closed',
			state_reason: 'not_planned', // eslint-disable-line camelcase
		}),
	});
};

/**
 * Add labels to the issue.
 * GitHub REST API: https://docs.github.com/en/rest/issues/labels?apiVersion=2022-11-28#add-labels-to-an-issue.
 */
const addLabels = async () => {
	const url = `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${ISSUE_NUMBER}/labels`;
	await githubFetch(url, {
		method: 'POST',
		body: JSON.stringify({
			labels: ['duplicate', "won't add"],
		}),
	});
};

/**
 * Post a comment on the issue.
 * GitHub REST API: https://docs.github.com/en/rest/issues/comments?apiVersion=2022-11-28#create-an-issue-comment.
 * @param {string} reason The reason for closing the issue.
 */
const commentWithReason = async (reason) => {
	const url = `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${ISSUE_NUMBER}/comments`;
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
