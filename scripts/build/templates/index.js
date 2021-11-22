var icons = {%s};

Object.defineProperty(icons, "Get", {
  enumerable: false,
  value: function(targetName) {
    return icons[targetName];
  }
});

Object.defineProperty(icons, "get", {
  enumerable: false,
  value: function(targetName) {
    return this.Get(targetName);
  }
});

module.exports = icons;
