# Contributing

This repository welcomes contributions and corrections. Before submitting a pull request, ensure that you respect these guidelines for SVGs:

  - Include the SVG namespace declaration `xmlns="http://www.w3.org/2000/svg"`. This is not required if the SVG is included inline on HTML5 web pages.
  - Include a descriptive `<title>` element for accessibility. For example, `<title>GitHub icon</title>`.
  - Add `aria-labelledby="title"` and `role="img"` to the `<svg>` element to improve screen reader support.
  - Use a `viewBox` of 24 by 24, following [Google’s Material Design guidelines for system icons](https://material.io/guidelines/style/icons.html#icons-system-icons).
  - Ensure that all paths and strokes have been converted to fills.
  - Ensure your SVG is monochromatic. Remove all fill colors so that icons default to black.
  - Minify your SVG after exporting it. We recommend using [SVGO](https://github.com/svg/svgo) or [SVGOMG](https://jakearchibald.github.io/svgomg/) to automate this process.

## JSON data for simpleicons.org

In addition to following the guidelines for SVGs, list new icons in the `_data/simple-icons.json` file. Each icon in the array has three required values:
 
  - The `title` of the new SVG.
  - A `hex` color value that matches the brand or logo's main accent color. (Without the `#` pound symbol.)
  - The `source` URL of the logo being used.

Here is the object for the GitHub logo as an example:

```json
{
  "title": "GitHub",
  "hex": "181717",
  "source": "https://github.com/logos"
},
```

## SVG example

Before minification, your SVG should look follow the template below:

```svg
<svg aria-labelledby="title" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <title>[BRAND] icon</title>
  <path [VALUE] />
</svg>
```

While the parent `<svg>` element can sometimes contain other attributes, the attributes listed above are the only necessary ones. You can remove safely remove attributes like `width` and `height`, or clean them using a tool like [SVGO](https://github.com/svg/svgo) or [SVGOMG](https://jakearchibald.github.io/svgomg/).

Here is the un-minified contents of the GitHub icon, for reference:

```svg
<svg aria-labelledby="title" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.414">
  <title>GitHub icon</title>
  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
</svg>
```

