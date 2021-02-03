module.exports = {
    /**
     * Converts a brand title into a filename (not a full path)
     * @param {String} title The title to convert
     */
    titleToFilename: title => (
        title.toLowerCase()
            .replace(/\+/g, "plus")
            .replace(/^\./, "dot-")
            .replace(/\.$/, "-dot")
            .replace(/\./g, "-dot-")
            .replace(/^&/, "and-")
            .replace(/&$/, "-and")
            .replace(/&/g, "-and-")
            .replace(/đ/g, "d")
            .replace(/ħ/g, "h")
            .replace(/ı/g, "i")
            .replace(/ĸ/g, "k")
            .replace(/ŀ/g, "l")
            .replace(/ł/g, "l")
            .replace(/ß/g, "ss")
            .replace(/ŧ/g, "t")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\-]/g, "")
    ),

    /**
     * Converts a brand title in HTML friendly format into a brand title (as it
     * is seen in simple-icons.json)
     * @param {String} htmlFriendlyTitle The title to convert
     */
    htmlFriendlyToTitle: htmlFriendlyTitle => (
      htmlFriendlyTitle
        .replace(/&apos;/g, "’")
        .replace(/&amp;/g, "&")
    )
}
