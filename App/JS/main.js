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

function selectGame(game) {
  clearInterval(interval);
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
  paused = false;
  interval = setInterval(step, 100);

  document.getElementById("infoTitle").textContent = "";
  document.getElementById("infoText").textContent = "";
  document.getElementById("infoModal").classList.add("hidden");
  document.getElementById("overlay").classList.add("hidden");
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

function togglePause() {
  paused = !paused;
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
  stats.textContent = text;
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

  if (!isGuest && username) {
    localStorage.setItem(`settings_darkMode_${username}`, darkMode);
    localStorage.setItem(`settings_font_${username}`, selectedFont);
  }

  if (darkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  document.body.style.fontFamily = selectedFont;

  showToast('Settings saved!');
  closeSettings();
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
    document.body.classList.remove('dark-mode');
    document.body.style.fontFamily = "'Snowburst One', system-ui";
    document.getElementById('darkModeToggle').checked = false;
    document.getElementById('fontSelect').value = "'Snowburst One', system-ui, sans-serif";
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

window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.saveSettings = saveSettings;
