/**
 * Converts a brand title (as it is seen in simple-icons.json) into a brand
 * title in HTML/SVG friendly format.
 * @param {String} brandTitle The title to convert
 */
export const titleToHtmlFriendly = (brandTitle) =>
  brandTitle
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/./g, (char) => {
      const charCode = char.charCodeAt(0);
      return charCode > 127 ? `&#${charCode};` : char;
    });

/**
 * Converts a brand title in HTML/SVG friendly format into a brand title (as
 * it is seen in simple-icons.json)
 * @param {String} htmlFriendlyTitle The title to convert
 */
export const htmlFriendlyToTitle = (htmlFriendlyTitle) =>
  htmlFriendlyTitle
    .replace(/&#([0-9]+);/g, (_, num) => String.fromCharCode(parseInt(num)))
    .replace(
      /&(quot|amp|lt|gt);/g,
      (_, ref) => ({ quot: '"', amp: '&', lt: '<', gt: '>' }[ref]),
    );

export const getSvg = (icon) =>
  `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>${titleToHtmlFriendly(
    icon.title,
  )}</title><path d="${icon.path}"/></svg>`;
