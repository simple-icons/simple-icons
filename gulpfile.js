var gulp = require('gulp');
var svg2png = require('gulp-svg2png');

var iconsConfig = require('./icons.json');

gulp.task('icons', function () {

  console.log('Building ' + iconsConfig.length + ' icons');

  for (var i = iconsConfig.length - 1; i >= 0; i--) {

    var slug = iconsConfig[i].slug;

    gulp.src('./icons-source/' + slug + '/*.svg')
      .pipe(gulp.dest('./icons/' + slug + '/svg' ))
      .pipe(svg2png())
      .pipe(gulp.dest('./icons/' + slug + '/png' ));
  };
});
