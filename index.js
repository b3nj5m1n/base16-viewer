
// Dracula
palette = [
    "#282936",
    "#3a3c4e",
    "#4d4f68",
    "#626483",
    "#62d6e8",
    "#e9e9f4",
    "#f1f2f8",
    "#f7f7fb",
    "#ea51b2",
    "#b45bcf",
    "#00f769",
    "#ebff87",
    "#a1efe4",
    "#62d6e8",
    "#b45bcf",
    "#00f769"
]

function init() {
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
    else if (data.includes("*.color0:")) {
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

function parseInput() {
    data = document.getElementById("parser-input").value;
    getDataType();
    if (dataFormat === 0) {
        parseBase16();
    }
    else if (dataFormat === 1) {
    }
    else if (dataFormat === 2) {
        parsePlaceholder();
    }
    update();
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
