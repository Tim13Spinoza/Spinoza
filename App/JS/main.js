const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const size = 60;
const cellSize = canvas.width / size;
let interval;
let paused = false;
let currentGame = null;
let gameState = [];
let ant = { x: Math.floor(size / 2), y: Math.floor(size / 2), dir: 0 };
let antSteps = 0;
let speed = 100;

function selectGame(game) {
    clearInterval(interval);

    speed = 100;

    currentGame = game;
    gameState = Array.from({ length: size }, () => Array(size).fill(0));
    antSteps = 0;

    if (game === 'ant') {
        ant = { x: Math.floor(size / 2), y: Math.floor(size / 2), dir: 0 };
    } else {
        initializeGame();
    }

    if (game === 'forest') {
        for (let i = 0; i < 10; i++) {
            const x = Math.floor(Math.random() * size);
            const y = Math.floor(Math.random() * size);
            gameState[x][y] = 2;
        }
    }
    paused = true;
    drawGrid();
    interval = setInterval(step, speed);

    document.getElementById("infoTitle").textContent = "";
    document.getElementById("infoText").textContent = "";
    document.getElementById("infoModal").classList.add("hidden");
    document.getElementById("overlay").classList.add("hidden");

    const pauseButton = document.getElementById("playBtn");
    if (pauseButton) pauseButton.textContent = "Play";
    updateStats();
}

function initializeGame() {
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            gameState[x][y] = Math.random() > 0.8 ? 1 : 0;
        }
    }
}

function step() {
    if (paused) return;
    if (currentGame === 'life') stepLife();
    else if (currentGame === 'brian') stepBrian();
    else if (currentGame === 'ant') stepAnt();
    else if (currentGame === 'forest') stepForest();
    drawGrid();
    updateStats();
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            let value = gameState[x][y];
            if (currentGame === 'life') ctx.fillStyle = value ? 'black' : 'white';
            else if (currentGame === 'brian') ctx.fillStyle = value === 1 ? 'blue' : value === 2 ? 'lightblue' : 'white';
            else if (currentGame === 'ant') ctx.fillStyle = value ? 'black' : 'white';
            else if (currentGame === 'forest') ctx.fillStyle = value === 1 ? 'green' : value === 2 ? 'red' : 'white';
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
    if (currentGame === 'ant') {
        ctx.fillStyle = 'red';
        ctx.fillRect(ant.x * cellSize, ant.y * cellSize, cellSize, cellSize);
    }
}

function countNeighbors(x, y) {
    let sum = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            let val = gameState[x + i]?.[y + j] || 0;
            if (currentGame === 'brian') val = val === 1 ? 1 : 0;
            if (currentGame === 'forest') val = val === 2 ? 1 : 0;
            sum += val;
        }
    }
    return sum;
}

function countSpecificNeighbors(x, y, target) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            if (gameState[x + i]?.[y + j] === target) count++;
        }
    }
    return count;
}

function updateStats() {
    const stats = document.getElementById("stats");
    let text = "";
    let alive = 0, firing = 0, refractory = 0, trees = 0, burning = 0, empty = 0;
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            const val = gameState[x][y];
            if (currentGame === 'life') alive += val === 1;
            if (currentGame === 'brian') {
                firing += val === 1;
                refractory += val === 2;
            }
            if (currentGame === 'forest') {
                trees += val === 1;
                burning += val === 2;
                empty += val === 0;
            }
        }
    }
    if (currentGame === 'life') text = `Alive cells: ${alive}`;
    else if (currentGame === 'brian') text = `Firing: ${firing}, Refractory: ${refractory}`;
    else if (currentGame === 'ant') text = `Ant position: (${ant.x}, ${ant.y}), Steps: ${antSteps}`;
    else if (currentGame === 'forest') text = `Trees: ${trees}, Burning: ${burning}, Empty: ${empty}`;

    const baseSpeed = 100;
    let speedMultiplier = baseSpeed / speed;
    let speedText = '';

    if (speedMultiplier === 1) {
        speedText = '1x';
    } else if (speedMultiplier > 1) {
        speedText = speedMultiplier.toFixed(1) + 'x';
    } else {
        speedText = '-' + (1 / speedMultiplier).toFixed(1) + 'x';
    }
    stats.textContent = text + ` | Speed: ${speedText}`;
}

function getGameTitle(key) {
    return {
        life: "Game of Life",
        brian: "Brian's Brain",
        ant: "Langton's Ant",
        forest: "Forest Fire Model"
    }[key] || "Unknown Game";
}

function showInfo() {
    const modal = document.getElementById("infoModal");
    const overlay = document.getElementById("overlay");
    const title = document.getElementById("infoTitle");
    const text = document.getElementById("infoText");

    if (!currentGame) {
        title.textContent = "No Game Selected";
        text.textContent = "Please choose a game first.";
    } else {
        const descriptions = {
            life: "Conway's Game of Life is a zero-player cellular automaton where cells live, die, or are born based on the number of live neighbors. Simple rules lead to surprisingly complex and often beautiful patterns, mimicking processes like growth, decay, and evolution.",

            brian: "Brian's Brain is a three-state cellular automaton in which cells cycle through 'on', 'dying', and 'off' states. Once activated, a cell fires, becomes refractory, and rests — creating continuously moving wave-like patterns that resemble neural activity or digital sparks.",

            ant: "Langton's Ant is a two-dimensional Turing machine that moves based on the color of the grid cell it’s on — turning right or left and flipping the color. Though based on simple rules, it produces chaotic paths that eventually lead to a predictable, repeating 'highway' structure.",

            forest: "The Forest Fire Model simulates the spread of wildfires in a grid-based forest. Trees grow over time, lightning strikes randomly, and fire spreads to adjacent trees, offering a dynamic visualization of natural cycles of growth, destruction, and regeneration."
        };

        title.textContent = getGameTitle(currentGame);
        text.textContent = descriptions[currentGame];
    }

    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
}

function checkLogin() {
    const username = localStorage.getItem("username");
    const isGuest = localStorage.getItem("isGuest") === "true";
    const isLoggedIn = !isGuest;

    if (!username) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("saveButton").style.display = isGuest ? "none" : "inline-block";
    document.getElementById("historyButton").style.display = isGuest ? "none" : "inline-block";
}

function logout() {
    localStorage.removeItem("username");
    localStorage.removeItem("isGuest");
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", checkLogin);

function closeInfo() {
    document.getElementById("infoModal").classList.add("hidden");
    document.getElementById("overlay").classList.add("hidden");
}

document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const isGuest = localStorage.getItem('isGuest');
    const loginButton = document.getElementById('loginButton');
    const userStatus = document.getElementById('userStatus');

    if (username) {
        userStatus.textContent = `Logged in as ${username}`;
        loginButton.textContent = 'Logout';
    } else if (isGuest === 'true') {
        userStatus.textContent = 'Guest mode';
        loginButton.textContent = 'Logout';
    } else {
        userStatus.textContent = '';
        loginButton.textContent = 'Login';
    }
});

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 300);
    }, duration);
}

function openSettings() {
    document.getElementById('settingsModal').classList.remove('hidden');
    document.getElementById('settingsOverlay').classList.remove('hidden');

    const savedFont = localStorage.getItem('settings_font');
    if (savedFont) {
        document.getElementById('fontSelect').value = savedFont;
    }
}

function closeSettings() {
    document.getElementById('settingsModal').classList.add('hidden');
    document.getElementById('settingsOverlay').classList.add('hidden');

    const savedFont = localStorage.getItem('settings_font');
    if (savedFont) {
        document.getElementById('fontSelect').value = savedFont;
    }
}

function saveSettings() {
    const username = localStorage.getItem('username');
    const isGuest = localStorage.getItem('isGuest') === 'true';

    const darkMode = document.getElementById('darkModeToggle').checked;
    const selectedFont = document.getElementById('fontSelect').value;
    const fontSizeMultiplier = parseFloat(document.getElementById('fontSizeSelect').value);
    const selectedLanguage = document.getElementById('languageSelect').value;

    if (username && !isGuest) {
        localStorage.setItem(`settings_darkMode_${username}`, darkMode);
        localStorage.setItem(`settings_font_${username}`, selectedFont);
        localStorage.setItem(`settings_fontSizeMultiplier_${username}`, fontSizeMultiplier);
        localStorage.setItem(`settings_language_${username}`, selectedLanguage);
    } else if (isGuest) {
        localStorage.setItem('settings_darkMode', darkMode);
        localStorage.setItem('settings_font', selectedFont);
        localStorage.setItem('settings_fontSizeMultiplier', fontSizeMultiplier);
        localStorage.setItem('settings_language', selectedLanguage);
    }
    if (darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    document.body.style.fontFamily = selectedFont;
    document.documentElement.style.fontSize = `${fontSizeMultiplier}em`;

    applyLanguage(selectedLanguage);

    closeSettings();
    showToast('Settings saved!');
}

document.addEventListener('DOMContentLoaded', () => {
    const darkModeSetting = localStorage.getItem('darkMode');
    const checkbox = document.getElementById('darkModeToggle');

    if (darkModeSetting === 'enabled') {
        document.body.classList.add('dark-mode');
        if (checkbox) checkbox.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        if (checkbox) checkbox.checked = false;
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const darkMode = localStorage.getItem('settings_darkMode') === 'true';
    const font = localStorage.getItem('settings_font');

    document.getElementById('darkModeToggle').checked = darkMode;
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }

    if (font) {
        document.getElementById('fontSelect').value = font;
        document.getElementById('settingsModal').style.fontFamily = font;
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const font = localStorage.getItem('settings_font');
    if (font) {
        document.body.style.fontFamily = font;
        document.getElementById('fontSelect').value = font;
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const isGuest = localStorage.getItem('isGuest') === 'true';

    if (isGuest) {
        const darkMode = localStorage.getItem('settings_darkMode') === 'false';
        const font = localStorage.getItem('settings_font');
        const fontSize = localStorage.getItem('settings_fontSizeMultiplier');

        if (darkMode) {
            document.body.classList.add('dark-mode');
            document.getElementById('darkModeToggle').checked = true;
        } else {
            document.body.classList.remove('dark-mode');
            document.getElementById('darkModeToggle').checked = false;
        }

        if (font) {
            document.body.style.fontFamily = font;
            document.getElementById('fontSelect').value = font;
        }

        if (fontSize) {
            document.documentElement.style.fontSize = `${fontSize}em`;
            const fontSizeSelect = document.getElementById('fontSizeSelect');
            if (fontSizeSelect) {
                fontSizeSelect.value = fontSize;
            }
        }
    } else if (username) {
        const darkMode = localStorage.getItem(`settings_darkMode_${username}`) === 'true';
        const font = localStorage.getItem(`settings_font_${username}`);

        if (darkMode) {
            document.body.classList.add('dark-mode');
            document.getElementById('darkModeToggle').checked = true;
        } else {
            document.body.classList.remove('dark-mode');
            document.getElementById('darkModeToggle').checked = false;
        }

        if (font) {
            document.body.style.fontFamily = font;
            document.getElementById('fontSelect').value = font;
        } else {
            document.body.style.fontFamily = "'Snowburst One', system-ui";
            document.getElementById('fontSelect').value = "'Snowburst One', system-ui, sans-serif";
        }
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const isGuest = localStorage.getItem('isGuest') === 'true';

    let fontSizeMultiplier = 1;

    if (!isGuest && username) {
        const savedMultiplier = localStorage.getItem(`settings_fontSizeMultiplier_${username}`);
        if (savedMultiplier) {
            fontSizeMultiplier = parseFloat(savedMultiplier);
        }
    }

    document.documentElement.style.fontSize = `${fontSizeMultiplier}em`;

    const fontSizeSelect = document.getElementById('fontSizeSelect');
    if (fontSizeSelect) {
        fontSizeSelect.value = fontSizeMultiplier;
    }
});


function resetButton() {
    clearInterval(interval);
    selectGame(currentGame);
}

function speedUpButton() {
    if (speed > 20) {
        speed -= 20;
        clearInterval(interval);
        interval = setInterval(step, speed);
    }
    updateStats();
}

function slowDownButton() {
    if (speed < 1000) {
        speed += 20;
        clearInterval(interval);
        interval = setInterval(step, speed);
    }
    updateStats();
}

function togglePause() {
    paused = !paused;
    const pauseButton = document.getElementById("playBtn");
    pauseButton.textContent = paused ? "Play" : "Pause";
    updateStats();
}

const translations = {
    en: {
        title: "Cellular Automata Games",
        login: "Login",
        logout: "Logout",
        settings: "Settings ⚙️",

        gameButtons: {
            life: "Game of Life",
            brian: "Brian's Brain",
            ant: "Langton's Ant",
            forest: "Forest Fire Model",
            save: "Save",
            history: "Show History",
            info: "ℹ️ Info"
        },

        controls: {
            slowDown: "Slow Down",
            pause: "Pause/Resume",
            reset: "Reset",
            speedUp: "Speed Up"
        },

        settingsHeader: "Settings",
        darkMode: "Enable Dark Mode",
        selectFont: "Select Font:",
        fontSizeMultiplier: "Font Size Multiplier:",
        languageSelect: "Language:",
        saveSettings: "Save Settings",
        close: "Close",
        settingsSaved: "Settings saved!",
        welcome: "Welcome, "
    },
    hr: {
        title: "Igre Ćelijskih Automata",
        login: "Prijava",
        logout: "Odjava",
        settings: "Postavke ⚙️",

        gameButtons: {
            life: "Igra života",
            brian: "Brianov mozak",
            ant: "Langtonov mrav",
            forest: "Model šumskog požara",
            save: "Spremi",
            history: "Prikaži povijest",
            info: "ℹ️ Info"
        },

        controls: {
            slowDown: "Uspori",
            pause: "Pauziraj/Nastavi",
            reset: "Resetiraj",
            speedUp: "Ubrzaj"
        },

        settingsHeader: "Postavke",
        darkMode: "Uključi tamni način",
        selectFont: "Odaberi font:",
        fontSizeMultiplier: "Veličina fonta:",
        languageSelect: "Jezik:",
        saveSettings: "Spremi postavke",
        close: "Zatvori",
        settingsSaved: "Postavke su spremljene!",
        welcome: "Dobrodošao, "
    }
};

function applyLanguage(lang) {
    const t = translations[lang];

    document.querySelector('h1').textContent = t.title;
    document.getElementById('loginButton').textContent = t.login;
    document.getElementById('logoutButton').textContent = t.logout;
    document.getElementById('settingsButton').textContent = t.settings;

    const controls = document.querySelector('.controls').children;
    controls[0].textContent = t.gameButtons.life;
    controls[1].textContent = t.gameButtons.brian;
    controls[2].textContent = t.gameButtons.ant;
    controls[3].textContent = t.gameButtons.forest;
    controls[4].textContent = t.gameButtons.save;
    controls[5].textContent = t.gameButtons.history;
    controls[6].textContent = t.gameButtons.info;

    const controlBtns = document.querySelector('.controlBtn').children;
    controlBtns[0].textContent = t.controls.slowDown;
    controlBtns[1].textContent = t.controls.pause;
    controlBtns[2].textContent = t.controls.reset;
    controlBtns[3].textContent = t.controls.speedUp;

    const settingsModal = document.getElementById('settingsModal');
    settingsModal.querySelector('h2').textContent = t.settingsHeader;
    settingsModal.querySelector('label[for="darkModeToggle"]').textContent = t.darkMode;
    settingsModal.querySelector('label[for="fontSelect"]').childNodes[0].textContent = t.selectFont;
    settingsModal.querySelector('label[for="fontSizeSelect"]').childNodes[0].textContent = t.fontSizeMultiplier;
    settingsModal.querySelector('label[for="languageSelect"]').childNodes[0].textContent = t.languageSelect;
    settingsModal.querySelector('button[onclick="saveSettings()"]').textContent = t.saveSettings;
}

window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    document.getElementById('languageSelect').value = savedLang;
    applyLanguage(savedLang);
});

window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.saveSettings = saveSettings;
