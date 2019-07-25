var icons = {%s};

Object.defineProperty(icons, "get", {
  enumerable: false,
  value: function(targetName) {
    if (icons[targetName]) {
      return icons[targetName];
    } else {
      var normalizedName = targetName.toLowerCase();
      for (var iconName in icons) {
        var icon = icons[iconName];
        if ((icon.title && icon.title.toLowerCase() === normalizedName)
         || (icon.slug && icon.slug === normalizedName)) {
           return icon;
        }
      }
    }
  }
});

module.exports = icons;
