// Get JSON from source file
var source = require('./simple-icons.json');

// Loop through icons
for (var i = 0; i < source.icons.length; i++) {

    var hex = source.icons[i].hex;

    // Add red, green and blue values to the JSON object
    var red   = parseInt(hex.substr(0,2), 16) / 255;
    var green = parseInt(hex.substr(2,2), 16) / 255;
    var blue  = parseInt(hex.substr(4,2), 16) / 255;

    // Add hue to the JSON object
    var max = Math.max(red, green, blue);
    var min = Math.min(red, green, blue);
    var delta = max - min;
    if (delta === 0) {
        var hue = 0;
    } else {
        if (max === red) {
            var hue = ((green - blue) / delta) * 60;
            if (hue < 0) {
                hue += 360;
            }
        } else if (max === green) {
            var hue = (((blue - red) / delta) + 2) * 60;
        } else {
            var hue = (((red - green) / delta) + 4) * 60;
        }
    }
    source.icons[i].hue = hue;
}

// Sort icons by hue
source.icons.sort(function(a, b) {
    return parseFloat(b.hue) - parseFloat(a.hue);
});

// Read header and footer content into variables
var fs = require('fs');
function readFile(path, callback) {
    try {
        var filename = require.resolve(path);
        fs.readFile(filename, 'utf8', callback);
    } catch (e) {
        callback(e);
    }
}
var fs = require('fs');
var header = fs.readFileSync('./src/header.html', 'utf8');
var footer = fs.readFileSync('./src/footer.html', 'utf8');

// Build tiles content
var main = "";
for (var i = 0; i < source.icons.length; i++) {
    main += "<li class=\"tiles__item\" style=\"background-color:#" + source.icons[i].hex + "\">" + source.icons[i].title + "<br>#" + source.icons[i].hex + "</li>";
}

// Put all content together and export to index.html
var htmlOutput = header + main + footer;
fs.writeFile("./index.html", htmlOutput, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});