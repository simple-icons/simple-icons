const fs = require('fs');

const data = require("./_data/simple-icons.json");
const { htmlFriendlyToTitle } = require("./scripts/utils.js");
const svgpath = require("svgpath");
const { svgPathBbox } = require("svg-path-bbox");
const parsePath = require("svg-path-segments");

const titleRegexp = /(.+) icon$/;
const svgRegexp = /^<svg( [^\s]*=".*"){3}><title>.*<\/title><path d=".*"\/><\/svg>\r?\n?$/;
const negativeZerosRegexp = /-0(?=[^\.]|[\s\d\w]|$)/g;

const iconSize = 24;
const iconFloatPrecision = 3;
const iconMaxFloatPrecision = 5;
const iconTolerance = 0.001;

// set env SI_UPDATE_IGNORE to recreate the ignore file
const updateIgnoreFile = process.env.SI_UPDATE_IGNORE === 'true';
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

/**
 * Parses a SVG path using svg-path-segments library and building a svgpath
 *   instance with the result, returning a convenient object with two properties:
 *   - `segments`: array of path segments as are returned by svg-path-segments.
 *   - `svgPath`: instance of svgpath object that can be manipulated easily.
 **/
function segmentsSvgPath(iconPath) {
  const segments = parsePath(iconPath);
  const SVGPath = svgpath("");
  SVGPath.segments = segments.map(segment => segment.params);
  return {segments, SVGPath};
}

function removeLeadingZeros(number) {
  // convert 0.03 to '.03'
  return number.toString().replace(/^(-?)(0)(\.?.+)/, '$1$3');
}

/**
 * Given three points, returns if the middle one (x2, y2) is collinear
 *   to the line formed by the two limit points.
 **/
function collinear(x1, y1, x2, y2, x3, y3) {
    return (x1 * (y2 - y3) + x2 * (y3 - y1) +  x3 * (y1 - y2)) === 0;
}

/**
 * Returns the number of decimals that have a number.
 **/
function countDecimals(num) {
  if (num && num % 1) {
    let [base, op, trail] = num.toExponential().split(/e([+-])/);
    let elen = parseInt(trail, 10);
    let idx = base.indexOf('.');
    return idx == -1 ? elen : base.length - idx - 1 + (op === '+' ? -elen : elen);
  }
  return 0;
};

/**
 * Returns the index in which a SVG path starts given the content of its file.
 **/
function getPathDIndex(svgFileContent) {
  const pathDStart = '<path d="';
  return svgFileContent.indexOf(pathDStart) + pathDStart.length;
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

            const segments = parsePath(iconPath),
                  svgFileContent = $.html();

            segments.forEach((segment) => {
              const precisionMax = Math.max(...segment.params.slice(1).map(countDecimals));
              if (precisionMax > iconMaxFloatPrecision) {
                let errorMsg = `found ${precisionMax} decimals in segment`
                             + ` "${iconPath.substring(segment.start, segment.end)}"`;
                if (segment.chained) {
                  let readableChain = iconPath.substring(segment.chainStart, chainEnd);
                  if (readableChain.length > 20) {
                    readableChain = `${readableChain}...`;
                  }
                  errorMsg += ` of chain "${readableChain}"`
                }
                errorMsg += ` at index ${segment.start + getPathDIndex(svgFileContent)}`;
                reporter.error(`Maximum precision should not be greater than ${iconMaxFloatPrecision}; ${errorMsg}`);
                if (updateIgnoreFile) {
                  ignoreIcon(reporter.name, iconPath, $);
                }
              }
            })
          },
          function(reporter, $, ast) {
            reporter.name = "ineffective-segments";

            const iconPath = $.find("path").attr("d");
            if (!updateIgnoreFile && isIgnored(reporter.name, iconPath)) {
              return;
            }

            const { segments, SVGPath } = segmentsSvgPath(iconPath);
            const absSegments = SVGPath.abs().unshort().segments;

            const lowerMovementCommands = ['m', 'l'];
            const lowerDirectionCommands = ['h', 'v'];
            const lowerCurveCommand = 'c';
            const lowerShorthandCurveCommand = 's';
            const lowerCurveCommands = [lowerCurveCommand, lowerShorthandCurveCommand];
            const upperMovementCommands = ['M', 'L'];
            const upperHorDirectionCommand = 'H';
            const upperVerDirectionCommand = 'V';
            const upperDirectionCommands = [upperHorDirectionCommand, upperVerDirectionCommand];
            const upperCurveCommand = 'C';
            const upperShorthandCurveCommand = 'S';
            const upperCurveCommands = [upperCurveCommand, upperShorthandCurveCommand];
            const curveCommands = [...lowerCurveCommands, ...upperCurveCommands];
            const commands = [...lowerMovementCommands, ...lowerDirectionCommands, ...upperMovementCommands, ...upperDirectionCommands, ...curveCommands];
            const isInvalidSegment = ([command, x1Coord, y1Coord, ...rest], index) => {
              if (commands.includes(command)) {
                // Relative directions (h or v) having a length of 0
                if (lowerDirectionCommands.includes(command) && x1Coord === 0) {
                  return true;
                }
                // Relative movement (m or l) having a distance of 0
                if (index > 0 && lowerMovementCommands.includes(command) && x1Coord === 0 && y1Coord === 0) {
                  return true;
                }
                if (lowerCurveCommands.includes(command) && x1Coord === 0 && y1Coord === 0) {
                  const [x2Coord, y2Coord] = rest;
                  if (
                    // Relative shorthand curve (s) having a control point of 0
                    command === lowerShorthandCurveCommand ||
                    // Relative bézier curve (c) having control points of 0
                    (command === lowerCurveCommand && x2Coord === 0 && y2Coord === 0)
                  ) {
                    return true;
                  }
                }
                if (index > 0) {
                  let [yPrevCoord, xPrevCoord] = [...absSegments[index - 1]].reverse();
                  // If the previous command was a direction one, we need to iterate back until we find the missing coordinates
                  if (upperDirectionCommands.includes(xPrevCoord)) {
                    xPrevCoord = undefined;
                    yPrevCoord = undefined;
                    let idx = index;
                    while (--idx > 0 && (xPrevCoord === undefined || yPrevCoord === undefined)) {
                      let [yPrevCoordDeep, xPrevCoordDeep] = [...absSegments[idx]].reverse();
                      // If the previous command was a horizontal movement, we need to consider the single coordinate as x
                      if (upperHorDirectionCommand === xPrevCoordDeep) {
                        xPrevCoordDeep = yPrevCoordDeep;
                        yPrevCoordDeep = undefined;
                      }
                      // If the previous command was a vertical movement, we need to consider the single coordinate as y
                      if (upperVerDirectionCommand === xPrevCoordDeep) {
                        xPrevCoordDeep = undefined;
                      }
                      if (xPrevCoord === undefined && xPrevCoordDeep !== undefined) {
                        xPrevCoord = xPrevCoordDeep;
                      }
                      if (yPrevCoord === undefined && yPrevCoordDeep !== undefined) {
                        yPrevCoord = yPrevCoordDeep;
                      }
                    }
                  }

                  if (upperCurveCommands.includes(command)) {
                    const [x2Coord, y2Coord, xCoord, yCoord] = rest;
                    // Absolute shorthand curve (S) having the same coordinate as the previous segment and a control point equal to the ending point
                    if (upperShorthandCurveCommand === command && x1Coord === xPrevCoord && y1Coord === yPrevCoord && x1Coord === x2Coord && y1Coord === y2Coord) {
                      return true;
                    }
                    // Absolute bézier curve (C) having the same coordinate as the previous segment and last control point equal to the ending point
                    if (upperCurveCommand === command && x1Coord === xPrevCoord && y1Coord === yPrevCoord && x2Coord === xCoord && y2Coord === yCoord) {
                      return true;
                    }
                  }

                  return (
                    // Absolute horizontal direction (H) having the same x coordinate as the previous segment
                    (upperHorDirectionCommand === command && x1Coord === xPrevCoord) ||
                    // Absolute vertical direction (V) having the same y coordinate as the previous segment
                    (upperVerDirectionCommand === command && x1Coord === yPrevCoord) ||
                    // Absolute movement (M or L) having the same coordinate as the previous segment
                    (upperMovementCommands.includes(command) && x1Coord === xPrevCoord && y1Coord === yPrevCoord)
                  );
                }
              }
            };

            const svgFileContent = $.html();

            segments.forEach((segment, index) => {
              if (isInvalidSegment(segment.params, index)) {
                const [command, x1, y1, ...rest] = segment.params;
                if (curveCommands.includes(command)) {
                  const [x2, y2, x, y] = rest;
                };

                let errorMsg = `Innefective segment "${iconPath.substring(segment.start, segment.end)}" found`,
                    resolutionTip = 'should be removed';

                if (segment.chained) {
                  let readableChain = iconPath.substring(segment.chainStart, segment.chainEnd);
                  if (readableChain.length > 20) {
                    readableChain = `${chain.substring(0, 20)}...`
                  }
                  errorMsg += ` in chain "${readableChain}"`
                }
                errorMsg += ` at index ${segment.start + getPathDIndex(svgFileContent)}`;

                if (command === lowerShorthandCurveCommand && (x2 !== 0 || y2 !== 0)) {
                  resolutionTip = `should be "l${removeLeadingZeros(x2)} ${removeLeadingZeros(y2)}" or removed`;
                }
                if (command === upperShorthandCurveCommand) {
                  resolutionTip = `should be "L${removeLeadingZeros(x2)} ${removeLeadingZeros(y2)}" or removed`;
                }
                if (command === lowerCurveCommand && (x !== 0 || y !== 0)) {
                  resolutionTip = `should be "l${removeLeadingZeros(x)} ${removeLeadingZeros(y)}" or removed`;
                }
                if (command === upperCurveCommand) {
                  resolutionTip = `should be "L${removeLeadingZeros(x)} ${removeLeadingZeros(y)}" or removed`;
                }

                reporter.error(`${errorMsg} (${resolutionTip})`);

                if (updateIgnoreFile) {
                  ignoreIcon(reporter.name, iconPath, $);
                }
              }
            })
          },
          function(reporter, $, ast) {
            reporter.name = "collinear-segments";

            const iconPath = $.find("path").attr("d");
            if (!updateIgnoreFile && isIgnored(reporter.name, iconPath)) {
              return;
            }

            /**
             * Extracts collinear coordinates from SVG path straight lines
             *   (does not extracts collinear coordinates from curves).
             **/
            const getCollinearSegments = (iconPath) => {
              const segments = parsePath(iconPath),
                    collinearSegments = [],
                    straightLineCommands = 'HhVvLlMm',
                    zCommands = 'Zz';

              let currLine = [],
                  currAbsCoord = [undefined, undefined],
                  startPoint,
                  _inStraightLine = false,
                  _nextInStraightLine = false,
                  _resetStartPoint = false;

              for (let s = 0; s < segments.length; s++) {
                let seg = segments[s].params,
                    cmd = seg[0],
                    nextCmd = s + 1 < segments.length ? segments[s + 1][0] : null;

                if ('LM'.includes(cmd)) {
                  currAbsCoord[0] = seg[1];
                  currAbsCoord[1] = seg[2];
                } else if ('lm'.includes(cmd)) {
                  currAbsCoord[0] = (!currAbsCoord[0] ? 0 : currAbsCoord[0]) + seg[1];
                  currAbsCoord[1] = (!currAbsCoord[1] ? 0 : currAbsCoord[1]) + seg[2];
                } else if (cmd === 'H') {
                  currAbsCoord[0] = seg[1];
                } else if (cmd === 'h') {
                  currAbsCoord[0] = (!currAbsCoord[0] ? 0 : currAbsCoord[0]) + seg[1];
                } else if (cmd === 'V') {
                  currAbsCoord[1] = seg[1];
                } else if (cmd === 'v') {
                  currAbsCoord[1] = (!currAbsCoord[1] ? 0 : currAbsCoord[1]) + seg[1];
                } else if (cmd === 'C') {
                  currAbsCoord[0] = seg[5];
                  currAbsCoord[1] = seg[6];
                } else if (cmd === "a") {
                  currAbsCoord[0] = (!currAbsCoord[0] ? 0 : currAbsCoord[0]) + seg[6];
                  currAbsCoord[1] = (!currAbsCoord[1] ? 0 : currAbsCoord[1]) + seg[7];
                } else if (cmd === "A") {
                  currAbsCoord[0] = seg[6];
                  currAbsCoord[1] = seg[7];
                } else if (cmd === "s") {
                  currAbsCoord[0] = (!currAbsCoord[0] ? 0 : currAbsCoord[0]) + seg[1];
                  currAbsCoord[1] = (!currAbsCoord[1] ? 0 : currAbsCoord[1]) + seg[2];
                } else if (cmd === "S") {
                  currAbsCoord[0] = seg[1];
                  currAbsCoord[1] = seg[2];
                } else if (cmd === "t") {
                  currAbsCoord[0] = (!currAbsCoord[0] ? 0 : currAbsCoord[0]) + seg[1];
                  currAbsCoord[1] = (!currAbsCoord[1] ? 0 : currAbsCoord[1]) + seg[2];
                } else if (cmd === "T") {
                  currAbsCoord[0] = seg[1];
                  currAbsCoord[1] = seg[2];
                } else if (cmd === 'c') {
                  currAbsCoord[0] = (!currAbsCoord[0] ? 0 : currAbsCoord[0]) + seg[5];
                  currAbsCoord[1] = (!currAbsCoord[1] ? 0 : currAbsCoord[1]) + seg[6];
                } else if (cmd === 'Q') {
                  currAbsCoord[0] = seg[3];
                  currAbsCoord[1] = seg[4];
                } else if (cmd === 'q') {
                  currAbsCoord[0] = (!currAbsCoord[0] ? 0 : currAbsCoord[0]) + seg[3];
                  currAbsCoord[1] = (!currAbsCoord[1] ? 0 : currAbsCoord[1]) + seg[4];
                } else if (zCommands.includes(cmd)) {
                  // Overlapping in Z should be handled in another rule
                  currAbsCoord = [startPoint[0], startPoint[1]];
                  _resetStartPoint = true;
                } else {
                  throw new Error(`"${cmd}" command not handled`);
                }

                if (startPoint === undefined) {
                  startPoint = [currAbsCoord[0], currAbsCoord[1]];
                } else if (_resetStartPoint) {
                  startPoint = undefined;
                  _resetStartPoint = false;
                }

                _nextInStraightLine = straightLineCommands.includes(nextCmd);
                let _exitingStraightLine = (_inStraightLine && !_nextInStraightLine);
                _inStraightLine = straightLineCommands.includes(cmd);

                if (_inStraightLine) {
                  currLine.push([currAbsCoord[0], currAbsCoord[1]]);
                } else {
                  if (_exitingStraightLine) {
                    if (straightLineCommands.includes(cmd)) {
                      currLine.push([currAbsCoord[0], currAbsCoord[1]]);
                    }
                    // Get collinear coordinates
                    for (let p = 1; p < currLine.length - 1; p++) {
                      let _collinearCoord = collinear(currLine[p - 1][0],
                                                      currLine[p - 1][1],
                                                      currLine[p][0],
                                                      currLine[p][1],
                                                      currLine[p + 1][0],
                                                      currLine[p + 1][1]);
                      if (_collinearCoord) {
                        collinearSegments.push(
                          segments[s - currLine.length + p + 1]
                        );
                      }
                    }
                  }
                  currLine = [];
                }
              }

              return collinearSegments;
            }

            const collinearSegments = getCollinearSegments(iconPath)
            collinearSegments.forEach((segment) => {
              let errorMsg = `Collinear segment "${iconPath.substring(segment.start, segment.end)}" found`
              if (segment.chained) {
                let readableChain = iconPath.substring(segment.chainStart, segment.chainEnd);
                if (readableChain.length > 20) {
                  readableChain = `${readableChain.substring(0, 20)}...`
                }
                errorMsg += ` in chain "${readableChain}"`;
              }
              errorMsg += ` at index ${segment.start} (should be removed)`;
              reporter.error(errorMsg);
            });

            if (collinearSegments.length) {
              if (updateIgnoreFile) {
                ignoreIcon(reporter.name, iconPath, $);
              }
            }
          },
          function(reporter, $, ast) {
            reporter.name = "extraneous";

            if (!svgRegexp.test($.html())) {
              reporter.error("Unexpected character(s), most likely extraneous whitespace, detected in SVG markup");
            }
          },
          function(reporter, $, ast) {
            reporter.name = "negative-zeros";

            const iconPath = $.find("path").attr("d");
            if (!updateIgnoreFile && isIgnored(reporter.name, iconPath)) {
              return;
            }

            // Find negative zeros inside path
            const negativeZeroMatches = Array.from(iconPath.matchAll(negativeZerosRegexp));
            if (negativeZeroMatches.length) {
              // Calculate the index for each match in the file
              const svgFileContent = $.html();
              const pathDIndex = getPathDIndex(svgFileContent);

              negativeZeroMatches.forEach((match) => {
                const negativeZeroFileIndex = match.index + pathDIndex;
                const previousChar = svgFileContent[negativeZeroFileIndex - 1];
                const replacement = "0123456789".includes(previousChar) ? " 0" : "0";
                reporter.error(`Found "-0" at index ${negativeZeroFileIndex} (should be "${replacement}")`);
              })
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
