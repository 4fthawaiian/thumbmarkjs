let person = "nick";

document.getElementById("files").addEventListener("change", (event) => {
    if(event.target.value === "Choose a file") return;
    var el = document.getElementById('files');
    person = el.options[el.selectedIndex].innerHTML;
    compareFromFile(event.target.value);
    openModal();
});
const modalContent = document.getElementById('modalContent');
const clearModal = () => {
    modalContent.innerHTML = ``;
}
const writeToModal = (text) => {
    modalContent.innerHTML += `<p>${text}</p>`
}
const compareJsons = (a, b) => {
    clearModal();
    validKeys = {
        "audio": {},
        "canvas": {},
        "fonts": {},
        "hardware": {
            videocard: {},
        },
        "locales": {},
        "permissions": {},
        "plugins": {
            "plugins": {}
        },
        "screen": {
            mediaMatches: {}
        },
        "system": {
            browser: {},
        },
        "webgl": {},
        "math": {},
    };
    let matchCount = 0, missCount = 0, points = 0;
    const a_json = JSON.parse(a.innerHTML);
    const b_json = JSON.parse(b.innerHTML);
    let a_keys = Object.keys(a_json);
    let b_keys = Object.keys(b_json);
    let matches = "", misses = "", missKeys = [];
    writeToModal("<br><span class='bold text-xl'>Matches: </span><br>")
    a_keys.forEach(x => {
        if(!b_json[x]) {
            // console.log('b missing %s', x);
            misses += `<span style="color:red;">${x} missing</span><br>`
            missKeys.push(x);
            missCount++;
        } else {
            if( JSON.stringify(a_json[x]) === JSON.stringify(b_json[x]) ) {
                // writeToModal(`${x} matches`);
                matches += `${x} <span style="color: lawngreen">&check;</span> <br>`;
                matchCount++;
            } else {
                // console.log("%c %s doesn't match", "color:red;", x);
                // misses += `<span style="color:red;">${x} doesn't match</span><br>`;
                missKeys.push(x);
                missCount++;
            }
        }
    })
    points = missCount + matchCount;
    let percentPoints = ((matchCount / points) * 100).toFixed(2);
    writeToModal(matches)
    writeToModal(misses)
    if(missKeys.length === 0) {
        writeToModal(`<br> All matches - you are ${person}`)
    } else {
        writeToModal(`<br> <span class="bold text-xl">you aren't ${person}</span> `)
    }
    writeToModal(`<br><span class="">${percentPoints}% match of data points</span>`)
    writeToModal("<br><span class='bold text-xl'>Misses: </span><br>")
    missKeys.forEach(x => {
        writeToModal(`<span style="color:red">${x}</span><br>`)
    })
    // writeToModal(`<br> <span class="color-red">${missKeys.join('</span><br></span>')}</span>`)
    // writeToModal(`<br> <span class="bold text-xl color-red">${b_keys.join('<br>')}</span>`)
}
const getJson = async (jsonFile) => {
    const response = await fetch(jsonFile);
    return await response.json();
}
const compareFromFile = (file='nick.json') => {
    getJson(file).then((json) => {
        document.getElementById('fileName').innerHTML = file;
        document.getElementById("first").innerHTML = JSON.stringify(json, null, 2);
        ThumbmarkJS.getFingerprintData().then((fp) => {
            document.getElementById("detected").innerHTML = JSON.stringify(fp, null, 2);
            compareJsons(document.getElementById("first"), document.getElementById('detected'));
        })
    });
}
closeModal = () => {
    const modal = document.getElementById('myModal');
    modal.style.display = "none";
}
openModal = () => {
    const modal = document.getElementById('myModal');
    modal.style.display = "block";
}
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
btn.onclick = function() {
    modal.style.display = "block";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
document.onkeydown = function(evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
        isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
        closeModal()
    }
};
compareFromFile();
