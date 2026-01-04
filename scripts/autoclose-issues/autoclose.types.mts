/**
 * @file Types for the auto-close script.
 */

export type Rule = {
	/** The pattern to match against the issue title. */
	patterns: RegExp[];
	/** The issue numbers to include in the reason text. */
	reason: string;
};

export type Issue = {
	/** Issue labels. */
	labels: Array<{name: string}>;
	/** Issue state, possible values are 'open' and 'closed'. */
	state: 'open' | 'closed';
	/** Issue title. */
	title: string;
	/** Issue body. */
	body: string;
};
