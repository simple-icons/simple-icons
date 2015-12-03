[![Simple Icons](/images/og.png)](https://simpleicons.org)

# Simple Icons

## Build Process

1. Acquire source vector file.
1. Simplify icon in vector editing tool (I use [Affinity Designer](https://affinity.serif.com/en-gb/)).
   - Constrain within a 16x16 viewbox.
   - Ensure there are no strokes.
   - Simplify and minimise paths.
   - Make all paths white.
1. Export SVG.
1. Run [SVGO](https://github.com/svg/svgo) on the SVG file.
1. Add object to [simple-icons.json](https://github.com/danleech/simple-icons/blob/gh-pages/src/simple-icons.json).
1. Run [build.js](https://github.com/danleech/simple-icons/blob/gh-pages/src/build.js) in Node.
