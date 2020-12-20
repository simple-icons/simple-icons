var icons = {%s};

Object.defineProperty(icons, "get", {
  enumerable: false,
  value: function(targetName) {
    if (icons[targetName]) {
      return icons[targetName];
    }
    var normalizedName = targetName.toLowerCase();
    for (var iconName in icons) {
      var icon = icons[iconName];
      if (icon.title.toLowerCase() === normalizedName || icon.slug === normalizedName) {
         return icon;
      }
    }
  }
});

module.exports = icons;
