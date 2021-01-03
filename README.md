<p align="center">
<a href="https://simpleicons.org/">
<img src="https://simpleicons.org/icons/simpleicons.svg" alt="Simple Icons" width=64 height=64>
</a>
<h3 align="center">Simple Icons</h3>
<p align="center">
Over 1500 Free SVG icons for popular brands. See them all on one page at <a href="https://simpleicons.org">SimpleIcons.org</a>. Contributions, corrections & requests can be made on GitHub. Started by <a href="https://twitter.com/bathtype">Dan Leech</a>.</p>
</p>

## Usage

### General Usage

Icons can be downloaded as SVGs directly from [our website](https://simpleicons.org/) - simply click the icon you want, and the download should start automatically.

### CDN Usage

Icons can be served from a CDN such as [JSDelivr](https://www.jsdelivr.com/package/npm/simple-icons) or [Unpkg](https://unpkg.com/browse/simple-icons/). Simply use the `simple-icons` npm package and specify a version in the URL like the following:

```html
<img height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v4/icons/[ICON NAME].svg" />
<img height="32" width="32" src="https://unpkg.com/simple-icons@v4/icons/[ICON NAME].svg" />
```

Where `[ICON NAME]` is replaced by the icon name, for example:

```html
<img height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v4/icons/simpleicons.svg" />
<img height="32" width="32" src="https://unpkg.com/simple-icons@v4/icons/simpleicons.svg" />
```

These examples use the latest major version. This means you won't receive any updates following the next major release. You can use `@latest` instead to receive updates indefinitely. However, this will result in a `404` error if the icon is removed.

### Node Usage

The icons are also available through our npm package. To install, simply run:

```
$ npm install simple-icons
```

The API can then be used as follows:

```javascript
const simpleIcons = require('simple-icons');

console.log(simpleIcons.get('Simple Icons'));

/*
{
    title: 'Simple Icons',
    slug: 'simpleicons',
    hex: '111111',
    source: 'https://simpleicons.org/',
    svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">...</svg>',
    path: 'M12 12v-1.5c-2.484 ...'
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
    slug: 'simpleicons',
    hex: '111111',
    source: 'https://simpleicons.org/',
    svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">...</svg>',
    path: 'M12 12v-1.5c-2.484 ...'
}
*/
```

#### TypeScript Usage

There are also TypeScript type definitions for the Node package. To use them, simply run:

```
$ npm install @types/simple-icons
```

### PHP Usage

The icons are also available through our Packagist package. To install, simply run:

```
$ composer require simple-icons/simple-icons
```

The package can then be used as follows:

```php
<?php

echo file_get_contents('path/to/package/icons/simple-icons.svg');

// <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">...</svg>
?>
```

## Third Party Extensions

### Drupal

Icons are also available as a [Drupal module](https://www.drupal.org/project/simple_icons) created by [Phil Wolstenholme](https://www.drupal.org/u/phil-wolstenholme).

### Flutter

Icons are also available as a [Flutter package](https://pub.dev/packages/flutter_brand_icons) created by  [@muj-programmer](https://github.com/muj-programmer).

### Home Assistant

Icons are also available as a [Home Assistant plugin](https://github.com/vigonotion/hass-simpleicons) created by  [@vigonotion](https://github.com/vigonotion/).

### Kirby

Icons are also available as a [Kirby plugin](https://github.com/runxel/kirby3-simpleicons) created by  [@runxel](https://github.com/runxel).

### React

Icons are also available as a [React package](https://github.com/icons-pack/react-simple-icons) created by  [@wootsbot](https://github.com/wootsbot).

### Svelte

Icons are also available as a [Svelte package](https://github.com/icons-pack/svelte-simple-icons) created by  [@wootsbot](https://github.com/wootsbot).

### Vue

Icons are also available as a [Vue package](https://github.com/mainvest/vue-simple-icons) created by  [@noahlitvin](https://github.com/noahlitvin).

### WordPress

Icons are also available as a [WordPress plugin](https://wordpress.org/plugins/simple-icons/) created by  [@tjtaylo](https://github.com/tjtaylo).

## Status

[![Build status](https://img.shields.io/github/workflow/status/simple-icons/simple-icons/Verify/develop?logo=github)](https://github.com/simple-icons/simple-icons/actions?query=workflow%3AVerify+branch%3Adevelop)
[![npm version](https://img.shields.io/npm/v/simple-icons.svg?logo=npm)](https://www.npmjs.com/package/simple-icons)
[![Packagist version](https://img.shields.io/packagist/v/simple-icons/simple-icons)](https://packagist.org/packages/simple-icons/simple-icons)
