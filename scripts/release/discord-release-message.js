#!/usr/bin/env node
/**
 * @file
 * Send release message to Discord #releases channel.
 */

import process from 'node:process';

const releaseVersion = process.argv[2];
const discordReleasesRoleId = process.env.DISCORD_RELEASES_ROLE_ID;
const discordReleasesWebhookUrl = process.env.DISCORD_RELEASES_WEBHOOK_URL;
const githubReleaseUrl = `https://github.com/simple-icons/simple-icons/releases/tag/${releaseVersion}`;

try {
	await globalThis.fetch(discordReleasesWebhookUrl, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			content: `<@&${discordReleasesRoleId}> ${githubReleaseUrl}`,
		}),
	});
} catch {
	console.error('Failed to send release message to Discord.');
	process.exit(1);
}
