var icons = {%s};

Object.defineProperty(icons, "get", {
  enumerable: false,
  value: function(targetName) {
    if (icons[targetName]) {
      return icons[targetName];
    }
  }
});

module.exports = icons;
