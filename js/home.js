var URL = "http://localhost:5000/api"

const form = document.getElementById('registrationForm');
const message = document.getElementById('message');

const validateForm = (data) => {
    const { first_name, last_name, email, password, phone_number, address } = data;

    if (!first_name || !last_name || !email || !password || !phone_number || !address) {
        return "All fields are required.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRegex.test(email)) {
        return "Please enter a valid email address.";
    }

    if (!/^\d+$/.test(phone_number)) {
        return "Phone number must be numeric only.";
    }

    if (phone_number.length !== 10) {
        return "Phone number must be exactly 10 digits.";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return "Password must be at least 8 characters long and include 1 uppercase letter, 1 number, and 1 special character.";
    }

    return null; // no error
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        phone_number: document.getElementById('phone_number').value,
        address: document.getElementById('address').value
    };

    const error = validateForm(data);
    if (error) {

        alert(error);
        return;
    }

    try {
        const res = await fetch(URL + '/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok) {
            alert('User registered successfully!');
            form.reset();
            localStorage.setItem('AuthToken', result.token);
            window.location.href = './dashboard.html';
        } else {
            alert('Registration failed, ' + result.message);
        }
    } catch (err) {
        console.error(err);
        alert('Error connecting to server.');
    }
});

const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

const validateLogin = ({ email, password }) => {
    if (!email || !password) return "Both email and password are required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address.";
    return null;
};

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value
    };

    const error = validateLogin(data);
    if (error) {
        loginMessage.style.color = 'red';
        loginMessage.textContent = error;
        return;
    }

    try {
        const res = await fetch(URL + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok) {
            localStorage.setItem('AuthToken', result.token);
            window.location.href = './dashboard.html';
        } else {
            loginMessage.style.color = 'red';
            loginMessage.textContent = result.message || 'Login failed.';
        }
    } catch (err) {
        console.error(err);
        loginMessage.style.color = 'red';
        loginMessage.textContent = 'Error connecting to server.';
    }
});