<p align="center">
<img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/simpleicons.svg" alt="Simple Icons" width=70>
<h3 align="center">Simple Icons</h3>
<p align="center">
Over 3100 Free SVG icons for popular brands. See them all on one page at <a href="https://simpleicons.org">SimpleIcons.org</a>. Contributions, corrections & requests can be made on GitHub.</p>
</p>

<p align="center">
<a href="https://github.com/simple-icons/simple-icons/actions?query=workflow%3AVerify+branch%3Adevelop"><img src="https://img.shields.io/github/actions/workflow/status/simple-icons/simple-icons/verify.yml?branch=develop&logo=github&label=tests" alt="Build status"/></a>
<a href="https://www.npmjs.com/package/simple-icons"><img src="https://img.shields.io/npm/v/simple-icons.svg?logo=npm" alt="NPM version"/></a>
<a href="https://packagist.org/packages/simple-icons/simple-icons"><img src="https://img.shields.io/packagist/v/simple-icons/simple-icons?logo=packagist&logoColor=white" alt="Build status"/></a>
<br/>
<a href="https://simpleicons.org"><img src="https://img.shields.io/badge/dynamic/json?color=informational&label=icons&prefix=%20&logo=simpleicons&query=%24.icons.length&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsimple-icons%2Fsimple-icons%2Fdevelop%2F_data%2Fsimple-icons.json" alt="Number of icons currently in the library"/></a>
<a href="https://discord.gg/vUXFa7t5xJ"><img src="https://img.shields.io/discord/1142044630909726760?logo=discord&logoColor=white&label=discord" alt="Number of users active in our Discord server" /></a>
<a href="https://opencollective.com/simple-icons"><img src="https://img.shields.io/opencollective/all/simple-icons?logo=opencollective" alt="Backers and sponsors on Open Collective"/></a>
</p>

## Usage

> **Important**\
> We ask that all users read our [legal disclaimer](https://github.com/simple-icons/simple-icons/blob/develop/DISCLAIMER.md) before using icons from Simple Icons.

### General Usage

Icons can be downloaded as SVGs directly from [our website](https://simpleicons.org/) - simply click the download button of the icon you want, and the download will start automatically.

### CDN Usage

Icons can be served from a CDN such as [jsDelivr](https://www.jsdelivr.com/package/npm/simple-icons) or [Unpkg](https://unpkg.com/browse/simple-icons/). Simply use the `simple-icons` npm package and specify a version in the URL like the following:

```html
<img height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/[ICON SLUG].svg" />
<img height="32" width="32" src="https://unpkg.com/simple-icons@v11/icons/[ICON SLUG].svg" />
```

Where `[ICON SLUG]` is replaced by the [slug] of the icon you want to use, for example:

```html
<img height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/simpleicons.svg" />
<img height="32" width="32" src="https://unpkg.com/simple-icons@v11/icons/simpleicons.svg" />
```

These examples use the latest major version. This means you won't receive any updates following the next major release. You can use `@latest` instead to receive updates indefinitely. However, this will result in a `404` error if the icon is removed.

#### CDN with colors

We also provide a CDN service which allows you to use colors.

```html
<img height="32" width="32" src="https://cdn.simpleicons.org/[ICON SLUG]" />
<img height="32" width="32" src="https://cdn.simpleicons.org/[ICON SLUG]/[COLOR]" />
<img height="32" width="32" src="https://cdn.simpleicons.org/[ICON SLUG]/[COLOR]/[DARK_MODE_COLOR]" />
```

Where `[COLOR]` is optional, and can be replaced by the [hex colors](https://developer.mozilla.org/en-US/docs/Web/CSS/hex-color) or [CSS keywords](https://www.w3.org/wiki/CSS/Properties/color/keywords) of the icon you want to you use. The color is defaulted to the HEX color of the icon shown in [simpleicons.org website](https://simpleicons.org). `[DARK_MODE_COLOR]` is used for dark mode. The [CSS prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) will be used when a value is specified. For example:

```html
<img height="32" width="32" src="https://cdn.simpleicons.org/simpleicons" />
<img height="32" width="32" src="https://cdn.simpleicons.org/simpleicons/gray" />
<img height="32" width="32" src="https://cdn.simpleicons.org/simpleicons/hotpink" />
<img height="32" width="32" src="https://cdn.simpleicons.org/simpleicons/0cf" />
<img height="32" width="32" src="https://cdn.simpleicons.org/simpleicons/0cf9" />
<img height="32" width="32" src="https://cdn.simpleicons.org/simpleicons/00ccff" />
<img height="32" width="32" src="https://cdn.simpleicons.org/simpleicons/00ccff99" />
<img height="32" width="32" src="https://cdn.simpleicons.org/simpleicons/orange/pink" />
<img height="32" width="32" src="https://cdn.simpleicons.org/simpleicons/_/eee" />
<img height="32" width="32" src="https://cdn.simpleicons.org/simpleicons/eee/_" />
```

### Node Usage <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/nodedotjs.svg" alt="Node" align=left width=24>

The icons are also available through our npm package. To install, simply run:

```shell
npm install simple-icons
```

All icons are imported from a single file, where `[ICON SLUG]` is replaced by a capitalized [slug]. We highly recommend using a bundler that can tree shake such as [webpack](https://webpack.js.org/) to remove the unused icon code:
```javascript
// Import a specific icon by its slug as:
// import { si[ICON SLUG] } from 'simple-icons'

// For example:
// use import/esm to allow tree shaking
import { siSimpleicons } from 'simple-icons';
// or with require/cjs
const { siSimpleicons } = require('simple-icons');
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

If you need to iterate over all icons, use:

```javascript
import * as icons from 'simple-icons';
```

#### TypeScript Usage <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/typescript.svg" alt="Typescript" align=left width=19 height=19>

Type definitions are bundled with the package.

```typescript
import type { SimpleIcon } from 'simple-icons';
```

### PHP Usage <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/php.svg" alt="Php" align=left width=24 height=24>

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

| Extension | Author | License | Simple Icons Version |
| :-- | :-- | :-: | :-: |
| [Angular module](https://github.com/avmaisak/ngx-simple-icons) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/angular.svg" alt="Angular" align=left width=24 height=24> | [@avmaisak](https://github.com/avmaisak) | ![](https://img.shields.io/github/license/avmaisak/ngx-simple-icons) | [![v6.18.0](https://img.shields.io/static/v1?label=version&message=v6.18.0&logo=simpleicons&color=red)](https://github.com/simple-icons/simple-icons/tree/6.18.0) |
| [Blazor Nuget package](https://github.com/TimeWarpEngineering/timewarp-simple-icons) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/blazor.svg" alt="Blazor" align=left width=24 height=24> | [@TimeWarpEngineering](https://github.com/TimeWarpEngineering)  | ![](https://img.shields.io/github/license/TimeWarpEngineering/timewarp-simple-icons) | ![](https://img.shields.io/badge/dynamic/xml?url=https%3A%2F%2Fraw.githubusercontent.com%2FTimeWarpEngineering%2Ftimewarp-simple-icons%2Fmain%2Fsource%2Ftimewarp-simple-icons%2Ftimewarp-simple-icons.csproj&query=%2FProject%2FPropertyGroup%2FVersion&logo=simpleicons&label=version) |
| [Blender add-on](https://github.com/mondeja/simple-icons-blender) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/blender.svg" alt="Blender" align=left width=24 height=24> | [@mondeja](https://github.com/mondeja) | ![](https://img.shields.io/github/license/mondeja/simple-icons-blender) | ![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fmondeja%2Fsimple-icons-blender%2Fdevelop%2Fpackage.json&query=%24..%5B'simple-icons'%5D&logo=simpleicons&label=version) |
| [Boxy SVG library](https://boxy-svg.com/ideas/298/simple-icons-library-provider) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/boxysvg.svg" alt="Boxy SVG" align=left width=24 height=24> | [@Jarek](https://boxy-svg.com/profiles/0000000000/jarek) | | |
| [Drawio library](https://github.com/mondeja/simple-icons-drawio) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/diagramsdotnet.svg" alt="Drawio" align=left width=24 height=24> | [@mondeja](https://github.com/mondeja) | ![](https://img.shields.io/github/license/mondeja/simple-icons-drawio) | ![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fmondeja%2Fsimple-icons-drawio%2Fdevelop%2Fpackage.json&query=%24..%5B'simple-icons'%5D&logo=simpleicons&label=version) |
| [Drupal module](https://www.drupal.org/project/simple_icons) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/drupal.svg" alt="Drupal" align=left width=24 height=24> | [Phil Wolstenholme](https://www.drupal.org/u/phil-wolstenholme) | ![](https://img.shields.io/badge/license-GPL_v2-blue.svg) | ![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgit.drupalcode.org%2Fproject%2Fsimple_icons%2F-%2Fraw%2F8.x-1.x%2Fpackage-lock.json%3Fref_type%3Dheads&query=%24..%5B'simple-icons'%5D.version&logo=simpleicons&label=version) |
| [Figma plugin](https://www.figma.com/community/plugin/1149614463603005908/Simple-Icons) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/figma.svg" alt="Figma" align=left width=24 height=24> | [@LitoMore](https://github.com/LitoMore) | ![](https://img.shields.io/github/license/litomore/simple-icons-figma) | ![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsimple-icons%2Fsimple-icons%2Fmaster%2Fpackage.json&query=%24.version&logo=simpleicons&label=version)  |
| [Flutter package](https://pub.dev/packages/simple_icons) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/flutter.svg" alt="Flutter" align=left width=24 height=24> | [@jlnrrg](https://github.com/jlnrrg) | ![](https://img.shields.io/github/license/jlnrrg/simple_icons) | ![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fjlnrrg%2Fsimple_icons%2Fmaster%2Fvendor%2Fpackage-lock.json&query=%24..%5B'node_modules%2Fsimple-icons-font'%5D.version&logo=simpleicons&label=version) |
| [Framer component](https://github.com/LitoMore/simple-icons-framer) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/framer.svg" alt="Framer" align=left width=24 height=24> | [@LitoMore](https://github.com/LitoMore) | ![](https://img.shields.io/github/license/LitoMore/simple-icons-framer) | ![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsimple-icons%2Fsimple-icons%2Fmaster%2Fpackage.json&query=%24.version&logo=simpleicons&label=version) |
| [Hexo plugin](https://github.com/nidbCN/hexo-simpleIcons) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/hexo.svg" alt="Hexo" align=left width=24 height=24> | [@nidbCN](https://github.com/nidbCN/) | ![](https://img.shields.io/github/license/nidbCN/hexo-simpleIcons) | ![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FnidbCN%2Fhexo-simpleIcons%2Fmaster%2Fpackage.json&query=%24..%5B'simple-icons'%5D&logo=simpleicons&label=version) |
| [Home Assistant plugin](https://github.com/vigonotion/hass-simpleicons) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/homeassistant.svg" alt="Home Assistant" align=left width=24 height=24> | [@vigonotion](https://github.com/vigonotion/) | ![](https://img.shields.io/github/license/vigonotion/hass-simpleicons) | [![v7.14.0](https://img.shields.io/static/v1?label=version&message=v7.14.0&logo=simpleicons&color=red)](https://github.com/simple-icons/simple-icons/tree/7.14.0) |
| [Hugo module](https://github.com/foo-dogsquared/hugo-mod-simple-icons) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/hugo.svg" alt="Hugo" align=left width=24 height=24> | [@foo-dogsquared](https://github.com/foo-dogsquared) | ![](https://img.shields.io/github/license/foo-dogsquared/hugo-mod-simple-icons) | ![](https://img.shields.io/github/v/tag/foo-dogsquared/hugo-mod-simple-icons?logo=simpleicons&label=version) |
| [Java library](https://github.com/silentsoft/simpleicons4j) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/openjdk.svg" alt="OpenJDK" align=left width=24 height=24> | [@silentsoft](https://github.com/silentsoft) | ![](https://img.shields.io/github/license/silentsoft/simpleicons4j) | ![](https://img.shields.io/badge/dynamic/xml?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsilentsoft%2Fsimpleicons4j%2Fmain%2Fpom.xml&query=%2A%5Blocal-name%28.%29%3D%27project%27%5D%2F%2F%2A%5Blocal-name%28.%29%3D%27dependencies%27%5D%2F%2F%2A%5Blocal-name%28.%29%3D%27dependency%27%20and%20%2A%5Blocal-name%28.%29%3D%27artifactId%27%20and%20text%28%29%3D%27simple-icons%27%5D%5D%2F%2F%2A%5Blocal-name%28.%29%3D%27version%27%5D%2F%2Ftext%28%29&logo=simpleicons&label=version) |
| [Jetpack Compose library](https://github.com/DevSrSouza/compose-icons) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/jetpackcompose.svg" alt="Jetpack Compose" align=left width=24 height=24> | [@DevSrSouza](https://github.com/devsrsouza/) | ![](https://img.shields.io/github/license/DevSrSouza/compose-icons) | [![v4.14.0](https://img.shields.io/static/v1?label=version&message=v4.14.0&logo=simpleicons&color=red)](https://github.com/simple-icons/simple-icons/tree/4.14.0) |
| [Kirby plugin](https://github.com/runxel/kirby3-simpleicons) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/kirby.svg" alt="Kirby" align=left width=24 height=24> | [@runxel](https://github.com/runxel) | ![](https://img.shields.io/github/license/runxel/kirby3-simpleicons) | ![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Frunxel%2Fkirby3-simpleicons%2Fmaster%2Fcomposer.json&query=%24..%5B'simple-icons%2Fsimple-icons'%5D&logo=simpleicons&label=version) |
| [LaTeX package](https://github.com/ineshbose/simple-icons-latex) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/latex.svg" alt="LaTeX" align=left width=24 height=24> | [@ineshbose](https://github.com/ineshbose) | ![](https://img.shields.io/github/license/ineshbose/simple-icons-latex) | ![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fineshbose%2Fsimple-icons-latex%2Fdevelop%2Fpackage.json&query=%24..%5B'simple-icons-font'%5D&logo=simpleicons&label=version) |
| [Laravel package](https://github.com/ublabs/blade-simple-icons) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/laravel.svg" alt="Laravel" align=left width=24 height=24> | [@adrian-ub](https://github.com/adrian-ub) | ![](https://img.shields.io/github/license/ublabs/blade-simple-icons) | ![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsimple-icons%2Fsimple-icons%2Fmaster%2Fpackage.json&query=%24.version&logo=simpleicons&label=version) |
| [Leptos crate](https://github.com/Carlosted/leptos-icons) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/leptos.svg" alt="Leptos" align=left width=24 height=24> | [@Carlosted](https://github.com/Carlosted)  | ![](https://img.shields.io/github/license/Carlosted/leptos-icons) | [![v9.14.0](https://img.shields.io/static/v1?label=version&message=v9.14.0&logo=simpleicons&color=yellow)](https://github.com/simple-icons/simple-icons/tree/9.14.0) |
| [Miro app](https://miro.com/marketplace/brand-icons/) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/miro.svg" alt="Miro" align=left width=24 height=24> | [@LitoMore](https://github.com/LitoMore) | ![](https://img.shields.io/github/license/LitoMore/simple-icons-miro) | ![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsimple-icons%2Fsimple-icons%2Fmaster%2Fpackage.json&query=%24.version&logo=simpleicons&label=version) |
| [Python package](https://github.com/sachinraja/simple-icons-py) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/python.svg" alt="Python" align=left width=24 height=24> | [@sachinraja](https://github.com/sachinraja) | ![](https://img.shields.io/github/license/sachinraja/simple-icons-py) | [![v7.21.0](https://img.shields.io/static/v1?label=version&message=v7.21.0&logo=simpleicons&color=red)](https://github.com/simple-icons/simple-icons/tree/7.21.0) |
| [Raycast extension](https://www.raycast.com/litomore/simple-icons) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/raycast.svg" alt="Raycast" align=left width=24 height=24> | [@LitoMore](https://github.com/LitoMore) | ![](https://img.shields.io/github/license/raycast/extensions) | ![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsimple-icons%2Fsimple-icons%2Fmaster%2Fpackage.json&query=%24.version&logo=simpleicons&label=version) |
| [React package](https://github.com/icons-pack/react-simple-icons) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/react.svg" alt="React" align=left width=24 height=24> | [@wootsbot](https://github.com/wootsbot) | ![](https://img.shields.io/github/license/icons-pack/react-simple-icons) | ![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Ficons-pack%2Freact-simple-icons%2Fmain%2Fpackage.json&query=%24..%5B'simple-icons'%5D&logo=simpleicons&label=version) |
| [Ruby gem](https://rubygems.org/gems/simple-icons-rails) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/rubygems.svg" alt="Ruby" align=left width=24 height=24> | [@thepew](https://github.com/the-pew-inc) | ![](https://img.shields.io/github/license/the-pew-inc/simple-icons-rails) | ![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsimple-icons%2Fsimple-icons%2Fmaster%2Fpackage.json&query=%24.version&logo=simpleicons&label=version) |
| [Solid package](https://github.com/x64Bits/solid-icons) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/solid.svg" alt="Solid" align=left width=24 height=24> | [@x64Bits](https://github.com/x64Bits) | ![](https://img.shields.io/github/license/x64Bits/solid-icons) | [![v9.0.0](https://img.shields.io/static/v1?label=version&message=v9.0.0&logo=simpleicons&color=yellow)](https://github.com/simple-icons/simple-icons/tree/9.0.0) |
| [Stream Deck icon pack](https://github.com/mackenly/simple-icons-stream-deck) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/elgato.svg" alt="Stream Deck" align=left width=24 height=24> | [@mackenly](https://github.com/mackenly) | ![](https://img.shields.io/github/license/mackenly/simple-icons-stream-deck) | ![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fmackenly%2Fsimple-icons-stream-deck%2Fmain%2Ftemplate%2Fmanifest.json&query=Version&logo=simpleicons&label=version) |
| [Svelte package](https://github.com/icons-pack/svelte-simple-icons) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/svelte.svg" alt="Svelte" align=left width=24 height=24> | [@wootsbot](https://github.com/wootsbot) | ![](https://img.shields.io/github/license/icons-pack/svelte-simple-icons) | ![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Ficons-pack%2Fsvelte-simple-icons%2Fmain%2Fpackage.json&query=%24..%5B'simple-icons'%5D&logo=simpleicons&label=version) |
| [Vue 3 package](https://github.com/wyatt-herkamp/vue3-simple-icons) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/vuedotjs.svg" alt="Vue" align=left width=24 height=24> | [@wyatt-herkamp](https://github.com/wyatt-herkamp) | ![](https://img.shields.io/github/license/wyatt-herkamp/vue3-simple-icons) | ![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fwyatt-herkamp%2Fvue3-simple-icons%2Fmain%2Fsimple-icons.json&query=simpleIconsVersion&logo=simpleicons&label=version) |
| [Vue package](https://github.com/mainvest/vue-simple-icons) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/vuedotjs.svg" alt="Vue" align=left width=24 height=24> | [@noahlitvin](https://github.com/noahlitvin) | ![](https://img.shields.io/github/license/mainvest/vue-simple-icons) | ![](https://img.shields.io/badge/dynamic/yaml?url=https%3A%2F%2Fraw.githubusercontent.com%2Fmainvest%2Fvue-simple-icons%2Fmaster%2Fpackage.json&query=%24.version&logo=simpleicons&label=version) |
| [Webflow app](https://webflow.com/apps/detail/simple-icons) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/webflow.svg" alt="Webflow" align=left width=24 height=24> | [@diegoliv](https://github.com/diegoliv) | ![](https://img.shields.io/github/license/diegoliv/wf-simpleicons-search) | ![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdiegoliv%2Fwf-simpleicons-search%2Fmain%2Fpackage.json&query=%24..%5B'simple-icons'%5D&logo=simpleicons&label=version) |
| [WordPress plugin](https://wordpress.org/plugins/simple-icons/) <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/icons/wordpress.svg" alt="WordPress" align=left width=24 height=24> | [@tjtaylo](https://github.com/tjtaylo) | ![](https://img.shields.io/badge/license-GPL_v2-blue.svg) | [![v4.25.0](https://img.shields.io/static/v1?label=version&message=v4.25.0&logo=simpleicons&color=red)](https://github.com/simple-icons/simple-icons/tree/4.25.0) |

> **Important**\
> From our next scheduled major release (v12, releasing on May 26, 2024), we will begin removing third-party extensions from the above list that are not up to date with at least our previous major release.\
> For example, when v12 is released, we will remove any extensions that don't support `v11.0.0` or higher.\
> Please create a PR to update the version number of your extension in this README following each update of your extension.

## Contribute

[![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.github.com%2Fsearch%2Fissues%3Fq%3Drepo%3Asimple-icons%2Fsimple-icons%2520label%3A%2522good%2520first%2520issue%2522%2520is%3Aopen%2520-linked%3Apr&query=%24.total_count&suffix=%20open&logo=github&label=good%20first%20issues&color=228f6c&labelColor=228f6c&logoColor=white&style=flat-square)](https://github.com/simple-icons/simple-icons/issues?q=is%3Aopen+label%3A%22good+first+issue%22+-linked%3Apr)
[![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.github.com%2Fsearch%2Fissues%3Fq%3Drepo%3Asimple-icons%2Fsimple-icons%2520label%3A%2522update%2520icon%2Fdata%2522%2C%2522new%2520icon%2522%2520is%3Aopen%2520-linked%3Apr&query=%24.total_count&suffix=%20open&logo=svg&logoColor=333&label=icon%20issues&labelColor=FFB13B&color=FFB13B&style=flat-square)](https://github.com/simple-icons/simple-icons/issues?q=is%3Aissue+is%3Aopen+label%3A%22new+icon%22%2C%22update+icon%2Fdata%22)
[![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.github.com%2Fsearch%2Fissues%3Fq%3Drepo%3Asimple-icons%2Fsimple-icons%2520is%3Aissue%2520is%3Aopen%2520label%3Ameta%2Cpackage%2520-linked%3Apr&query=%24.total_count&suffix=%20open&logo=typescript&logoColor=white&label=code%20issues&labelColor=3178C6&color=3178C6&style=flat-square)](https://github.com/simple-icons/simple-icons/issues?q=is%3Aissue+is%3Aopen+label%3Adocs%2Cmeta%2Cpackage+-linked%3Apr)
[![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.github.com%2Fsearch%2Fissues%3Fq%3Drepo%3Asimple-icons%2Fsimple-icons%2520label%3Adocs%2520is%3Aopen%2520-linked%3Apr&query=%24.total_count&suffix=%20open&logo=markdown&label=docs%20issues&labelColor=343a40&color=343a40&logoColor=FFF&style=flat-square)](https://github.com/simple-icons/simple-icons/issues?q=is%3Aopen+is%3Aissue+label%3Adocs+-linked%3Apr)

Information describing how to contribute can be found in the file [CONTRIBUTING.md](https://github.com/simple-icons/simple-icons/blob/develop/CONTRIBUTING.md)

[slug]: https://github.com/simple-icons/simple-icons/blob/master/slugs.md

## Contributors

<a href="https://github.com/simple-icons/simple-icons/graphs/contributors">
  <img src="https://opencollective.com/simple-icons/contributors.svg?width=890&button=false" />
</a>
