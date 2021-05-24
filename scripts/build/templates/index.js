var icons = {%s};

Object.defineProperty(icons, "get", {
  enumerable: false,
  value: function(targetName) {
    return icons[targetName];
  }
});

module.exports = icons;
