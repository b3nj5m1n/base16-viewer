
palette = [
]

function init() {
    data = exampleColors[Math.floor(Math.random() * exampleColors.length)]["value"];
    parseData();
    update();
}

function update() {
    var divs = document.getElementById("colors").querySelectorAll("div");
    for (var i = 0, len = divs.length; i < len; i++) {
        divs[i].style.backgroundColor = palette[i];
    }
}

function colorClicked(index) {
    copyToClipboard(palette[index]);
}

data = "";
// 0 = base16
// 1 = Xresources
// 2 = placeholder file format (From my dotfiles)
dataFormat = -1;

function getDataType() {
    // Test for base16 format
    if (data.includes("scheme") && data.includes("author") && data.includes("base00")) {
        dataFormat = 0;
    }
    // Test for Xresources format
    else if (data.includes("*.color0:") || data.includes("*color0:")) {
        dataFormat = 1;
    }
    // Test for placeholder format
    else if (data.includes("placeholder") && data.includes("suffix") && data.includes("value")) {
        dataFormat = 2;
    }
}

function parseBase16() {
    var lines = data.split('\n');
    for (var i = 0, len = lines.length; i < len; i++) {
        for (var j = 0; j < 16; j++) {
            var line = lines[i].replace(/:.*/, "").replace("base", "");
            if (parseInt(line, 16) === j) {
                hex = lines[i].replace(/^.* \"/, "").replace('"', "");;
                palette[j] = "#" + hex;
            }
        }
    }
}

function parseXresources() {
    var lines = data.split('\n');
    for (var i = 0, len = lines.length; i < len; i++) {
        for (var j = 0; j < 16; j++) {
            var line = lines[i].replace(/:.*/, "").replace(/^.*color/, "");
            if (parseInt(line) === j) {
                hex = lines[i].replace(/^.* #/, "").replace('"', "");;
                palette[j] = "#" + hex;
            }
        }
    }
}

function parsePlaceholder() {
    var obj = JSON.parse(data);
    var values = []
    for (const placeholder of obj["placeholders"]) {
        var name = placeholder["placeholder"];
        if (name[0] === 'c') {
            // console.log(name);
            var suffixes = placeholder["suffixes"];
            for (var j = 0, len = suffixes.length; j < len; j++) {
                if (suffixes[j]["suffix"] === "hex") {
                    // console.log(suffixes[j]["value"]);
                    if (values.length < 16) {
                        values.push(suffixes[j]["value"]);
                    }
                }
            }
        }
    }
    palette = values;
}

function parseData() {
    getDataType();
    if (dataFormat === 0) {
        parseBase16();
    }
    else if (dataFormat === 1) {
        parseXresources();
    }
    else if (dataFormat === 2) {
        parsePlaceholder();
    }
    update();
}

function parseInput() {
    data = document.getElementById("parser-input").value;
    parseData();
}

const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};
