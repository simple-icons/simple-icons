var icons = {%s};

Object.defineProperty(icons, "Get", {
  enumerable: false,
  value: function(targetName) {
    return icons[targetName];
  }
});

module.exports = icons;
