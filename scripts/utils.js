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
            .replace(/[ !’]/g, "")
            .replace(/à|á|â|ã|ä/, "a")
            .replace(/ç/, "c")
            .replace(/è|é|ê|ë/, "e")
            .replace(/ì|í|î|ï/, "i")
            .replace(/ñ/, "n")
            .replace(/ò|ó|ô|õ|ö/, "o")
            .replace(/ù|ú|û|ü/, "u")
            .replace(/ý|ÿ/, "y")
    )
}