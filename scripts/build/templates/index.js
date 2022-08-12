console.warn('Deprecation warning: The `simple-icons` entrypoint will be removed in the next major. Please switch to using `import * as icons from "simple-icons/icons"` if you need an object with all the icons.')

%s

var icons = {%s};

Object.defineProperty(icons, "Get", {
  enumerable: false,
  value: function(targetName) {
    return icons[targetName];
  }
});

module.exports = icons;
