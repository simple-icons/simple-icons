// core packages
const fs = require('fs'),
      path = require('path'),
      util = require('util')

// npm packages
const IconFontBuildr = require('icon-font-buildr')

// local packages
const { titleToFilename } = require('./utils')

const basePath = path.join(__dirname, '..')

util.promisify(fs.readFile)(path.join(basePath, '_data', 'simple-icons.json'))
	.then(rawJson => {
		const iconData = JSON.parse(rawJson)

		const icons = Object.values(iconData.icons)
			.map(icon => ({
				icon: titleToFilename(icon.title), // source file name, e.g. "about-dot-me"
				ligatures: [ // strings that get replaced with the icon in this font
					icon.title,                                                                 // "About.me"
					icon.title.toLowerCase().replace(/[ !’]/g, ''),      // "about.me"
					titleToFilename(icon.title)                                                 // "about-dot-me"
				].filter((v, i, a) => a.indexOf(v) === i) // and filtering duplicates
			}))

		const builder = new IconFontBuildr({
			sources: [
				path.join(basePath, 'icons', '[icon].svg')
			],
			icons: icons,
			output: {
				ligatures: true,
				icons: null,
				fonts: path.join(basePath, 'font'),
				fontName: 'SimpleIcons',
				formats: [
					'woff',
					'woff2'
				]
			}
		})

		return builder.build()
	})
	.then(() => {
		console.log('Font created successfully!')
	})
