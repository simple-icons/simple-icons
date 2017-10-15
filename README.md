# Simple Icons

Free SVG icons for popular brands, started by [Dan Leech](https://twitter.com/bathtype). [See them all on one page at **simpleicons.org**](https://simpleicons.org). Contributions, corrections & requests can be made on GitHub.

## Usage

Icons can be downloaded as SVGs directly from [our website](https://simpleicons.org/) - simply click the icon you want, and the download should start automatically.

### Node Usage

The icons are also available through our npm package. To install, simply run:

```
$ npm install simple-icons
```

The API can then be used as follows:

```javascript
const simpleIcons = require('simple-icons');

console.log(simpleIcons['Google+']);

/*
{
    title: 'Google+',
    hex: 'DC4E41',
    source: 'https://developers.google.com/+/branding-guidelines',
    svg: '<svg aria-labelledby="simpleicons-googleplus-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">...</svg>'
}
*/
```

## Status

[![Build Status](https://img.shields.io/travis/simple-icons/simple-icons/develop.svg)](https://travis-ci.org/simple-icons/simple-icons)
[![npm version](https://img.shields.io/npm/v/simple-icons.svg)](https://www.npmjs.com/package/simple-icons)
