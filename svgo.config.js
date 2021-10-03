module.exports = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // customize options
          convertPathData: {
            // 3 decimals of precision in floating point numbers
            floatPrecision: 5,
            // Some editors (e.g. Adobe Illustrator and Sketch) cannot parse flags
            // without space wrapping
            noSpaceAfterFlags: false,
          },

          // Sort the attributes on the <svg> tag
          sortAttrs: {
            order: ['role', 'viewBox'],
            xmlnsOrder: 'end',
          },

          // Convert basic shapes (such as <circle>) to <path>
          convertShapeToPath: {
            // including <arc>
            convertArcs: true,
          },

          // Compound all <path>s into one
          mergePaths: {
            force: true,
            noSpaceAfterFlags: false,
          },

          // Keep the <title> tag
          removeTitle: false,

          // Keep the role="img" attribute and automatically add it
          // to the <svg> tag if it's not there already
          addAttributesToSVGElement: {
            attributes: [
              {role: 'img'},
            ],
          },

          // Keep the 'role' attribute, if it's already defined
          removeUnknownsAndDefaults: {
            keepRoleAttr: true,
          },

          // Remove all attributes except 'role', 'viewBox', and 'xmlns' from
          // <svg> tags
          removeAttrs: {
            attrs: [
              'baseProfile',
              'version',
              'fill-rule',
            ],
          },

          // Remove paths with fill="none"
          removeUselessStrokeAndFill: {
            removeNone: true,
          },

          // Explicitly enable everything else
          removeDoctype: true,
          removeXMLProcInst: true,
          removeComments: true,
          removeMetadata: true,
          removeEditorsNSData: true,
          cleanupAttrs: true,
          inlineStyles: true,
          minifyStyles: true,
          convertStyleToAttrs: true,
          cleanupIDs: true,
          prefixIds: true,
          removeRasterImages: true,
          removeUselessDefs: true,
          cleanupNumericValues: true,
          cleanupListOfValues: true,
          convertColors: true,
          removeNonInheritableGroupAttrs: true,
          removeViewBox: true,
          cleanupEnableBackground: true,
          removeHiddenElems: true,
          removeEmptyText: true,
          moveElemsAttrsToGroup: true,
          moveGroupAttrsToElems: true,
          collapseGroups: true,
          convertTransform: true,
          removeEmptyAttrs: true,
          removeEmptyContainers: true,
          removeUnusedNS: true,
          removeDesc: true,
          removeDimensions: true,
          removeStyleElement: true,
          removeScriptElement: true,
          removeOffCanvasPaths: true,
          reusePaths: true,
        },
      },
    },
  ],
};
