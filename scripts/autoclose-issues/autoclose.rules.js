// @ts-check
/**
 * @file Auto-close rules for closing won't add icons.
 */

const autocloseTerm = 'This issue was automatically closed. Please refer to ';

/** @type {import('./autoclose.app.js').Config} */
const rules = [
	{
		patterns: [/matlab/i],
		reason: autocloseTerm + '#1233.',
	},
	{
		patterns: [/disney\s*(?:plus|\+)?/i],
		reason: autocloseTerm + '#2309.',
	},
	{
		patterns: [/british\s*petroleum/i],
		reason: autocloseTerm + '#5849.',
	},
	{
		patterns: [/mattel/i, /barbie/i, /hot\s*wheels/i, /fisher[-\s]*price/i],
		reason: autocloseTerm + '#6656.',
	},
	{
		patterns: [/oracle/i, /java(?:\s|$)/i],
		reason: autocloseTerm + '#7374.',
	},
	{
		patterns: [/microchip/i],
		reason: autocloseTerm + '#9373.',
	},
	{
		patterns: [/adobe/i, /photoshop/i],
		reason: autocloseTerm + '#10018.',
	},
	{
		patterns: [/microsoft/i, /vs\s*code/, /visual\s*studio/i, /windows/i],
		reason: autocloseTerm + '#11236.',
	},
	{
		patterns: [/linked\s*in/i],
		reason: autocloseTerm + '#11236 #11372.',
	},
	{
		patterns: [/amazon/i, /aws/i],
		reason: autocloseTerm + '#13056.',
	},
	{
		patterns: [/yahoo/i, /engadget/i, /aol/i],
		reason: autocloseTerm + '#9861.',
	},
];

export default rules;
