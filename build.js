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
    source.icons[i].luminance = 100 * (max + min) / 2;
    if (delta === 0) {
        var hue = 0;
        source.icons[i].saturation = 0;
    } else {
        if (source.icons[i].luminance < 50) {
            source.icons[i].saturation = 100 * (max - min) / (max + min);
        } else {
            source.icons[i].saturation = 100 * (max - min) / (2 - max - min);
        }
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

// Ensures blue icons appear first in the last, purple ones last
for (var i = 0; i < source.icons.length; i++) {
    source.icons[i].hue += 100;
    source.icons[i].hue = source.icons[i].hue % 360;
}
source.icons.sort(function(a, b) {
    return parseFloat(b.hue) - parseFloat(a.hue);
});
var tmp = [];
for (var i = 0; i < source.icons.length; i++) {
    if (source.icons[i].luminance < 10) {
        tmp.push(source.icons[i]);
        source.icons.splice(i,1);
        i--;
    }
}
for (var i = 0; i < source.icons.length; i++) {
    if (source.icons[i].saturation < 5) {
        tmp.push(source.icons[i]);
        source.icons.splice(i,1);
        i--;
    }
}
tmp.sort(function(a, b) {
    return parseFloat(b.luminance) - parseFloat(a.luminance);
});
for (var i = 0; i < tmp.length; i++) {
    source.icons.push(tmp[i]);
}
console.log(tmp);

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

// Build content
var main = "<p class=\"hero\">" + source.icons.length + " SVG icons for popular brands <a href=\"https://github.com/danleech/simple-icons\">Download them from GitHub</a></p>\n<ul class=\"tiles\">";

for (var i = 0; i < source.icons.length; i++) {
    var fileName = source.icons[i].title.toLowerCase();
    fileName = fileName.replace(' ', '');
    fileName = fileName.replace('!', '');
    fileName = fileName.replace('.', '');
    fileName = fileName.replace('+', 'plus');
    filePath = "./icons/" + fileName + ".svg";
    console.log(source.icons[i].title + ", sat = " + source.icons[i].saturation);
    var fs = require('fs');
    var svg = fs.readFileSync(filePath, 'utf8');
    main += "\t\t\t<li style=\"background-color:#" + source.icons[i].hex + "\"><a href=\"https://github.com/danleech/simple-icons/blob/gh-pages/icons/" + fileName + ".svg\">" + svg + source.icons[i].title + "<br><span class=\"hex\">#" + source.icons[i].hex + "</span></a></li>\n";
}

// Put all content together and export to index.html
var htmlOutput = header + main + footer;
fs.writeFile("./index.html", htmlOutput, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});

// Also output to 404.html
fs.writeFile("./404.html", htmlOutput, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The 404 file was saved!");
});

// Build Sharing content
var sharingMain = "";
for (var i = 0; i < source.icons.length; i++) {
    var fileName = source.icons[i].title.toLowerCase();
    fileName = fileName.replace(' ', '');
    fileName = fileName.replace('!', '');
    fileName = fileName.replace('.', '');
    fileName = fileName.replace('+', 'plus');
    filePath = "./icons/" + fileName + ".svg";
    console.log(source.icons[i].title + ", sat = " + source.icons[i].saturation);
    var fs = require('fs');
    var svg = fs.readFileSync(filePath, 'utf8');
    sharingMain += "\t\t\t<li style=\"background-color:#" + source.icons[i].hex + "\" class=\"bars__item\"></li>\n";
}

// Read sharing header and footer content into variables
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
var sharingHeader = fs.readFileSync('./src/sharing-header.html', 'utf8');
var sharingFooter = fs.readFileSync('./src/sharing-footer.html', 'utf8');

// Put all sharing content together and export to sharing.html
var sharingHtmlOutput = sharingHeader + sharingMain + sharingFooter;
fs.writeFile("./src/sharing.html", sharingHtmlOutput, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The sharing file was saved!");
});