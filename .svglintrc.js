module.exports = {
    rules: {
        elm: {
            "svg": 1,
            "svg > title": 1,
            "g": false,
        },
        attr: [
            { // ensure that the SVG elm has the appropriate attrs
                "aria-labelledby": /^simpleicons-.+-icon$/,
                "role": "img",
                "viewBox": "0 0 24 24",
                "xmlns": "http://www.w3.org/2000/svg",
                
                "rule::selector": "svg",
                "rule::whitelist": true,
            },
            { // ensure that the title elm has the appropriate attr
                "id": /^simpleicons-.+-icon$/,

                "rule::selector": "svg > title",
                "rule::whitelist": true,
            }
        ],
        custom: [
            // ensure that aria-labelledby and id match
            function checkValidAria(reporter, $, ast) {
                const labelledByValue = $.find("svg").attr("aria-labelledby");
                const $title = $.find("svg > title");
                const titleIdValue = $title.attr("id");
                if (labelledByValue !== titleIdValue) {
                    reporter.error(
                        `'aria-labelledby' and 'id' should match, were '${labelledByValue}' and '${titleIdValue}'`,
                        $title[0],
                        ast
                    );
                }
            }
        ]
    }
};
