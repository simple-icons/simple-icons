# Contributing to Simple Icons

> :information_source: We ask that all users read our [legal disclaimer](./DISCLAIMER.md) before contributing to Simple Icons.

Simple Icons welcomes contributions and corrections. Before contributing, please make sure you have read the guidelines below. If you decide to contribute anything, please follow the steps below. If you're new to _git_ and/or _GitHub_, we suggest you go through [the GitHub Guides](https://guides.github.com/introduction/flow/).

1. Fork this repository
1. (Optional) Clone the fork

   - Using SSH

     ```shell
     git clone --filter=tree:0 git@github.com:simple-icons/simple-icons.git
     ```

   - Using HTTPS

     ```shell
     git clone --filter=tree:0 https://github.com/simple-icons/simple-icons.git
     ```

   - Using GitHub CLI

     ```shell
     gh repo clone simple-icons/simple-icons -- --filter=tree:0
     ```

1. Create a new branch from the latest `develop`
1. Start hacking on the new branch
1. Commit and push to the new branch
1. Make a pull request

## Table of contents

* [Requesting an Icon](#requesting-an-icon)
* [Adding or Updating an Icon](#adding-or-updating-an-icon)
* [Testing Package Locally](#testing-package-locally)
* [Using Docker](#using-docker)

## Requesting an Icon

We welcome icon requests. Before you submit a new issue please make sure the icon:

* Has not already been requested. If you find an existing issue or pull request for the brand you're looking for then please add a reaction or comment to show your support.
* Is of a _popular_ brand:
    - For websites, the [Similarweb rank](https://www.similarweb.com) should be less than 500k.
        - Note that for brands that have already been added the threshold for continued inclusion rises to 750k.
    - For GitHub projects, the amount of "stars" should be above 5k.
    - For anything else, popularity will be judged on a case-by-case basis.
* Doesn't fall into one of the following categories:
    - Illegal services (e.g. piracy, malware, threatening material, spam, etc.)
    - Governmental agencies, programs, departments
       - Allowed: International organizations and NGOs with supranational interests
       - Allowed: Space agencies
    - Symbols, including flags and banners
    - Sport clubs
       - Allowed: Sports organizations
    - Yearly releases
    - Universities or other educational institutions
    - Any brands representing individuals rather than an organization, company, or product. This includes musicians, bands, and social media personalities.

If you are in doubt, feel free to submit it and we'll have a look.

When submitting a request for a new or updated icon include helpful information such as:

* **Issue Title:** The brand name. For example:
  * New Icons: `Request: GitHub Icon`
  * Icon Updates: `Update: GitHub Color` or `Update: GitHub Icon`

* **Issue Body:** Links to official sources for the brand's icon and colors (e.g. media kits, brand guidelines, SVG files, etc.)

If you have an affiliation to the brand you are requesting that allows you to speak on their behalf then please disclose that in your issue as it can help speed up our research process.

## Adding or Updating an Icon

**Note**: If you decide to add an icon without requesting it first, the requirements above still apply.

### 1. Identify Official Logos and Colors

Most of the icons and brand colors on SimpleIcons have been derived from official sources. Using official sources helps ensure that the icons and colors in SimpleIcons accurately match the brand they represent. Thankfully, this is usually a simple process as organizations often provide brand guides and high-quality versions of their logo for download.

Official high quality brand logos and brand colors can usually be found in the following locations:

1. About pages, Press pages, Media Kits, and Brand Guidelines.
1. Website headers (you can use [svg-grabber](https://chrome.google.com/webstore/detail/svg-grabber-get-all-the-s/ndakggdliegnegeclmfgodmgemdokdmg) for Chrome)
1. Favicons
1. Wikimedia (which should provide a source)
1. GitHub repositories

It may be the case that no official source exists, but an unofficial icon has gained widespread acceptance and popularity. In such cases the unofficial icon can be included, but the details will be judged on a case-by-case basis. The JavaScript icon is an example of this.
Notice that an unofficial source will never supersede an official one, even if it is more popular. An unofficial icon will only be accepted if no official option exists.

#### Icon Guidelines

Working with an SVG version of the logo is best. In the absence of an SVG version, other vector filetypes may work as well (e.g. EPS, AI, PDF). In the absence of vector logos, a vector can be created from a high-quality rasterized image, however, this is much more labor-intensive.

If the icon includes a (registered) trademark icon we follow the guidelines below to decide whether to include the symbol or not:

* If brand guidelines explicitly require including the symbol, it must be included.
* If the brand itself includes the symbol with all uses of the logo, even at small sizes, it must be included.
* If the symbol is incorporated into the design of the logo (e.g. [Chupa Chups](https://github.com/simple-icons/simple-icons/blob/develop/icons/chupachups.svg)), it must be included.
* If there is ambiguity about the conditions under which the symbol is required, it must be included if it is a _registered trademark symbol_ (®) but not if is a _trademark symbol_ (™).
* If brand guidelines say it _may_ be removed, usually when the icon is displayed at small sizes, it must not be included.
* If there is no explicit requirement that a symbol must be included, it must not be included.

#### Color Guidelines

For color, the brand's primary color should be used. The official color of a brand is usually found in their brand guidelines, media kits, or some of the other locations mentioned above. If no official color can be identified, use the brand's primary web color or the most prominent color in the logo itself (please indicate why you choose the particular color in your pull request). Simple Icons stores brand colors in the standard 6 character hexadecimal format.

### 2. Extract the Icon from the Logo

There are many different tools for editing SVG files, some options include:

| Name | Description | Platform | Price |
| :---- | :---- | :----: | :----: |
| [Inkscape](https://inkscape.org/) | Vector Graphics Editor | Windows, Mac, Linux | Free |
| [Affinity Designer](https://affinity.serif.com/designer/) | Vector Graphics Editor | Windows, Mac | $ |
| [Adobe Illustrator](https://www.adobe.com/products/illustrator.html) | Vector Graphics Editor | Windows, Mac | $ - $$$ |
| [IcoMoon](https://icomoon.io/) | Icon Editing/Management Tool | Online | Free |

Using your preferred tool you should:

1. Isolate the icon from any text or extraneous items.
1. Merge any overlapping paths.
1. Compound all paths into one.
1. Change the icon's viewbox/canvas/page size to 24x24.
1. Scale the icon to fit the viewbox, while preserving the icon's original proportions. This means the icon should be touching at least two sides of the viewbox.
1. Center the icon horizontally and vertically.
1. Remove all colors. The icon should be monochromatic.
1. Export the icon as an SVG.

Some icons can't be easily converted to a monochromatic version due to colour changes, shadows, or other effects. For such cases, the addition of gaps is the recommended approach, with a preferred width of 0.5px. In some situations, a different gap may be required, but that will be determined on a per-case basis.

If you have any problems or questions while creating the SVG, check out [the GitHub Discussions](https://github.com/simple-icons/simple-icons/discussions/categories/help-with-svgs). You may find an answer to your question there or you can ask your question if you did not find an answer.

### 3. Optimize the Icon

All icons in Simple Icons have been optimized with the [SVGO tool](https://github.com/svg/svgo). This can be done in one of three ways:

* The [SVGO Command Line Tool](https://github.com/svg/svgo)
  * Install dependencies
    * With npm: `npm install` from the root of this repository
  * Run the following command `npm run svgo -- icons/file-to-optimize.svg`
  * Check if there is a loss of quality in the output, if so increase the precision.
* The [SVGOMG Online Tool](https://jakearchibald.github.io/svgomg/)
  * Click "Open SVG" and select an SVG file.
  * Set the precision to about 3, depending on if there is a loss of quality.
  * Leave the remaining settings untouched (or reset them with the button at the bottom of the settings).
  * Click the download button.
* The [SVGO Command Line Tool](https://github.com/svg/svgo) in Docker
  * If none of the options above work for you, it is possible to build a Docker image for compressing the images.
  * Build: `docker build . -t simple-icons`
  * Run: `docker run --rm -v ${PWD}/icons/file-to-optimize.svg:/image.svg simple-icons`

After optimizing the icon, double-check it against your original version to ensure no visual imperfections have crept in. Also, make sure that the dimensions of the path have not been changed so that the icon no longer fits exactly within the canvas. We currently check the dimensions up to a precision of 3 decimal points.

### 4. Annotate the Icon

Each icon in Simple Icons has been annotated with a number of attributes and elements to increase accessibility. These include:

* An svg element with:
  * An img role attribute.
    * `role="img"`
  * A 24x24 viewbox.
    * `viewBox="0 0 24 24"`
  * The svg namespace.
    * `xmlns="http://www.w3.org/2000/svg"`
* A title element containing the brand name.
  * `<title>Adobe Photoshop</title>`

Here is _part of_ the svg for the Adobe Photoshop icon as an example:

```svg
<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Adobe Photoshop</title>...</svg>
```

### 5. Check the Icon

The final icon should:

* Be properly annotated [as discussed above](#4-annotate-the-icon).
* Be monochromatic.
  * Remove all fill colors so that icon defaults to black.
* Be scaled to fit the viewbox, while preserving the icon's original proportions.
  * This means the icon should be touching at least two sides of the viewbox.
* Be vertically and horizontally centered.
* Be minified to a single line with no formatting.
* Contain only a single `path` element.
* Not contain extraneous elements.
  * This includes: `circle`, `ellipse`, `rect`, `polygon`, `line`, `g`, etc.
* Not contain extraneous attributes.
  * This includes: `width`, `height`, `fill`, `stroke`, `clip`, `font`, etc.

Here is the svg for the Adobe Photoshop icon as an example:

```svg
<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Adobe Photoshop</title><path d="M0 .3v23.4h24V.3H0zm1 1h22v21.4H1V1.3zm4.8 4.48c0-.067.14-.116.224-.116.644-.033 1.588-.05 2.578-.05 2.772 0 3.85 1.52 3.85 3.466 0 2.54-1.842 3.63-4.102 3.63-.38 0-.51-.017-.775-.017v3.842c0 .083-.033.116-.115.116H5.916c-.083 0-.115-.03-.115-.113V5.78zm1.775 5.312c.23.016.412.016.81.016 1.17 0 2.27-.412 2.27-1.996 0-1.27-.786-1.914-2.122-1.914-.396 0-.775.016-.957.033v3.864zm8.607-1.188c-.792 0-1.056.396-1.056.726 0 .363.18.61 1.237 1.155 1.568.76 2.062 1.485 2.062 2.557 0 1.6-1.22 2.46-2.87 2.46-.876 0-1.62-.183-2.05-.43-.065-.033-.08-.082-.08-.165V14.74c0-.1.048-.133.114-.084.624.413 1.352.594 2.012.594.792 0 1.122-.33 1.122-.776 0-.363-.23-.677-1.237-1.205-1.42-.68-2.014-1.37-2.014-2.527 0-1.287 1.006-2.36 2.755-2.36.86 0 1.464.132 1.794.28.082.05.1.132.1.198v1.37c0 .083-.05.133-.15.1-.444-.264-1.1-.43-1.743-.43z"/></svg>
```

### 6. Name the Icon

The filename of the SVG should correspond to the `<title>` used in the markup file mentioned above, and it should follow the rules below. If you're in doubt, you can always run `npm run get-filename -- "Brand name"` to get the correct filename.

1. Use **lowercase letters** without **whitespace**, for example:

    ```yml
    title: Adobe Photoshop
    filename: adobephotoshop.svg
    ```

1. Only use **latin** letters, for example:

    ```yml
    title: Citroën
    filename: citroen.svg
    ```

1. Replace the following symbols with their alias:

    | Symbol | Alias |
    | :----: | ----- |
    |   +    | plus  |
    |   .    | dot   |
    |   &    | and   |

    for example:

    ```yml
    title: .Net
    filename: dotnet.svg
    ```

1. On rare occasions the resulting name will clash with the name of an existing SVG file in our collection. To resolve such conflicts append `_[MODIFIER]` to the name, where `[MODIFIER]` is a short descriptor of the brand or the service they provide and follows the same rules of construction as above.

    for example:

    ```yml
    title: Hive
    filename: hive_blockchain.svg
    ```

### 7. Update the JSON Data for SimpleIcons.org

Icon metadata should be added to the `_data/simple-icons.json` file. Each icon in the array has three required values:

* The `title` of the new SVG.
* A `hex` color value that matches the brand's primary color. All uppercase and without the `#` symbol.
* The `source` URL of the logo being used. There are [more details below](#source-guidelines).

There are also [optional values](#optional-data) that may be provided for each icon, which are listed below.

Here is the object of a fictional brand as an example:

```json
{
    "title": "A Fictional Brand",
    "hex": "123456",
    "source": "https://www.a-fictional-brand.org/logo"
}
```

Make sure the icon is added in alphabetical order. If you're in doubt, you can always run `npm run our-lint` - this will tell you if any of the JSON data is in the wrong order.

#### Optional Data

Additionally, each icon in the `_data/simple-icons.json` file may be given any of the following optional values:

* The `slug` must be used to specify the icon's file name in cases where a modifier has been added to it in order to resolve a clash with an existing icon's name.
* The `guidelines` may be used to specify the URL of the brand's guidelines/press kit/etc. This is useful if the SVG file was sourced from a different place, still if the SVG file was sourced from the guidelines, the URL should be duplicated here.
* The `license` may be used to specify the license under which the icon is available. This is an object with a `type` and `url`. The `type` should be an [SPDX License ID](https://spdx.org/licenses/) or `"custom"`, the `url` is optional unless the `type` is `"custom"`.

Here is the object of the fictional brand from before, but with all optional values, as an example:

```json
{
    "title": "A Fictional Brand",
    "slug": "afictionalbrand_modifier",
    "hex": "123456",
    "source": "https://www.a-fictional-brand.org/logo",
    "guidelines": "https://www.a-fictional-brand.org/brand-guidelines",
    "license": {
        "type": "CC0-1.0",
        "url": "https://www.a-fictional-brand.org/logo/license"
    }
}
```

#### Source Guidelines

We use the source URL as a reference for the current SVG in our repository and as a jumping-off point to find updates if the logo changes. If you used one of the sources listed below, make sure to follow these guidelines. If you're unsure about the source URL you can open a Pull Request and ask for help from others.

If the SVG is sourced from:

- **Branding page**: For an SVG from a branding page the source URL should link to the branding page and not the image, PDF, or archive (such as `.zip`) file.
- **Company website**: If the SVG is found on the company website (but there is no branding page) the source URL should link to a common page, such as the home page or about page, that includes the source image and not the image file itself.
- **GitHub**: For an SVG from a GitHub (GitLab, BitBucket, etc.) repository the source URL should link to the file that was used as source material. If the color comes from another file in the repository the URL should link to the repository itself.

  In any case, the commit hash should be part of the URL. On GitHub, you can get the correct URL by pressing <kbd>y</kbd> on the GitHub page you want to link to. You can get help at the [getting permanent links to files page](https://help.github.com/en/github/managing-files-in-a-repository/getting-permanent-links-to-files).

- **Wikipedia**: For an SVG from Wikipedia/Wikimedia the source URL should link to the logo file's page on the relevant site, and not the brand's Wikipedia pages. For example, [this is the link for AmericanExpress](https://commons.wikimedia.org/wiki/File:American_Express_logo.svg).

In general, make sure the URL does not contain any tracking identifiers.

#### Aliases

Lastly, we aim to provide aliases of three types for various reasons. Each type of alias and its purpose can be found below. If you're unsure, you can mention an alias you're considering in your Pull Request so it can be discussed.

##### Also Known As

We collect "also known as" names to make it easier to find brands that are known by different names or by their abbreviation/full name. This does not include localized names, which are recorded separately. To add an "also known as" name you add the following to the icon data:

```json
{
    "title": "the original title",
    "aliases": {
        "aka": [
            "tot",
            "thetitle"
        ]
    }
}
```

Where the string is **different** from the original title as well as all other strings in the list.

##### Duplicates

We collect the names of duplicates, brands that use the same icon but have a different name, to prevent duplicating an SVG while at the same time making the SVG available under the name of the duplicate. To add a duplicate you add the following to the icon data:

```json5
{
    "title": "the original title",
    "hex": "123456",
    "aliases": {
        "dup": [
            {
                "title": "the duplicate's title",
                "hex": "654321", // Only if different from original's color
                "guidelines": "..." // Only if different from original's guidelines
            }
        ]
    }
}
```

Where the nested `title` is the name of the duplicate brand. The other fields, `hex` and `guidelines`, are only provided if they differ from the original.

##### Localization

We collect localized names to make it possible to find the brand by it's local name, as well as to provide SVGs with localized titles. To add a localized name you add the following to the icon data:

```json
{
    "title": "the original title",
    "aliases": {
        "loc": {
            "en-US": "A different title"
        }
    }
}
```

Where the `locale` is an [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag) and `title` is a **different** title from the original title.

### 8. Create a Pull Request

Once you've completed the previous steps, create a pull request to merge your edits into the *develop* branch. You can run `npm run lint` to check if there are any issues you still need to address.

If you have an affiliation to the brand you contributing that allows you to speak on their behalf then please disclose that in your pull request as it can help speed up our research and review processes.

## Testing Package Locally

* Make sure you have [Node.js](https://nodejs.org/en/download/) installed. At least version `^12.20.0 || ^14.13.1 || >=16.0.0` is required.
* Install the dependencies using `$ npm install`.
* Build and test the package using `$ npm test`.
* Run the project linting process using `$ npm run lint`.

## Using Docker

You can build a Docker image for this project which can be used as a development environment and allows you to run SVGO safely. First, build the Docker image for simple-icons (if you haven't yet):

```shell
docker build . -t simple-icons
```

Then, start a Docker container for simple-icons and attach to it:

```shell
docker run -it --rm --entrypoint "/bin/ash" simple-icons
```
