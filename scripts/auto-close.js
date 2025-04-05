#!/usr/bin/env node
/**
 * @file Auto-close script for closing won't add icons.
 */
import process from 'node:process';

const githubToken = process.env.GITHUB_TOKEN;
const githubRespository = process.env.GITHUB_REPOSITORY;
const issueNumber = process.env.ISSUE_NUMBER;

if (!githubToken || !githubRespository || !issueNumber) {
	console.error(
		'GITHUB_TOKEN, GITHUB_REPOSITORY, and ISSUE_NUMBER environment variables must be set.',
	);
	process.exit(1);
}

/**
 * Get the reason text for closing the issue.
 * @param {number[]} issueNumbers The issue numbers to include in the reason text.
 * @returns {string} - The reason text for closing the issue.
 */
const getReasonText = (issueNumbers) => {
	const reasonPrefix = 'This issue was automatically closed. Please refer to ';
	return (
		reasonPrefix +
		issueNumbers
			.map((issueNumber) => {
				return `#${issueNumber}`;
			})
			.join(' ')
	);
};

const rules = [
	{
		pattern: /java/i,
		reason: getReasonText([7374]),
	},
	{
		pattern: /linkedin/i,
		reason: getReasonText([11_236, 11_372]),
	},
	{
		pattern: /microsoft/i,
		reason: getReasonText([11_236]),
	},
];

const headers = {
	Accept: 'application/vnd.github+json',
	Authorization: `Bearer ${githubToken}`,
	'X-GitHub-Api-Version': '2022-11-28',
};

/**
 * Check if the issue is a won't add icon issue.
 * GitHub REST API: https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#get-an-issue.
 * @returns {string | undefined} - Returns true if the issue is a won't add icon issue, false otherwise.
 */
const checkIfCanBeClosed = async () => {
	const url = `https://api.github.com/repos/${githubRespository}/issues/${issueNumber}`;
	const responseJson = await globalThis
		.fetch(url, {
			method: 'GET',
			headers,
		})
		.then((response) => response.json());
	const {labels, state, title} = responseJson;
	const labelNames = new Set(labels.map((label) => label.name));
	if (!labelNames.has('new icon')) return undefined;
	if (labelNames.has('meta')) return undefined;
	if (state === 'closed') return undefined;
	const matched = rules.find((rule) => rule.pattern.test(title));
	if (!matched) return undefined;
	return matched.reason;
};

/**
 * Check if the issue is a won't add icon issue.
 * GitHub REST API: https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#update-an-issue.
 */
const closeAsNotPlanned = async () => {
	const url = `https://api.github.com/repos/${githubRespository}/issues/${issueNumber}`;
	await globalThis.fetch(url, {
		method: 'PATCH',
		headers,
		body: JSON.stringify({
			state: 'closed',
			state_reason: 'not_planned', // eslint-disable-line camelcase
		}),
	});
};

/**
 * Post a comment on the issue.
 * GitHub REST API: https://docs.github.com/en/rest/issues/comments?apiVersion=2022-11-28#create-an-issue-comment.
 * @param {string} reason The reason for closing the issue.
 */
const commentWithReason = async (reason) => {
	const url = `https://api.github.com/repos/${githubRespository}/issues/${issueNumber}/comments`;
	await globalThis.fetch(url, {
		method: 'POST',
		headers,
		body: JSON.stringify({
			body: reason,
		}),
	});
};

try {
	const reason = await checkIfCanBeClosed();
	if (reason) {
		await closeAsNotPlanned();
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
