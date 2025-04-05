/**
 * @file Auto-close rules for closing won't add icons.
 */

const autocloseTerm = 'This issue was automatically closed. Please refer to ';

const rules = [
	{
		patterns: [/matlab/i],
		reason: autocloseTerm + '#1233.',
	},
	{
		patterns: [/disney/i],
		reason: autocloseTerm + '#2309.',
	},
	{
		patterns: [/oracle/i, /java\s/i, /java$/i],
		reason: autocloseTerm + '#7374.',
	},
	{
		patterns: [/adobe/i, /photoshop/i],
		reason: autocloseTerm + '#10018.',
	},
	{
		patterns: [/microsoft/i, /vs\s?code/, /visual\s?studio/i, /windows/i],
		reason: autocloseTerm + '#11236.',
	},
	{
		patterns: [/linked\s?in/i],
		reason: autocloseTerm + '#11236 #11372.',
	},
];

export default rules;
