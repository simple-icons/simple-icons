// @license magnet:?xt=urn:btih:90dc5c0be029de84e523b9b3922520e79e0e6f08&dn=cc0.txt CC0
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
    )
}
// @ license-end
