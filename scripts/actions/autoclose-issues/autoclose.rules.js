// @ts-check
/**
 * @file Auto-close rules for closing won't add icons.
 */

const autocloseTerm = 'This issue was automatically closed. Please refer to ';

/** @type {import('./autoclose.app.js').Config} */
const rules = [
	{
		patterns: [/matlab/iv],
		reason: autocloseTerm + '#1233.',
	},
	{
		patterns: [/disney\s*(?:plus|\+)?/iv],
		reason: autocloseTerm + '#2309.',
	},
	{
		patterns: [/british\s*petroleum/iv],
		reason: autocloseTerm + '#5849.',
	},
	{
		patterns: [
			/mattel/iv,
			/barbie/iv,
			/hot\s*wheels/iv,
			/fisher[\-\s]*price/iv,
		],
		reason: autocloseTerm + '#6656.',
	},
	{
		patterns: [/oracle/iv, /java(?:\s|$)/iv],
		reason: autocloseTerm + '#7374.',
	},
	{
		patterns: [/microchip/iv],
		reason: autocloseTerm + '#9373.',
	},
	{
		patterns: [/adobe/iv, /photoshop/iv],
		reason: autocloseTerm + '#10018.',
	},
	{
		patterns: [/microsoft/iv, /vs\s*code/iv, /visual\s*studio/iv, /windows/iv],
		reason: autocloseTerm + '#11236.',
	},
	{
		patterns: [/linked\s*in/iv],
		reason: autocloseTerm + '#11236 #11372.',
	},
	{
		patterns: [/amazon/iv, /aws/iv],
		reason: autocloseTerm + '#13056.',
	},
	{
		patterns: [/yahoo/iv, /engadget/iv, /aol/iv],
		reason: autocloseTerm + '#9861.',
	},
	{
		patterns: [/twilio/iv, /sendgrid/iv, /authy/iv, /segment/iv],
		reason: autocloseTerm + '#13386.',
	},
];

export default rules;
