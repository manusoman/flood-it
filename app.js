(() => { 'use strict';

const CONFIG_FORM = document.getElementById('gameConfig');
const CLICK_INFO = document.getElementById('clickInfo');
const GAME_BOX = document.getElementById('gameBox');
const COPYRIGHT = document.getElementById('copyright');
const COLORS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
const BOXES = [];
const GAME = [];
const MAX_CLICK_LIST = {
    '14:5': 20,
    '14:6': 25,
    '14:7': 29,
    '14:8': 33,
    '18:5': 26,
    '18:6': 32,
    '18:7': 37,
    '18:8': 42,
    '22:5': 32,
    '22:6': 39,
    '22:7': 45,
    '22:8': 52,
    '26:5': 38,
    '26:6': 46,
    '26:7': 54,
    '26:8': 61
};

let MAX_CLICKS;
let CLICK_COUNT;
let GAME_FINISHED;

const getRandColor = paletteSize => COLORS[
    Math.floor(Math.random() * paletteSize)
];

CONFIG_FORM.onsubmit = e => {
    e.preventDefault();
    const size = parseInt(CONFIG_FORM.sizes.value);
    const colors = parseInt(CONFIG_FORM.colors.value);

    if (isNaN(size) || isNaN(colors)) {
        alert('Invalid size or colors');
        return;
    }

    for (const boxRow of BOXES) {
        for (const box of boxRow) {
            box.onclick = null;
        }
    }
    
    BOXES.length = 0;
    GAME.length = 0;
    GAME_BOX.innerHTML = '';
    MAX_CLICKS = MAX_CLICK_LIST[`${size}:${colors}`]; 
    CLICK_COUNT = 0;
    GAME_FINISHED = false;

    createGame(size, colors);
};

function createGame(size, colors) {
    const table = document.createElement('table');

    for (let i = 0; i < size; ++i) {
        const tr = document.createElement('tr');
        const boxRow = [];
        const colorRow = [];

        for (let j = 0; j < size; ++j) {
            const td = document.createElement('td');
            const color = getRandColor(colors);
            td.className = color;
            tr.appendChild(td);
            boxRow.push(td);
            colorRow.push(color);
            td.onclick = () => {
                if (GAME_FINISHED) return;

                const startColor = GAME[0][0];
                ++CLICK_COUNT;
                showClickCount();
                nextColor(0, 0, color, startColor, size);

                if (gameWon(color, size)) {
                    GAME_FINISHED = true;
                    table.className = 'won';
                    return;
                }

                if (CLICK_COUNT >= MAX_CLICKS) {
                    GAME_FINISHED = true;
                    table.className = 'lost';
                    return;
                }
            };
        }

        showClickCount();
        table.appendChild(tr);
        BOXES.push(boxRow);
        GAME.push(colorRow);
    }

    GAME_BOX.appendChild(table);
}

function showClickCount() {
    CLICK_INFO.textContent = `${CLICK_COUNT}/${MAX_CLICKS}`;
}

function nextColor(ix, iy, color, startColor, size) {
    if (color === startColor || GAME[ix][iy] !== startColor) return;

    GAME[ix][iy] = color;
    BOXES[ix][iy].className = color;

    if (ix - 1 >= 0) {
        nextColor(ix - 1, iy, color, startColor, size);
    }
    if (ix + 1 < size) {
        nextColor(ix + 1, iy, color, startColor, size);
    }
    if (iy - 1 >= 0) {
        nextColor(ix, iy - 1, color, startColor, size);
    }
    if (iy + 1 < size) {
        nextColor(ix, iy + 1, color, startColor, size);
    }
}

function gameWon(color, size) {
    for (let i = size - 1; i >= 0; --i) {
        for (let j = size - 1; j >= 0; --j) {
            if (GAME[i][j] !== color) return false;
        }
    }
    return true;
}

// Insert the copyright text
fetch('https://manusoman.github.io/MindLogs/settings.json')
.then(res => res.json())
.then(data => { COPYRIGHT.innerHTML = `Manu Soman © ${ data.current_year }` })
.catch(err => {
    COPYRIGHT.innerHTML = `Manu Soman © ${ new Date().getFullYear() }`;
    console.error(err);
});

})();
