const fs = require('fs');

const data = require("./_data/simple-icons.json");
const { htmlFriendlyToTitle } = require("./scripts/utils.js");
const parsePath = require("svgpath/lib/path_parse");
const { svgPathBbox } = require("svg-path-bbox");

const titleRegexp = /(.+) icon$/;
const svgRegexp = /^<svg( [^\s]*=".*"){3}><title>.*<\/title><path d=".*"\/><\/svg>\r?\n?$/;

const iconSize = 24;
const iconFloatPrecision = 3;
const iconMaxFloatPrecision = 5;
const iconTolerance = 0.001;

// set env SI_UPDATE_IGNORE to recreate the ignore file
const updateIgnoreFile = process.env.SI_UPDATE_IGNORE === 'true'
const ignoreFile = "./.svglint-ignored.json";
const iconIgnored = !updateIgnoreFile ? require(ignoreFile) : {};

function sortObjectByKey(obj) {
  return Object
    .keys(obj)
    .sort()
    .reduce((r, k) => Object.assign(r, { [k]: obj[k] }), {});
}

function sortObjectByValue(obj) {
  return Object
    .keys(obj)
    .sort((a, b) => ('' + obj[a]).localeCompare(obj[b]))
    .reduce((r, k) => Object.assign(r, { [k]: obj[k] }), {});
}

if (updateIgnoreFile) {
  process.on('exit', () => {
    // ensure object output order is consistent due to async svglint processing
    const sorted = sortObjectByKey(iconIgnored)
    for (const linterName in sorted) {
      sorted[linterName] = sortObjectByValue(sorted[linterName])
    }

    fs.writeFileSync(
      ignoreFile,
      JSON.stringify(sorted, null, 2) + '\n',
      {flag: 'w'}
    );
  });
}

function isIgnored(linterName, path) {
  return iconIgnored[linterName] && iconIgnored[linterName].hasOwnProperty(path);
}

function ignoreIcon(linterName, path, $) {
  if (!iconIgnored[linterName]) {
    iconIgnored[linterName] = {};
  }

  const title = $.find("title").text().replace(/(.*) icon/, '$1');
  const iconName = htmlFriendlyToTitle(title);

  iconIgnored[linterName][path] = iconName;
}

module.exports = {
    rules: {
        elm: {
            "svg": 1,
            "svg > title": 1,
            "svg > path": 1,
            "*": false,
        },
        attr: [
            { // ensure that the SVG elm has the appropriate attrs
                "role": "img",
                "viewBox": `0 0 ${iconSize} ${iconSize}`,
                "xmlns": "http://www.w3.org/2000/svg",
                "rule::selector": "svg",
                "rule::whitelist": true,
            },
            { // ensure that the title elm has the appropriate attr
                "rule::selector": "svg > title",
                "rule::whitelist": true,
            },
            { // ensure that the path element only has the 'd' attr (no style, opacity, etc.)
                "d": /^[,a-zA-Z0-9\. -]+$/,
                "rule::selector": "svg > path",
                "rule::whitelist": true,
            }
        ],
        custom: [
          function(reporter, $, ast) {
            reporter.name = "icon-title";

            const iconTitleText = $.find("title").text();
            if (!titleRegexp.test(iconTitleText)) {
              reporter.error("<title> should follow the format \"[ICON_NAME] icon\"");
            } else {
              const titleMatch = iconTitleText.match(titleRegexp);
              // titleMatch = [ "[ICON_NAME] icon", "[ICON_NAME]" ]
              const rawIconName = titleMatch[1];
              const iconName = htmlFriendlyToTitle(rawIconName);
              const icon = data.icons.find(icon => icon.title === iconName);
              if (icon === undefined) {
                reporter.error(`No icon with title "${iconName}" found in simple-icons.json`);
              }
            }
          },
          function(reporter, $, ast) {
            reporter.name = "icon-size";

            const iconPath = $.find("path").attr("d");
            if (!updateIgnoreFile && isIgnored(reporter.name, iconPath)) {
              return;
            }

            const [minX, minY, maxX, maxY] = svgPathBbox(iconPath);
            const width = +(maxX - minX).toFixed(iconFloatPrecision);
            const height = +(maxY - minY).toFixed(iconFloatPrecision);

            if (width === 0 && height === 0) {
              reporter.error("Path bounds were reported as 0 x 0; check if the path is valid");
              if (updateIgnoreFile) {
                ignoreIcon(reporter.name, iconPath, $);
              }
            } else if (width !== iconSize && height !== iconSize) {
              reporter.error(`Size of <path> must be exactly ${iconSize} in one dimension; the size is currently ${width} x ${height}`);
              if (updateIgnoreFile) {
                ignoreIcon(reporter.name, iconPath, $);
              }
            }
          },
          function(reporter, $, ast) {
            reporter.name = "icon-precision";

            const iconPath = $.find("path").attr("d");
            if (!updateIgnoreFile && isIgnored(reporter.name, iconPath)) {
              return;
            }

            const { segments } = parsePath(iconPath);
            const segmentParts = segments.flat().filter((num) => (typeof num === 'number'));

            const countDecimals = (num) => {
              if (num && num % 1) {
                let [base, op, trail] = num.toExponential().split(/e([+-])/);
                let elen = parseInt(trail, 10);
                let idx = base.indexOf('.');
                return idx == -1 ? elen : base.length - idx - 1 + (op === '+' ? -elen : elen);
              }
              return 0;
            };
            const precisionArray = segmentParts.map(countDecimals);
            const precisionMax = precisionArray && precisionArray.length > 0 ?
              Math.max(...precisionArray) :
              0;

            if (precisionMax > iconMaxFloatPrecision) {
              reporter.error(`Maximum precision should not be greater than ${iconMaxFloatPrecision}; it is currently ${precisionMax}`);
              if (updateIgnoreFile) {
                ignoreIcon(reporter.name, iconPath, $);
              }
            }
          },
          function(reporter, $, ast) {
            reporter.name = "icon-path";

            const iconPath = $.find("path").attr("d");
            if (!updateIgnoreFile && isIgnored(reporter.name, iconPath)) {
              return;
            }

            const { segments } = parsePath(iconPath);

            const lowerCommand = ['m', 'l'];
            const lowerDirectionCommand = ['h', 'v'];
            const upperCommand = ['M', 'L'];
            const upperDirectionCommand = ['H', 'V'];
            const commands = [...lowerCommand, ...lowerDirectionCommand, ...upperCommand, ...upperDirectionCommand];
            const getInvalidSegments = ([command, coord1, coord2, ...rest], index) => {
              if (commands.includes(command)) {
                // Relative directions (h or v) having a length of 0
                if (lowerDirectionCommand.includes(command) && coord1 === 0) {
                  return true;
                }
                // Relative movement (m or l) having a distance of 0
                if (lowerCommand.includes(command) && coord1 === 0 && coord2 === 0) {
                  return true;
                }
                if (index > 0) {
                  const [prevCoord2, prevCoord1, ...rest] = [...segments[index - 1]].reverse();
                  // Absolute movement (M or L) having the same coordinate as the previous segment
                  if (upperCommand.includes(command) && coord1 === prevCoord1 && coord2 === prevCoord2) {
                    return true;
                  }
                }
              }
            };
            const invalidSegments = segments.filter(getInvalidSegments);

            if (invalidSegments.length) {
              invalidSegments.forEach(([command, coord1, coord2]) => {
                let readableSegment = `${command}${coord1}`;
                if (coord2 !== undefined) {
                  readableSegment += ` ${coord2}`;
                }
                reporter.error(`Unexpected segment ${readableSegment} in path.`);
              });
              if (updateIgnoreFile) {
                ignoreIcon(reporter.name, iconPath, $);
              }
            }
          },
          function(reporter, $, ast) {
            reporter.name = "extraneous";

            const rawSVG = $.html();
            if (!svgRegexp.test(rawSVG)) {
              reporter.error("Unexpected character(s), most likely extraneous whitespace, detected in SVG markup");
            }
          },
          function(reporter, $, ast) {
            reporter.name = "icon-centered";

            const iconPath = $.find("path").attr("d");
            if (!updateIgnoreFile && isIgnored(reporter.name, iconPath)) {
              return;
            }

            const [minX, minY, maxX, maxY] = svgPathBbox(iconPath);
            const targetCenter = iconSize / 2;
            const centerX = +((minX + maxX) / 2).toFixed(iconFloatPrecision);
            const devianceX = centerX - targetCenter;
            const centerY = +((minY + maxY) / 2).toFixed(iconFloatPrecision);
            const devianceY = centerY - targetCenter;

            if (
              Math.abs(devianceX) > iconTolerance ||
              Math.abs(devianceY) > iconTolerance
            ) {
              reporter.error(`<path> must be centered at (${targetCenter}, ${targetCenter}); the center is currently (${centerX}, ${centerY})`);
              if (updateIgnoreFile) {
                ignoreIcon(reporter.name, iconPath, $);
              }
            }
          }
        ]
    }
};
