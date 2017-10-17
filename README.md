<p align="center">
<a href="https://simpleicons.org/">
<img src="https://simpleicons.org/icons/simpleicons.svg" alt="Simple Icons" width=64 height=64>
</a>
<h3 align="center">Simple Icons</h3>
<p align="center">
Free SVG icons for popular brands. See them all on one page at <a href="https://simpleicons.org">SimpleIcons.org</a>. Contributions, corrections & requests can be made on GitHub. Started by <a href="https://twitter.com/bathtype">Dan Leech</a>.</p>
</p>

## Usage

### General Usage

Icons can be downloaded as SVGs directly from [our website](https://simpleicons.org/) - simply click the icon you want, and the download should start automatically.

### Node Usage

The icons are also available through our npm and bower packages. To install, simply run:

```bash
# For npm
$ npm install simple-icons

# For Bower
$ bower install simple-icons
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
