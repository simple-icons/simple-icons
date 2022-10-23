<p align="center">
<img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/simpleicons.svg" alt="Simple Icons" width=70>
<h3 align="center">Simple Icons</h3>
<p align="center">
Over 2400 Free SVG icons for popular brands. See them all on one page at <a href="https://simpleicons.org">SimpleIcons.org</a>. Contributions, corrections & requests can be made on GitHub.</p>
</p>

<p align="center">
<a href="https://github.com/simple-icons/simple-icons/actions?query=workflow%3AVerify+branch%3Adevelop"><img src="https://img.shields.io/github/workflow/status/simple-icons/simple-icons/Verify/develop?logo=github&label=tests" alt="Build status"/></a>
<a href="https://www.npmjs.com/package/simple-icons"><img src="https://img.shields.io/npm/v/simple-icons.svg?logo=npm" alt="NPM version"/></a>
<a href="https://packagist.org/packages/simple-icons/simple-icons"><img src="https://img.shields.io/packagist/v/simple-icons/simple-icons?logo=packagist&logoColor=white" alt="Build status"/></a>
</p>
<p align="center">
<a href="https://simpleicons.org"><img src="https://img.shields.io/badge/dynamic/json?color=informational&label=icons&prefix=%20&logo=simpleicons&query=%24.icons.length&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsimple-icons%2Fsimple-icons%2Fdevelop%2F_data%2Fsimple-icons.json" alt="Number of icons currently in the library"/></a>
<a href="https://opencollective.com/simple-icons"><img src="https://img.shields.io/opencollective/all/simple-icons?logo=opencollective" alt="Backers and sponsors on Open Collective"/></a>
</p>

## Usage

> :information_source: We ask that all users read our [legal disclaimer](./DISCLAIMER.md) before using icons from Simple Icons.

### General Usage

Icons can be downloaded as SVGs directly from [our website](https://simpleicons.org/) - simply click the download button of the icon you want, and the download will start automatically.

### CDN Usage

Icons can be served from a CDN such as [JSDelivr](https://www.jsdelivr.com/package/npm/simple-icons) or [Unpkg](https://unpkg.com/browse/simple-icons/). Simply use the `simple-icons` npm package and specify a version in the URL like the following:

```html
<img height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/[ICON SLUG].svg" />
<img height="32" width="32" src="https://unpkg.com/simple-icons@v7/icons/[ICON SLUG].svg" />
```

Where `[ICON SLUG]` is replaced by the [slug] of the icon you want to use, for example:

```html
<img height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/simpleicons.svg" />
<img height="32" width="32" src="https://unpkg.com/simple-icons@v7/icons/simpleicons.svg" />
```

These examples use the latest major version. This means you won't receive any updates following the next major release. You can use `@latest` instead to receive updates indefinitely. However, this will result in a `404` error if the icon is removed.

### Node Usage <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nodedotjs.svg" alt="Node" align=left width=24>

The icons are also available through our npm package. To install, simply run:

```shell
npm install simple-icons
```

All icons are imported from a single file, where `[ICON SLUG]` is replaced by a capitalized [slug]. We highly recommend using a bundler that can tree shake such as [webpack](https://webpack.js.org/) to remove the unused icon code:
```javascript
// Import a specific icon by its slug as:
// import { si[ICON SLUG] } from 'simple-icons/icons'

// For example:
// use import/esm to allow tree shaking
import { siSimpleicons } from 'simple-icons/icons';
// or with require/cjs
const { siSimpleicons } = require('simple-icons/icons');
```

It will return an icon object:

```javascript
console.log(siSimpleicons);

/*
{
    title: 'Simple Icons',
    slug: 'simpleicons',
    hex: '111111',
    source: 'https://simpleicons.org/',
    svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">...</svg>',
    path: 'M12 12v-1.5c-2.484 ...',
    guidelines: 'https://simpleicons.org/styleguide',
    license: {
        type: '...',
        url: 'https://example.com/'
    }
}

NOTE: the `guidelines` entry will be `undefined` if we do not yet have guidelines for the icon.
NOTE: the `license` entry will be `undefined` if we do not yet have license data for the icon.
*/
```

#### TypeScript Usage <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/typescript.svg" alt="Typescript" align=left width=19 height=19>

Type definitions are bundled with the package.

### PHP Usage <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/php.svg" alt="Php" align=left width=24 height=24>

The icons are also available through our Packagist package. To install, simply run:

```shell
composer require simple-icons/simple-icons
```

The package can then be used as follows, where `[ICON SLUG]` is replaced by a [slug]:

```php
<?php
// Import a specific icon by its slug as:
echo file_get_contents('path/to/package/icons/[ICON SLUG].svg');

// For example:
echo file_get_contents('path/to/package/icons/simpleicons.svg');

// <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">...</svg>
?>
```

## Third-Party Extensions

| Extension | Author |
| :-- | :-- |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/angular.svg" alt="Angular" align=left width=24 height=24> [Angular Module](https://github.com/avmaisak/ngx-simple-icons) | [@avmaisak](https://github.com/avmaisak) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/blazor.svg" alt="Blazor" align=left width=24 height=24> [Blazor Nuget](https://github.com/TimeWarpEngineering/timewarp-simple-icons) | [@TimeWarpEngineering](https://github.com/TimeWarpEngineering) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/blender.svg" alt="Blender" align=left width=24 height=24> [Blender add-on](https://github.com/mondeja/simple-icons-blender) | [@mondeja](https://github.com/mondeja) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/diagramsdotnet.svg" alt="Drawio" align=left width=24 height=24> [Drawio library](https://github.com/mondeja/simple-icons-drawio) | [@mondeja](https://github.com/mondeja) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/drupal.svg" alt="Drupal" align=left width=24 height=24> [Drupal module](https://www.drupal.org/project/simple_icons) | [Phil Wolstenholme](https://www.drupal.org/u/phil-wolstenholme) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/figma.svg" alt="Figma" align=left width=24 height=24> [Figma plugin](https://www.figma.com/community/plugin/1149614463603005908/Simple-Icons) | [@LitoMore](https://github.com/LitoMore) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/flutter.svg" alt="Flutter" align=left width=24 height=24> [Flutter package](https://pub.dev/packages/simple_icons) | [@jlnrrg](https://jlnrrg.github.io/) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/hexo.svg" alt="Hexo" align=left width=24 height=24> [Hexo plugin](https://github.com/nidbCN/hexo-simpleIcons) | [@nidbCN](https://github.com/nidbCN/) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/homeassistant.svg" alt="Home Assistant" align=left width=24 height=24> [Home Assistant plugin](https://github.com/vigonotion/hass-simpleicons) | [@vigonotion](https://github.com/vigonotion/) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/hugo.svg" alt="Hugo" align=left width=24 height=24> [Hugo module](https://github.com/foo-dogsquared/hugo-mod-simple-icons) | [@foo-dogsquared](https://github.com/foo-dogsquared) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/openjdk.svg" alt="OpenJDK" align=left width=24 height=24> [Java library](https://github.com/silentsoft/simpleicons4j) | [@silentsoft](https://github.com/silentsoft) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/jetpackcompose.svg" alt="Jetpack Compose" align=left width=24 height=24> [Jetpack Compose library](https://github.com/DevSrSouza/compose-icons) | [@devsrsouza](https://github.com/devsrsouza/) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/kirby.svg" alt="Kirby" align=left width=24 height=24> [Kirby plugin](https://github.com/runxel/kirby3-simpleicons) | [@runxel](https://github.com/runxel) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/latex.svg" alt="LaTeX" align=left width=24 height=24> [LaTeX package](https://github.com/ineshbose/simple-icons-latex) | [@ineshbose](https://github.com/ineshbose) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/laravel.svg" alt="Laravel" align=left width=24 height=24> [Laravel Package](https://github.com/ublabs/blade-simple-icons) | [@adrian-ub](https://github.com/adrian-ub) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/python.svg" alt="Python" align=left width=24 height=24> [Python package](https://github.com/sachinraja/simple-icons-py) | [@sachinraja](https://github.com/sachinraja) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/react.svg" alt="React" align=left width=24 height=24> [React package](https://github.com/icons-pack/react-simple-icons) | [@wootsbot](https://github.com/wootsbot) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/elgato.svg" alt="Simple Icons" align=left width=24 height=24> [Stream Deck icon pack](https://github.com/mackenly/simple-icons-stream-deck) | [@mackenly](https://github.com/mackenly) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/svelte.svg" alt="Svelte" align=left width=24 height=24> [Svelte package](https://github.com/icons-pack/svelte-simple-icons) | [@wootsbot](https://github.com/wootsbot) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/vuedotjs.svg" alt="Vue" align=left width=24 height=24> [Vue 3 package](https://github.com/wyatt-herkamp/vue3-simple-icons) | [@wyatt-herkamp](https://github.com/wyatt-herkamp) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/vuedotjs.svg" alt="Vue" align=left width=24 height=24> [Vue package](https://github.com/mainvest/vue-simple-icons) | [@noahlitvin](https://github.com/noahlitvin) |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/wordpress.svg" alt="Wordpress" align=left width=24 height=24> [WordPress plugin](https://wordpress.org/plugins/simple-icons/) | [@tjtaylo](https://github.com/tjtaylo) |

## Contribute

[![Good first issues open](https://img.shields.io/github/issues/simple-icons/simple-icons/good%20first%20issue?label=good%20first%20issues&logo=git&logoColor=white)](https://github.com/simple-icons/simple-icons/labels/good%20first%20issue)

Information describing how to contribute can be found in the file [CONTRIBUTING.md](https://github.com/simple-icons/simple-icons/blob/develop/CONTRIBUTING.md)

[slug]: https://github.com/simple-icons/simple-icons/blob/master/slugs.md
