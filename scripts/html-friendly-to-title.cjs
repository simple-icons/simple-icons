module.exports = {
  /**
   * Converts a brand title in HTML/SVG friendly format into a brand title (as
   * it is seen in simple-icons.json)
   * @param {String} htmlFriendlyTitle The title to convert
   */
  htmlFriendlyToTitle: (htmlFriendlyTitle) =>
    htmlFriendlyTitle
      .replace(/&#([0-9]+);/g, (_, num) => String.fromCharCode(parseInt(num)))
      .replace(
        /&(quot|amp|lt|gt);/g,
        (_, ref) => ({ quot: '"', amp: '&', lt: '<', gt: '>' }[ref]),
      ),
};
