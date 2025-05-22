function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;

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

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!username || !password) {
        showToast("Please fill in all fields.");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(user =>
        user.username === username && user.password === password
    );

    if (!foundUser) {
        showToast("Incorrect username or password.");
        return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("isGuest", "false");
    window.location.href = "index.html";
}

function register() {
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();

    if (!username || !email || !password) {
        showToast("Please fill in all fields.");
        return;
    }

    if (!validateEmail(email)) {
        showToast("Invalid email format.");
        return;
    }

    if (password.length < 6) {
        showToast("Password must be at least 6 characters.");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some(user => user.username === username || user.email === email);
    if (userExists) {
        showToast("Username or email already exists.");
        return;
    }

    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    showToast("Registration successful. Please log in.");

    toggleForm("login");

    document.getElementById('registerUsername').value = "";
    document.getElementById('registerEmail').value = "";
    document.getElementById('registerPassword').value = "";
}

function continueAsGuest() {
    localStorage.setItem("username", "guest");
    localStorage.setItem("isGuest", "true");
    window.location.href = "index.html";
}

function toggleForm(view) {
    const loginBlock = document.getElementById("loginBlock");
    const registerBlock = document.getElementById("registerBlock");

    if (view === "register") {
        loginBlock.classList.add("hidden");
        registerBlock.classList.remove("hidden");
    } else {
        registerBlock.classList.add("hidden");
        loginBlock.classList.remove("hidden");
    }
}
