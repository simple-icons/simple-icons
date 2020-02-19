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
            .replace(/[ !:’]/g, "")
            .replace(/à|á|â|ã|ä/g, "a")
            .replace(/ç/g, "c")
            .replace(/è|é|ê|ë/g, "e")
            .replace(/ì|í|î|ï/g, "i")
            .replace(/ñ/g, "n")
            .replace(/ò|ó|ô|õ|ö/g, "o")
            .replace(/ù|ú|û|ü/g, "u")
            .replace(/ý|ÿ/g, "y")
    ),

    /**
     * Converts a brand title in HTML friendly format into a brand title (as it
     * is seen in simple-icons.json)
     * @param {String} htmlFriendlyTitle The title to convert
     */
    htmlFriendlyToTitle: htmlFriendlyTitle => (
      htmlFriendlyTitle
        .replace(/&amp;/g, "&")
        .replace(/&apos;/g, "’")
    )
}
