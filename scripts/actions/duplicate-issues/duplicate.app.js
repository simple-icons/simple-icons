#!/usr/bin/env node
// @ts-check
/**
 * @file Duplicates checker script for marking icon request issues as potential duplicates.
 */
import path from 'node:path';
import process from 'node:process';
import {Searcher} from 'fast-fuzzy';
import {
	addLabels,
	commentWithReason,
	githubFetch,
	printError,
} from '../helpers.js';

/**
 * @typedef {object} IssueConfig Issue related configuration.
 * @property {number} minimumTitleLength Minimum length of the issue title to check.
 */

/**
 * @typedef {object} Config Potential duplicate checker configuration.
 * @property {number} threshold Minimum threshold to mark as a duplicate.
 * @property {string[]} exclude Words to exclude from the similarity check.
 * @property {IssueConfig} issue Issue related configuration.
 * @property {number} [maxDuplicates] Maximum number of duplicates to list in the comment.
 */

/**
 * Build configuration from default values.
 * @param {Config} config Configuration object.
 * @returns {Config} Configuration with default values.
 */
const fromDefaultConfig = (config) => {
	return {
		threshold: config.threshold ?? 0.85,
		issue: {
			minimumTitleLength:
				config.issue?.minimumTitleLength === undefined
					? 4
					: config.issue.minimumTitleLength,
		},
		maxDuplicates: config.maxDuplicates,
		exclude: config.exclude ?? [],
	};
};

/** @type {Config} */
const config = await import(
	path.join(import.meta.dirname, 'duplicate.config.js')
).then((module) => fromDefaultConfig(module.default));

/**
 * @typedef {object} Issue Issue object.
 * @property {string} title Issue title.
 * @property {number} number Issue number.
 * @property {{name: string}[]} labels Issue labels.
 * @property {boolean} pull_request Whether the issue is a pull request.
 * @property {string} formattedTitle Formatted issue title.
 */

/**
 * Get all open issues.
 * GITHUB REST API: https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#list-repository-issues.
 * @param {string} githubRepository The GitHub repository in the format "owner/repo".
 * @returns {Promise<Issue[]>} List of open issues.
 */
const getAllOpenIssues = async (githubRepository) => {
	const issues = [];
	let page = 1;
	process.stdout.write('Fetching all open issues...\n');
	while (true) {
		process.stdout.write(`  - Page ${page}: `);
		const url = `https://api.github.com/repos/${githubRepository}/issues?state=open&per_page=100&page=${page}`;
		// eslint-disable-next-line no-await-in-loop
		const response = await githubFetch(url, {method: 'GET'});

		// eslint-disable-next-line no-await-in-loop
		const json = /** @type {Issue[]} */ (await response.json());

		const pageIssues = json.filter((issue) => !issue.pull_request);

		process.stdout.write(`${pageIssues.length} issues\n`);
		issues.push(...pageIssues);

		const linkHeader = response.headers.get('Link');
		if (!linkHeader || !linkHeader.includes('rel="next"')) {
			// There is no "next" → last page
			break;
		}

		page += 1;
	}

	return issues;
};

/**
 * Filter issues to only search for them that have the same labels.
 * @param {string[]} issueLabels Labels of the issue to check.
 * @param {Issue[]} openIssues List of open issues.
 * @returns {Issue[]} Filtered list of open issues.
 */
const filterIssuesByLabels = (issueLabels, openIssues) => {
	if (
		!issueLabels.includes('new icon') &&
		!issueLabels.includes('update icon/data') &&
		!issueLabels.includes('breaking change')
	) {
		return openIssues;
	}

	return openIssues.filter((issue) => {
		const issueLabelNames = new Set(issue.labels.map((label) => label.name));
		if (issueLabelNames.has('new icon') && issueLabels.includes('new icon')) {
			return true;
		}

		if (
			issueLabelNames.has('update icon/data') &&
			issueLabels.includes('update icon/data')
		) {
			return true;
		}

		if (
			issueLabelNames.has('breaking change') &&
			issueLabels.includes('breaking change')
		) {
			return true;
		}

		return false;
	});
};

/**
 * Format title by removing excluded keywords.
 * @param {string} title Issue title.
 * @param {string[]} exclude Keywords to exclude.
 * @returns {string} Formatted title.
 */
function formatTitle(title, exclude) {
	if (!exclude) {
		return title;
	}

	let result = title;

	for (const keyword of exclude) {
		const trimmed = keyword.trim();
		if (trimmed.length === 0) {
			continue;
		}

		result = result.replaceAll(new RegExp(trimmed, 'igm'), '');
	}

	return result
		.replaceAll(/[^\p{L}\p{N}\p{M}\s]/gu, ' ')
		.replaceAll(/\s+/g, ' ')
		.trim();
}

/**
 * Search for potential duplicate issues.
 * @param {number} issueNumber Issue number to exclude from results.
 * @param {string} formattedIssueTitle Issue title to search for.
 * @param {Issue[]} openIssues List of open issues.
 * @returns {Issue[]} List of potential duplicate issues.
 */
const searchForPotentialDuplicates = (
	issueNumber,
	formattedIssueTitle,
	openIssues,
) => {
	const issues = [];
	for (const issue of openIssues) {
		if (issue.number === issueNumber) {
			continue;
		}

		issue.formattedTitle = formatTitle(issue.title, config.exclude);
		if (issue.formattedTitle.length < config.issue.minimumTitleLength) {
			continue;
		}

		issues.push(issue);
	}

	const searcher = new Searcher(issues, {
		threshold: config.threshold,
		keySelector: (issue) => issue.formattedTitle,
	});
	return searcher.search(formattedIssueTitle);
};

/**
 * Read required environment variables.
 * @throws {Error} If any required environment variable is missing.
 * @returns {{
 *   githubRepository: string,
 *   issueNumber: number,
 *   issueTitle: string,
 *   issueLabels: string[],
 *   dryRun: boolean,
 * }} Environment variables.
 */
const readEnv = () => {
	const {GITHUB_REPOSITORY, ISSUE_NUMBER, ISSUE_TITLE, ISSUE_LABELS, DRY_RUN} =
		process.env;
	if (
		GITHUB_REPOSITORY === undefined ||
		ISSUE_NUMBER === undefined ||
		ISSUE_TITLE === undefined ||
		ISSUE_LABELS === undefined
	) {
		throw new Error(
			'GITHUB_REPOSITORY, ISSUE_NUMBER, ISSUE_TITLE and ISSUE_LABELS environment variables are required.',
		);
	}

	return {
		githubRepository: GITHUB_REPOSITORY,
		issueNumber: Number(ISSUE_NUMBER),
		issueTitle: ISSUE_TITLE,
		issueLabels: ISSUE_LABELS.split(','),
		dryRun: DRY_RUN === 'true',
	};
};

/**
 * Main function.
 * @returns {Promise<number>} Exit code.
 */
const main = async () => {
	try {
		const {githubRepository, issueNumber, issueTitle, issueLabels, dryRun} =
			readEnv();
		const formattedIssueTitle = formatTitle(issueTitle, config.exclude);
		if (formattedIssueTitle.length === 0) {
			console.warn(
				'Issue title is empty after formatting, skipping duplicate check.',
			);
			return 0;
		}

		if (formattedIssueTitle.length < config.issue.minimumTitleLength) {
			console.warn(
				`Formatted issue title is too short ("${formattedIssueTitle}"), skipping duplicate check.`,
			);
			return 0;
		}

		const openIssues = await getAllOpenIssues(githubRepository);
		const sameLabelsIssues = filterIssuesByLabels(issueLabels, openIssues);

		const duplicates = searchForPotentialDuplicates(
			issueNumber,
			formattedIssueTitle,
			sameLabelsIssues,
		);
		if (duplicates.length > 0) {
			process.stdout.write(
				`Found ${duplicates.length} potential duplicates for issue #${issueNumber} with title "${issueTitle}".\n`,
			);
			for (const dup of duplicates) {
				process.stdout.write(`  + ${dup.title} → #${dup.number}\n`);
			}

			if (dryRun) {
				process.stdout.write(
					'Dry run enabled, not adding labels or comments.\n',
				);
			} else {
				await addLabels(githubRepository, issueNumber, ['potential duplicate']);
				// Limit the number of duplicates listed in the comment
				const maxDuplicates = config.maxDuplicates ?? duplicates.length;
				const limitedDuplicates = duplicates.slice(0, maxDuplicates);
				const duplicatesList = limitedDuplicates
					.map((issue) => `- ${issue.title} → #${issue.number}`)
					.join('\n');
				const reason =
					`This issue is potentially a duplicate of one of the following issues:\n\n` +
					duplicatesList +
					`\n\nIf you believe this is not a duplicate, please comment below to explain why.\n`;
				await commentWithReason(githubRepository, issueNumber, reason);
			}
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
