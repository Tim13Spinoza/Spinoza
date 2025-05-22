function handleLoginClick() {
    const username = localStorage.getItem('username');
    if (username) {
        localStorage.removeItem('username');
        localStorage.removeItem('isGuest');
        window.location.href = 'login.html';
    } else {
        window.location.href = 'login.html';
    }
}

function checkLogin() {
    const username = localStorage.getItem("username");
    const isGuest = localStorage.getItem("isGuest") === "true";
    const welcomeUser = document.getElementById("welcomeUser");
    const saveButton = document.getElementById("saveButton");
    const historyButton = document.getElementById("historyButton");
    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");
    const settingsButton = document.getElementById("settingsButton");

    if (username && !isGuest) {
        welcomeUser.textContent = `Logged in as: ${username}`;
        saveButton.style.display = "inline-block";
        historyButton.style.display = "inline-block";
        loginButton.style.display = "none";
        logoutButton.style.display = "inline-block";
        settingsButton.style.display = "inline-block";
    } else if (isGuest) {
        welcomeUser.textContent = "Guest Mode";
        saveButton.style.display = "none";
        historyButton.style.display = "none";
        loginButton.style.display = "inline-block";
        logoutButton.style.display = "none";
    } else {
        welcomeUser.textContent = "";
        saveButton.style.display = "none";
        historyButton.style.display = "none";
        loginButton.style.display = "inline-block";
        logoutButton.style.display = "none";
        settingsButton.style.display = "none";
    }
}

function logout() {
    localStorage.removeItem("username");
    localStorage.removeItem("isGuest");
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", checkLogin);

document.addEventListener('DOMContentLoaded', () => {
    checkLogin();
});
