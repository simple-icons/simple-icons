var icons = {%s};

module.exports = icons;
module.exports.get = function(targetName) {
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
