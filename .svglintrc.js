module.exports = {
    rules: {
        elm: {
            "svg": 1,
            "svg > title": 1,
            "g": false,
        },
        attr: [
            { // ensure that the SVG elm has the appropriate attrs
                "role": "img",
                "viewBox": "0 0 24 24",
                "xmlns": "http://www.w3.org/2000/svg",

                "rule::selector": "svg",
                "rule::whitelist": true,
            },
            { // ensure that the title elm has the appropriate attr
                "rule::selector": "svg > title",
                "rule::whitelist": true,
            }
        ]
    }
};
