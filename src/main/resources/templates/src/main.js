function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    createAccountForm.addEventListener("submit", e => {
        e.preventDefault();
        const firstName = document.querySelector("#signupFirstName")
        const lastName = document.querySelector("#signupLastName")
        const userName = document.querySelector("#signupUsername")
        const email = document.querySelector("#email")
        const password = document.querySelector("#password")
        // Perform your AJAX/Fetch login
        fetch('http://localhost:8082/forum/user', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*',
            },
            body: JSON.stringify({
                "firstName":firstName.value,
                "lastName":lastName.value,
                "userName":userName.value,
                "email":email.value,
                "password":password.value
            })
        }).then((data) => {
            console.log(data, 555)
            setFormMessage(loginForm, "error", "Invalid username/password combination");
        });
    });

    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        const userName = document.querySelector("#signupUsername")
        const password = document.querySelector("#password")
        // Perform your AJAX/Fetch login
        // fetch('http://localhost:8082/forum/user', {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'Access-Control-Allow-Origin':'*',
        //     },
        //     body: JSON.stringify({
        //         "userName":userName.value,
        //         "password":password.value
        //     })
        // }).then((data) => {
        //     console.log(data, 555)
        setFormMessage(loginForm, "error", "Invalid username/password combination");
    });

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 10) {
                setInputError(inputElement, "Username must be at least 10 characters in length");
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});