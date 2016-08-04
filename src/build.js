// Get JSON from source file
var source = require('./simple-icons.json');

console.log("\nBuilding " + source.icons.length + " icons...\n");

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
for (var i = 0; i < source.icons.length; i++) {
    source.icons[i].hue += 90;
    source.icons[i].hue = source.icons[i].hue % 360;
}
source.icons.sort(function(a, b) {
    return parseFloat(a.hue) - parseFloat(b.hue);
});
var tmp = [];
for (var i = 0; i < source.icons.length; i++) {
    if (source.icons[i].luminance < 15) {
        tmp.push(source.icons[i]);
        source.icons.splice(i,1);
        i--;
    }
}
for (var i = 0; i < source.icons.length; i++) {
    if (source.icons[i].saturation < 25) {
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
var header = fs.readFileSync('./header.html', 'utf8');
var footer = fs.readFileSync('./footer.html', 'utf8');

// Build content
var main = "            <ul class=\"tiles tiles--full\">";

for (var i = 0; i < source.icons.length; i++) {
    var fileName = source.icons[i].title.toLowerCase();
    fileName = fileName.replace(/[!|’|.| |-]/g, ''); // Replace bang, apostrophe, period and space with nothing.
    fileName = fileName.replace(/[+]/, 'plus'); // Replace the plus symbol with “plus”.
    filePath = "../icons/" + fileName + ".svg";
    var fs = require('fs');
    var svg = fs.readFileSync(filePath, 'utf8');
    var searchTerms = source.icons[i].title.toLowerCase() + " " + source.icons[i].hex.toLowerCase();
    if (source.icons[i].title.toLowerCase() != fileName.toLowerCase()) {
        searchTerms = searchTerms + " " + fileName.toLowerCase();
    }
    main += "\n            <li class=\"tiles__item\" data-search=\"" + searchTerms + "\" style=\"background-color:#" + source.icons[i].hex + "\"><a href=\"https://simpleicons.org/icons/" + fileName + ".svg\" class=\"icon--link\" title=\"" + source.icons[i].title + "\">" + svg + "<span class=\"tile-name\">" + source.icons[i].title + "</span></a>" + "<span class=\"hex\">#" + source.icons[i].hex + "</span></li>";
}

// Put all content together and export to index.html
var htmlOutput = header + main + footer;
fs.writeFile("../index.html", htmlOutput, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log(" - index.html built successfully.");
});

// Also output to 404.html
fs.writeFile("../404.html", htmlOutput, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log(" - 404.html built successfully.");
});

var sass = "// Brand colours from simpleicons.org\n";
var less = "// Brand colours from simpleicons.org\n";
var maxNameLength = 0;

for (var i = 0; i < source.icons.length; i++) {
    var fileName = source.icons[i].title.toLowerCase();
    fileName = fileName.replace(/[!|’|.| |-]/g, ''); // Replace bang, apostrophe, period and space with nothing.
    fileName = fileName.replace(/[+]/, 'plus'); // Replace the plus symbol with “plus”.

    if (fileName.length > maxNameLength) {
        maxNameLength = fileName.length;
    }
}

// Sort icons alphabetically
source.icons.sort(function(a, b) {
    if (a.title < b.title) {
        return -1;
    }
    if (a.title > b.title) {
        return 1;
    }
    // names must be equal
    return 0;
});

for (var i = 0; i < source.icons.length; i++) {
    var fileName = source.icons[i].title.toLowerCase();
    fileName = fileName.replace(/[!|’|.| |-]/g, ''); // Replace bang, apostrophe, period and space with nothing.
    fileName = fileName.replace(/[+]/, 'plus'); // Replace the plus symbol with “plus”.

    spacing = "";
    if (fileName.length < maxNameLength) {
        spacing = " ".repeat(maxNameLength - fileName.length);
    }

    sass += "\n$color-brand-" + fileName.toLowerCase() + ": " + spacing + "#" + source.icons[i].hex.toUpperCase() + ";";
    less += "\n@color-brand-" + fileName.toLowerCase() + ": " + spacing + "#" + source.icons[i].hex.toUpperCase() + ";";
}

// Generate Sass file with colour variables
fs.writeFile("../colour-variables.scss", sass, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log(" - brand-colours.scss built successfully.");
});

// Generate Less file with colour variables
fs.writeFile("../colour-variables.less", less, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log(" - brand-colours.less built successfully.");
});