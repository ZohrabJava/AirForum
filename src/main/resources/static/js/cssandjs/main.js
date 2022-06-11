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

function redirectSuccess() {
    window.location.href = "http://localhost:8082/forum/user/success";
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
    // const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");
// if(document) {
//     document.querySelector("#linkCreateAccount").addEventListener("click", e => {
//         e.preventDefault();
//         // loginForm.classList.add("form--hidden");
//         createAccountForm.classList.remove("form--hidden");
//     });
// }

    // document.querySelector("#linkLogin").addEventListener("click", e => {
    //     e.preventDefault();
    //     // loginForm.classList.remove("form--hidden");
    //     createAccountForm.classList.add("form--hidden");
    // });

    createAccountForm.addEventListener("submit", e => {
        e.preventDefault();

        // Perform your AJAX/Fetch login
        if (validateForm()) {
            const firstName = document.querySelector("#signupFirstName")
            const lastName = document.querySelector("#signupLastName")
            const userName = document.querySelector("#signupUsername")
            const email = document.querySelector("#email")
            const password = document.querySelector("#password")
            redirectSuccess()
            fetch('http://localhost:8082/forum/user/creat', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    "firstName": firstName.value,
                    "lastName": lastName.value,
                    "userName": userName.value,
                    "email": email.value,
                    "password": password.value
                })
            }).then((data) => {
                console.log(data, 555)
                // setFormMessage(loginForm, "error", "Invalid username/password combination");
            });
        } else {
            console.log(100)
        }
    });

    // loginForm.addEventListener("submit", e => {
    //     e.preventDefault();
    //     const userName = document.querySelector("#signupUsername")
    //     const password = document.querySelector("#password")
    //     // Perform your AJAX/Fetch login
    //     // fetch('http://localhost:8082/forum/user', {
    //     //     method: 'POST',
    //     //     headers: {
    //     //         'Accept': 'application/json',
    //     //         'Content-Type': 'application/json',
    //     //         'Access-Control-Allow-Origin':'*',
    //     //     },
    //     //     body: JSON.stringify({
    //     //         "userName":userName.value,
    //     //         "password":password.value
    //     //     })
    //     // }).then((data) => {
    //     //     console.log(data, 555)
    //     setFormMessage(loginForm, "error", "Invalid username/password combination");
    // });

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signupFirstName" && ((e.target.value.length < 2 || e.target.value.length > 12 || ContainSpace(e.target.value)) ||
                ContainNumber(e.target.value))) {
                setInputError(inputElement, "First name must contain between 2 and 12 letters without number and space");
            }
            if (e.target.id === "signupLastName" && ((e.target.value.length < 2 || e.target.value.length > 12 || ContainSpace(e.target.value)) ||
                ContainNumber(e.target.value))) {
                setInputError(inputElement, "Last name must contain between 2 and 12 letters without number and space");
            }
            if (e.target.id === "signupUsername" && (e.target.value.length < 6 || e.target.value.length > 12 || ContainSpace(e.target.value))) {
                setInputError(inputElement, "Username must contain between 6 and 12 letters and numbers without space");
            }
            if (e.target.id === "email" && !validateEmail(e.target.value)) {
                setInputError(inputElement, "Email is not valid");
            }
            if (e.target.id === "password" && (e.target.value.length < 6 || e.target.value.length > 12)) {
                setInputError(inputElement, "Password must contain between 6 and 12 letters or numbers");
            }
            if (e.target.id === "passwordConfirm" && !PasswordConfirm(e.target.value)) {
                setInputError(inputElement, "Password don't match");
            }
        });


        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });

});

function validateForm() {
    let firstName = document.querySelector("#signupFirstName").value
    let lastName = document.querySelector("#signupLastName").value
    let userName = document.querySelector("#signupUsername").value
    let email = document.querySelector("#email").value
    let password = document.querySelector("#password").value
    let passwordConfirm = document.querySelector("#passwordConfirm").value
    if (firstName.length < 2 || firstName.length > 12 || ContainSpace(firstName) || ContainNumber(firstName)) {
        return false
    }
    if (lastName.length < 2 || lastName.length > 12 || ContainSpace(lastName) || ContainNumber(lastName)) {
        return false
    }
    if (userName.length < 6 || userName.length > 12 || ContainSpace(userName)) {
        return false
    }
    if (!validateEmail(email)) {
        return false
    }
    if (password.length < 6 || password.length > 12) {
        return false
    }
    if ( !PasswordConfirm(passwordConfirm)) {
        return false
    }
    return true;
}


const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

function ContainNumber(text) {
    for (let i = 0; i < text.length; i++) {
        if (text.charAt(i) >= '0' && text.charAt(i) <= '9') {
            return true
        }
    }
    return false
}

function PasswordConfirm(passwordConfirm) {
    let password = document.querySelector("#password").value
    if (password === passwordConfirm) {
        return true
    }
    return false
}

function ContainSpace(text) {
    for (let i = 0; i < text.length; i++) {
        if (text.charAt(i) === ' ') {
            return true
        }
    }
    return false
}
