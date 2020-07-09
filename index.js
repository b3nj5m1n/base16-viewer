
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

data = "";

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
    update();
}

function parseInput() {
    data = document.getElementById("parser-input").value;
    parsePlaceholder();
}
