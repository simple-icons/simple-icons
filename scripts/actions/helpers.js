// @ts-check
/**
 * @file Helper functions for GitHub actions.
 */
import process from 'node:process';

const {GITHUB_TOKEN} = process.env;

if (GITHUB_TOKEN === undefined) {
	throw new Error('GITHUB_TOKEN environment variable must be set.');
}

/**
 * @typedef {{
 * 	get: (key: string) => string | null,
 * }} Headers Headers object.
 */

/**
 * @typedef {{
 * 	ok: boolean,
 *  json: () => unknown,
 *  headers: Headers,
 * }} GitHubResponse GitHub API response.
 */

/**
 * Fetch data from GitHub API.
 * @param {string} url The URL to fetch.
 * @param {globalThis.RequestInit} options The options to pass to the fetch function.
 * @returns {Promise<GitHubResponse>} - The response data.
 */
export const githubFetch = async (url, options) => {
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
 * Add labels to the issue.
 * GitHub REST API: https://docs.github.com/en/rest/issues/labels?apiVersion=2022-11-28#add-labels-to-an-issue.
 * @param {string} githubRepository The GitHub repository in the format "owner/repo".
 * @param {number} issueNumber The issue number.
 * @param {string[]} labels The labels to add.
 */
export const addLabels = async (githubRepository, issueNumber, labels) => {
	const url = `https://api.github.com/repos/${githubRepository}/issues/${issueNumber}/labels`;
	await githubFetch(url, {
		method: 'POST',
		body: JSON.stringify({
			labels,
		}),
	});
};

/**
 * Post a comment on the issue.
 * GitHub REST API: https://docs.github.com/en/rest/issues/comments?apiVersion=2022-11-28#create-an-issue-comment.
 * @param {string} githubRepository The GitHub repository in the format "owner/repo".
 * @param {number} issueNumber The issue number.
 * @param {string} reason The reason for closing the issue.
 */
export const commentWithReason = async (
	githubRepository,
	issueNumber,
	reason,
) => {
	const url = `https://api.github.com/repos/${githubRepository}/issues/${issueNumber}/comments`;
	await githubFetch(url, {
		method: 'POST',
		body: JSON.stringify({
			body: reason,
		}),
	});
};

/**
 * Print error message to console.
 * @param {unknown} error The error to print.
 */
export const printError = (error) => {
	if (error instanceof Error) {
		console.error(error.message);
	} else {
		console.error(String(error));
	}
};
