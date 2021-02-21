const { extendDefaultPlugins } = require('svgo');

module.exports = {
  multipass: true,
  plugins: extendDefaultPlugins([
    {
      name: 'convertPathData',
      params: {
        // 3 decimals of precision in floating point numbers
        floatPrecision: 3,
        // Some editors (eg. Adobe Illustrator and Sketch) does not parse flags
        // without space wrapping
        noSpaceAfterFlags: false,
      }
    },

    // Sort attributes on the <SVG>
    {
      name: 'sortAttrs',
      params: {
        order: ['role', 'viewBox'],
        xmlnsOrder: 'end',
      }
    },

    // Convert basic shapes (such as <circle>) to <path>, including <arc>
    {
      name: 'convertShapeToPath',
      params: {
        convertArcs: true
      }
    },

    // Compound all <path>s into one
    {
      name: 'mergePaths',
      params: {
        force: true,
        noSpaceAfterFlags: false,
      }
    },

    // Keep the <title> tag
    {
      name: 'removeTitle',
      active: false,
    },

    // Don't remove the role="img" attribute and automatically
    // add it to the SVG if it's not
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [
          {role: 'img'},
        ]
      }
    },

    // Keep the 'role' attribute, if is already defined
    {
      name: 'removeUnknownsAndDefaults',
      params: {
        keepRoleAttr: true,
      }
    },

    // Remove all attributes except 'role', 'viewBox' and 'xmlns' of <svg>s
    {
      name: 'removeAttrs',
      params: {
        attrs: [
          'baseProfile',
          'version',
          'fill-rule',
        ],
      }
    },

    // Remove paths with fill="none"
    {
      name: 'removeUselessStrokeAndFill',
      params: {
        removeNone: true,
      }
    },

    // Explicitly enable everything else
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeEditorsNSData',
    'cleanupAttrs',
    'inlineStyles',
    'minifyStyles',
    'convertStyleToAttrs',
    'cleanupIDs',
    'prefixIds',
    'removeRasterImages',
    'removeUselessDefs',
    'cleanupNumericValues',
    'cleanupListOfValues',
    'convertColors',
    'removeNonInheritableGroupAttrs',
    'removeViewBox',
    'cleanupEnableBackground',
    'removeHiddenElems',
    'removeEmptyText',
    'moveElemsAttrsToGroup',
    'moveGroupAttrsToElems',
    'collapseGroups',
    'convertTransform',
    'removeEmptyAttrs',
    'removeEmptyContainers',
    'removeUnusedNS',
    'removeDesc',
    'removeDimensions',
    'removeStyleElement',
    'removeScriptElement',
    'removeOffCanvasPaths',
    'reusePaths',
  ])
};
