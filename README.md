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

### CDN Usage

Icons can be served from a CDN such as [JSDelivr](https://www.jsdelivr.com/package/npm/simple-icons) or [Unpkg](https://unpkg.com). Simply use the `simple-icons` npm package and specify a version in the URL like the following:

```html
<img height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/[ICON NAME].svg" />
<img height="32" width="32" src="https://unpkg.com/simple-icons@latest/icons/[ICON NAME].svg" />
```

Where `[ICON NAME]` is replaced by the icon name, for example:

```html
<img height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/simpleicons.svg" />
<img height="32" width="32" src="https://unpkg.com/simple-icons@latest/icons/simpleicons.svg" />
```

### Node Usage

The icons are also available through our npm package. To install, simply run:

```
$ npm install simple-icons
```

The API can then be used as follows:

```javascript
const simpleIcons = require('simple-icons');

console.log(simpleIcons['Simple Icons']);

/*
{
    title: 'Simple Icons',
    hex: '111111',
    source: 'https://simpleicons.org/',
    svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">...</svg>'
}
*/
```

Alternatively you can import the needed icons individually.
This is useful if you are e.g. compiling your code with [webpack](https://webpack.js.org/) and therefore have to be mindful of your package size:

```javascript
const icon = require('simple-icons/icons/simpleicons');

console.log(icon);

/*
{
    title: 'Simple Icons',
    hex: '111111',
    source: 'https://simpleicons.org/',
    svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">...</svg>'
}
*/
```

## Third Party Extensions

### WordPress

Icons are also available on WordPress through a simple plugin created by [@tjtaylo](https://github.com/tjtaylo), which you can find [here](https://wordpress.org/plugins/simple-icons/).

## Status

[![Build Status](https://img.shields.io/travis/simple-icons/simple-icons/develop.svg)](https://travis-ci.org/simple-icons/simple-icons)
[![npm version](https://img.shields.io/npm/v/simple-icons.svg)](https://www.npmjs.com/package/simple-icons)
