#!/usr/bin/env node
// @ts-check
/* eslint jsdoc/reject-any-type: off */
/**
 * @file Auto-close script for closing won't add icons.
 */
import path from 'node:path';
import process from 'node:process';
import {
	addLabels,
	commentWithReason,
	githubFetch,
	printError,
} from '../helpers.js';

/**
 * @typedef {object} Rule
 * @property {RegExp[]} patterns The pattern to match against the issue title.
 * @property {string} reason The issue numbers to include in the reason text.
 */

/**
 * @typedef {Rule[]} Config
 */

/**
 * @typedef {object} Issue
 * @property {{name: string}[]} labels Issue labels.
 * @property {string} state Issue state, possible values are 'open' and 'closed'.
 * @property {string} title Issue title.
 * @property {string} body Issue body.
 */

/** @type {Config} */
const rules = await import(
	path.join(import.meta.dirname, 'autoclose.rules.js')
).then((module) => module.default);

/**
 * Check if the issue is a won't add icon issue.
 * GitHub REST API: https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#get-an-issue.
 * @param {string} githubRepository The GitHub repository in the format "owner/repo".
 * @param {number} issueNumber The issue number.
 * @returns {Promise<string | undefined>} Returns reason if the issue is a won't add icon issue, undefined otherwise.
 */
const checkIfCanBeClosed = async (githubRepository, issueNumber) => {
	const url = `https://api.github.com/repos/${githubRepository}/issues/${issueNumber}`;
	const response = await githubFetch(url, {method: 'GET'});

	const json = /** @type {Issue} */ (await response.json());
	const {labels, state, title, body} = json;
	const labelNames = new Set(labels.map((label) => label.name));
	if (state === 'closed') {
		return undefined;
	}

	if (labelNames.has('meta')) {
		return undefined;
	}

	if (labelNames.has('in discussion')) {
		return undefined;
	}

	if (!labelNames.has('new icon')) {
		return undefined;
	}

	const matched = rules.find((rule) =>
		rule.patterns.some((pattern) => {
			const brandNamePattern = new RegExp(
				`### Brand Name\n*${pattern.source.replaceAll('$', '')}\n*###`,
				'i',
			);
			return pattern.test(title) || brandNamePattern.test(body);
		}),
	);
	if (!matched) {
		return undefined;
	}

	return matched.reason;
};

/**
 * Close the issue as not planned.
 * GitHub REST API: https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#update-an-issue.
 * @param {string} githubRepository The GitHub repository in the format "owner/repo".
 * @param {number} issueNumber The issue number.
 */
const closeAsNotPlanned = async (githubRepository, issueNumber) => {
	const url = `https://api.github.com/repos/${githubRepository}/issues/${issueNumber}`;
	await githubFetch(url, {
		method: 'PATCH',
		body: JSON.stringify({
			state: 'closed',
			state_reason: 'not_planned', // eslint-disable-line camelcase
		}),
	});
};

/**
 * Read required environment variables.
 * @throws {Error} If any required environment variable is missing.
 * @returns {{githubRepository: string, issueNumber: number}} Environment variables.
 */
const readEnv = () => {
	const {GITHUB_REPOSITORY, ISSUE_NUMBER} = process.env;
	if (GITHUB_REPOSITORY === undefined || ISSUE_NUMBER === undefined) {
		throw new Error(
			'GITHUB_REPOSITORY and ISSUE_NUMBER environment variables are required.',
		);
	}

	return {
		githubRepository: GITHUB_REPOSITORY,
		issueNumber: Number(ISSUE_NUMBER),
	};
};

/**
 * Main function.
 * @returns {Promise<number>} Exit code.
 */
const main = async () => {
	try {
		const {githubRepository, issueNumber} = readEnv();
		const reason = await checkIfCanBeClosed(githubRepository, issueNumber);
		if (reason) {
			await closeAsNotPlanned(githubRepository, issueNumber);
			await addLabels(githubRepository, issueNumber, [
				'duplicate',
				"won't add",
			]);
			await commentWithReason(githubRepository, issueNumber, reason);
		}

		return 0;
	} catch (error) {
		printError(error);
		return 1;
	}
};

/**
 * Action entry point.
 */
const run = async () => {
	const exitcode = await main();
	process.exit(exitcode);
};

await run();
