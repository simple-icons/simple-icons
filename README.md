[![Simple Icons](/images/og.png)](https://simpleicons.org)

# Simple Icons

## Build Process

1. Acquire source vector file.
1. Simplify icon in vector editing tool (I use [Affinity Designer](https://affinity.serif.com/en-gb/)).
1. Export SVG.
1. Run SVGO on the SVG file.
1. Add object to [simple-icons.json](https://github.com/danleech/simple-icons/blob/gh-pages/src/simple-icons.json).
1. Run [build.js](https://github.com/danleech/simple-icons/blob/gh-pages/src/build.js) in Node.
