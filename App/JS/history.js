const isGuest = localStorage.getItem("isGuest") === "true";

function getUserHistory() {
    const username = localStorage.getItem("username");
    if (!username) return [];

    const allHistories = JSON.parse(localStorage.getItem("allHistories") || "{}");
    return allHistories[username] || [];
}

function saveUserHistory(history) {
    const username = localStorage.getItem("username");
    if (!username) return;

    const allHistories = JSON.parse(localStorage.getItem("allHistories") || "{}");
    allHistories[username] = history;
    localStorage.setItem("allHistories", JSON.stringify(allHistories));
}

function saveGame() {
    if (!paused) return;

    const history = getUserHistory();
    history.push({
        game: currentGame,
        state: JSON.parse(JSON.stringify(gameState)),
        ant: { ...ant },
        antSteps
    });
    saveUserHistory(history);
    showToast("Game saved!");
    showHistory();
}

function capitalizeFirstLetter(string) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function showHistory() {
    const history = getUserHistory();
    const historyMenu = document.getElementById("historyMenu");
    const list = document.getElementById("historyList");
    list.innerHTML = "";

    history.forEach((entry, index) => {
        const li = document.createElement("li");
        li.classList.add("history-item");

        const gameText = document.createElement("span");
        gameText.textContent = `${capitalizeFirstLetter(entry.game)} #${index + 1}`;
        gameText.style.cursor = "pointer";
        gameText.onclick = () => loadGame(index);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteGame(index);
        };

        li.appendChild(gameText);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });

    historyMenu.classList.remove("hidden");
}

function deleteGame(index) {
    let history = getUserHistory();
    history.splice(index, 1);
    saveUserHistory(history);
    showToast("Saved game deleted.");
    showHistory();
}

function loadGame(index) {
    clearInterval(interval);
    const history = getUserHistory();
    const entry = history[index];
    currentGame = entry.game;
    gameState = JSON.parse(JSON.stringify(entry.state));
    if (entry.ant) ant = { ...entry.ant };
    antSteps = entry.antSteps || 0;
    paused = false;
    interval = setInterval(step, 100);
}

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
