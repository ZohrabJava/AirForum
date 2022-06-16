jQuery(document).ready(function () {
    indexFunctions.events();
});

var borderColor = "#b3bac3";
var indexFunctions = {
    events: function () {
        var self = this;

        $(document).on("click", ".psy-popup-show-btn[data-popup-name='login']", function () {
            $(".psy-popup[data-popup='login']").show();
        });

        $(document).on("click", ".psy-popup-close-btn[data-popup-name='login']", function () {
            $(".psy-popup[data-popup='login']").hide();
        });

        $(document).on("click", ".psy-popup-show-btn[data-popup-name='registr']", function () {
            $(".psy-popup[data-popup='registr']").show();
        });

        $(document).on("click", ".psy-popup-close-btn[data-popup-name='registr']", function () {
            $(".psy-popup[data-popup='registr']").hide();
        });

        $("#form-login").on("submit", function (e) {
            e.preventDefault();
            const form = $(this);
            form.find("p[class='error']").text("");
            let username = form.find("input[name='username']");
            let password = form.find("input[name='password']");
            let isValid = true;

            const data = {
                username: username.val(),
                password: password.val()
            }

            if (data.username.length == 0) {
                username.css("border-color", "red");
                isValid = false;
            }
            else {
                username.css("border-color", borderColor);
            }

            if (data.password.length == 0) {
                password.css("border-color", "red");
                isValid = false;
            }
            else {
                password.css("border-color", borderColor);
            }

            if (!isValid) {
                return false;
            }

            form.find("button[type='submit']").prop("disabled", true);
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8082/login',
                data: JSON.stringify(data),
                contentType: 'application/json',
                headers: { "Authorization": "Basic token" },//put token
                success: function (resp) {

                    // resp = globalForTest;

                    if (resp) {
                        resp = JSON.parse(resp);
                        if (resp.errorText && resp.errorText.length > 0) {
                            form.find("p[class='error']").text(resp.errorText);
                        }
                        else {
                            $(".psy-popup[data-popup='login']").hide();
                            form.find("input[name='username']").val("");
                            form.find("input[name='password']").val("");
                            localStorage.setItem("userData", JSON.stringify(resp));

                            generalFunctions.isAuthorized(resp);

                        }
                    }
                    else {
                        form.find("p[class='error']").text("Something wrong");
                    }
                    form.find("button[type='submit']").prop("disabled", false);
                }
            });
        });

        $("#form-registr").on("submit", function (e) {
            e.preventDefault();
            const form = $(this);
            form.find("p[class='error']").text("");

            let firstName = form.find("input[name='firstName']");
            let lastName = form.find("input[name='lastName']");
            let email = form.find("input[name='email']");
            let userName = form.find("input[name='userName']");
            let password = form.find("input[name='password']");
            let isValid = true;

            const data = {
                firstName: firstName.val(),
                lastName: lastName.val(),
                email: email.val(),
                userName: userName.val(),
                password: password.val()
            }

            if (data.firstName.length == 0) {
                firstName.css("border-color", "red");
                isValid = false;
            }
            else {
                firstName.css("border-color", borderColor);
            }

            if (data.lastName.length == 0) {
                lastName.css("border-color", "red");
                isValid = false;
            }
            else {
                lastName.css("border-color", borderColor);
            }

            if (data.email.length == 0) {
                email.css("border-color", "red");
                isValid = false;
            }
            else {
                email.css("border-color", borderColor);
            }

            if (data.userName.length == 0) {
                userName.css("border-color", "red");
                isValid = false;
            }
            else {
                userName.css("border-color", borderColor);
            }

            if (data.password.length == 0) {
                password.css("border-color", "red");
                isValid = false;
            }
            else {
                password.css("border-color", borderColor);
            }

            if (!isValid) {
                return false;
            }

            form.find("button[type='submit']").prop("disabled", true);
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8082/creat',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (resp) {
                    console.log(resp);
                    //resp = globalForTest;

                    if (resp) {
                        resp = JSON.parse(resp);
                        if (resp.errorText && resp.errorText.length > 0) {
                            form.find("p[class='error']").text(resp.errorText);
                        }
                        else {
                            $(".psy-popup[data-popup='registr']").hide();
                            form.find("input[name='firstName']").val("");
                            form.find("input[name='lastName']").val("");
                            form.find("input[name='email']").val("");
                            form.find("input[name='userName']").val("");
                            form.find("input[name='password']").val("");
                            localStorage.setItem("userData", JSON.stringify(resp));
                            generalFunctions.isAuthorized(resp);
                        }
                    }
                    else {
                        form.find("p[class='error']").text("Something wrong");
                    }
                    form.find("button[type='submit']").prop("disabled", false);
                }
            });
        });
    }
};