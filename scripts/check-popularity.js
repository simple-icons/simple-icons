#!/usr/bin/env node
// @ts-check
/**
 * @file
 * Check if a brand meets the popularity requirements.
 */

import process from 'node:process';
import {input} from '@inquirer/prompts';
import chalk from 'chalk';

const GITHUB_STARS_THRESHOLD = 5000;
const GITHUB_STARS_PER_YEAR_THRESHOLD = 1000;
const NPM_WEEKLY_DOWNLOADS_THRESHOLD = 100_000;

// Helper to fetch JSON
const fetchJson = async (/** @type {string | URL | Request} */ url) => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
	}

	return response.json();
};

const checkGitHub = async (/** @type {string} */ url) => {
	try {
		const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
		if (!match) {
			return {valid: false};
		}

		const [, owner, repo] = match;

		process.stdout.write(
			chalk.blue(`Checking GitHub repository: ${owner}/${repo}...\n`),
		);

		const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
		const data = await fetchJson(apiUrl);

		const stars = data.stargazers_count;
		const createdAt = new Date(data.created_at);
		const now = new Date();
		const ageInYears =
			(now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
		const requiredStarsByAge = Math.ceil(
			ageInYears * GITHUB_STARS_PER_YEAR_THRESHOLD,
		);

		const passesStars = stars >= GITHUB_STARS_THRESHOLD;
		const passesAge = stars >= requiredStarsByAge;
		const passes = passesStars && passesAge;

		process.stdout.write(`\nStars: ${chalk.bold(stars)}\n`);
		process.stdout.write(`Age: ${chalk.bold(ageInYears.toFixed(1))} years\n`);
		process.stdout.write(
			`Region: Stars >= ${GITHUB_STARS_THRESHOLD} AND Stars >= 1000 * Age (${requiredStarsByAge})\n`,
		);

		if (passes) {
			process.stdout.write(
				chalk.green(`\n✅ PASS: Meets GitHub popularity criteria.\n`),
			);
		} else {
			process.stdout.write(
				chalk.red(`\n❌ FAIL: Does not meet GitHub popularity criteria.\n`),
			);
			if (!passesStars) {
				process.stdout.write(
					chalk.yellow(`- Needs at least ${GITHUB_STARS_THRESHOLD} stars.\n`),
				);
			}

			if (!passesAge) {
				process.stdout.write(
					chalk.yellow(
						`- Needs at least ${requiredStarsByAge} stars for its age.\n`,
					),
				);
			}
		}

		return {valid: true};
	} catch (error) {
		if (error instanceof Error) {
			process.stdout.write(
				chalk.red(`Error checking GitHub: ${error.message}\n`),
			);
		}

		return {valid: true}; // It was a GitHub URL, just failed to fetch
	}
};

const checkNpm = async (/** @type {string} */ url) => {
	try {
		// Support https://www.npmjs.com/package/name and just "name"
		let packageName = url;
		const match = url.match(/npmjs\.com\/package\/([^/]+)/);
		if (match) {
			packageName = match[1];
		}

		// Basic name validation or assume it is a package name if it doesn't look like a URL
		if (url.includes('http') && !match) {
			return {valid: false};
		}

		process.stdout.write(
			chalk.blue(`Checking NPM package: ${packageName}...\n`),
		);

		const apiUrl = `https://api.npmjs.org/downloads/point/last-week/${packageName}`;
		const data = await fetchJson(apiUrl);

		if (data.error) {
			throw new Error(data.error);
		}

		const {downloads} = data;
		const passes = downloads >= NPM_WEEKLY_DOWNLOADS_THRESHOLD;

		process.stdout.write(
			`\nWeekly Downloads: ${chalk.bold(downloads.toLocaleString())}\n`,
		);
		process.stdout.write(
			`Threshold: ${NPM_WEEKLY_DOWNLOADS_THRESHOLD.toLocaleString()}\n`,
		);

		if (passes) {
			process.stdout.write(
				chalk.green(`\n✅ PASS: Meets NPM popularity criteria.\n`),
			);
		} else {
			process.stdout.write(
				chalk.red(`\n❌ FAIL: Does not meet NPM popularity criteria.\n`),
			);
		}

		return {valid: true};
	} catch (error) {
		// If it looks like an NPM url but failed, we handle it.
		// If it was just a random string that isn't a package, we might have errored.
		if (url.includes('npmjs.com') && error instanceof Error) {
			process.stdout.write(chalk.red(`Error checking NPM: ${error.message}\n`));
			return {valid: true};
		}

		return {valid: false};
	}
};

process.stdout.write(chalk.bold('Simple Icons Popularity Checker\n'));
process.stdout.write(
	'Enter a URL (GitHub, NPM) to check contribution eligibility.\n',
);

while (true) {
	// eslint-disable-next-line no-await-in-loop
	const url = await input({message: 'URL (or Ctrl+C to exit):'});
	if (!url) {
		continue;
	}

	if (url.toLowerCase() === 'exit') {
		break;
	}

	let handled = false;

	// eslint-disable-next-line no-await-in-loop
	const ghResult = await checkGitHub(url);
	if (ghResult.valid) {
		handled = true;
	}

	if (!handled) {
		// eslint-disable-next-line no-await-in-loop
		const npmResult = await checkNpm(url);
		if (npmResult.valid) {
			handled = true;
		}
	}

	if (!handled) {
		process.stdout.write(
			chalk.yellow(
				'Unknown URL type or not supported yet. Try a GitHub or NPM URL.\n',
			),
		);
	}

	process.stdout.write('-'.repeat(40) + '\n');
}
