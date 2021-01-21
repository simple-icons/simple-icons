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
            .replace(/[ !:’'°]/g, "")
            .replace(/[àáâãäāăą]/g, "a")
            .replace(/[çćĉċč]/g, "c")
            .replace(/[ďđ]/g, "d")
            .replace(/[èéêëēĕėęě]/g, "e")
            .replace(/[ĝğġģ]/g, "g")
            .replace(/[ĥħ]/g, "h")
            .replace(/[ìíîïĩīĭįı]/g, "i")
            .replace(/[ĵ]/g, "j")
            .replace(/[ķĸ]/g, "k")
            .replace(/[ĺļľŀł]/g, "l")
            .replace(/[ñńņň]/g, "n")
            .replace(/[òóôõöōŏő]/g, "o")
            .replace(/[ŕŗř]/g, "r")
            .replace(/[śŝşš]/g, "s")
            .replace(/[ţťŧ]/g, "t")
            .replace(/[ùúûüũūŭůűų]/g, "u")
            .replace(/[ŵ]/g, "w")
            .replace(/[ýÿŷ]/g, "y")
            .replace(/[źżž]/g, "z")
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
