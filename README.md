# Simple Icons

SVG icons for popular brands. [See them all on one page at **simpleicons.org**](https://simpleicons.org).

## Want to contribute?

1. Find an official source vector image.
2. Use your SVG editor of choice to produce a monochrome icon (with a view to keeping the file size as small as possible).
   - See [CSS Tricks](https://css-tricks.com/understanding-and-manually-improving-svg-optimization/)’s great article on manual SVG optimisation.
   - Please centre icons in a 16&times;16 pixel viewbox, for consistency.
3. Optimise the SVG using [SVGO](https://github.com/svg/svgo) and add it to the `/icons` directory.
4. Add an entry to `/src/simple-icons.json` with:
   - The icon title
   - The HEX colour value
   - The URL of the source vector image (or the page it’s available at)
