jQuery(document).ready(function () {
    indexFunctions.init();
    indexFunctions.events();
    console.log(document.documentElement.lang);
});
var domainName = "localhost";
// var domainName = "10.5.113.18";
var borderColor = "#b3bac3";
var indexFunctions = {
    events: function () {
        var self = this;

        let data = localStorage.getItem("userData");
        if (data) {
            const json = JSON.parse(data);
            const token = localStorage.getItem("token");
            try {
                $.ajax({
                    type: 'GET',
                    url: 'http://' + domainName + ':8089/userById/' + json.userId,
                    contentType: 'application/json',
                    headers: {"Authorization": "Bearer " + token},
                    success: function (resp) {
                        if (resp) {
                            data = resp;
                            localStorage.setItem("userData", JSON.stringify(resp));
                        } else {
                            data = null;
                        }
                        self.isAuthorized(data);
                    }
                });

            } catch (error) {
                self.logOut();
            }
        }

        $(document).on("click", ".header-logout", function () {
            self.logOut(true);
        });

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

        $(document).on("click", ".psy-popup-show-btn[data-popup-name='postdescription']", function () {
            $(".psy-popup[data-popup='postdescription']").show();
        });

        $(document).on("click", ".psy-popup-close-btn[data-popup-name='postdescription']", function () {
            $(".psy-popup[data-popup='postdescription']").hide();
        });

        $(document).on("click", ".psy-popup-show-btn[data-popup-name='createpost']", function () {
            const token = localStorage.getItem("token");
            $.ajax({
                type: 'GET',
                url: 'http://' + domainName + ':8089/allCategory',
                contentType: 'application/json',
                headers: {"Authorization": "Bearer " + token},
                success: function (resp) {
                    if (resp) {
                        $(".cat-option").html('');
                        resp.forEach(obj => {
                            $(".cat-option").append(new Option(
                                document.documentElement.lang == "hy" ? obj.postCategoryTypeHy :
                                    document.documentElement.lang == "ru" ? obj.postCategoryTypeRu :
                                        obj.postCategoryType, obj.id));
                        });
                    }
                }
            });
            $(".psy-popup[data-popup='createpost']").show();
        });

        $(document).on("click", ".psy-popup-close-btn[data-popup-name='createpost']", function () {
            $(".psy-popup[data-popup='createpost']").hide();
        });

        $(document).on("click", ".psy-popup-show-btn[data-popup-name='createcategories']", function () {
            $(".psy-popup[data-popup='createcategories']").show();
        });

        $(document).on("click", ".psy-popup-close-btn[data-popup-name='createcategories']", function () {
            $(".psy-popup[data-popup='createcategories']").hide();
        });

        $(document).on("click", ".psy-popup-close-btn[data-popup-name='forgotpass']", function () {
            window.location.href = "index";
        });
        $(document).on("click", ".psy-popup-close-btn[data-popup-name='forgotSuccess']", function () {
            window.location.href = "index";
        });

        $(document).on("click", ".psy-popup-close-btn[data-popup-name='registerSuccess']", function () {
            window.location.href = "index";
        });

        // $(document).on("click", ".psy-popup-close-btn[data-popup-name='changepassword']", function () {
        //     window.location.href = "index";
        // });

        $(document).on("click", ".psy-popup-close-btn[data-popup-name='succesConfirmation']", function () {
            window.location.href = "index";
        });

        $(document).on("click", ".psy-popup-close-btn[data-popup-name='failedConfirmation']", function () {
            window.location.href = "index";
        });

        $("#form-login").on("submit", function (e) {
            e.preventDefault();
            const form = $(this);
            form.find("p[class='error']").text("");
            let username = form.find("input[name='username']");
            let password = form.find("input[name='password']");
            let isValid = true;

            const data = {
                userName: username.val(),
                password: password.val()
            }

            if (data.userName.length == 0) {
                username.css("border-color", "red");
                isValid = false;
            } else {
                username.css("border-color", borderColor);
            }

            if (data.password.length == 0) {
                password.css("border-color", "red");
                isValid = false;
            } else {
                password.css("border-color", borderColor);
            }

            if (!isValid) {
                return false;
            }

            form.find("button[type='submit']").prop("disabled", true);
            try {
                $.ajax({
                    type: 'POST',
                    url: 'http://' + domainName + ':8089/login',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    error: function (xhr) {
                        if (xhr.status == 401) {
                            form.find("p[class='error']").text("Bad username or password");
                            form.find("button[type='submit']").prop("disabled", false);
                        }
                    },
                    success: function (resp) {
                        if (resp) {
                            $(".psy-popup[data-popup='login']").hide();
                            form.find("input[name='username']").val("");
                            form.find("input[name='password']").val("");
                            localStorage.setItem("token", resp.access_token);
                            localStorage.setItem("username", resp.userName);

                            try {
                                $.ajax({
                                    type: 'GET',
                                    url: 'http://' + domainName + ':8089/user/' + resp.userName,
                                    contentType: 'application/json',
                                    headers: {"Authorization": "Bearer " + resp.access_token},
                                    error: function (xhr) {

                                    },
                                    success: function (resp) {
                                        localStorage.setItem("userData", JSON.stringify(resp));
                                        logeden = true;
                                        window.location.href = "index";
                                    }
                                });
                            } catch (error) {

                            }
                        } else {
                            form.find("p[class='error']").text("Something wrong");
                        }
                        form.find("button[type='submit']").prop("disabled", false);
                    }
                });
            } catch (error) {
                form.find("button[type='submit']").prop("disabled", false);
            }
        });
        $("#form-registr").on("submit", function (e) {
            e.preventDefault();
            const form = $(this);
            const waitingPanel = document.getElementById('waiting-panel');
            waitingPanel.style.visibility = 'visible';

            let firstName = form.find("input[name='firstName']");
            let lastName = form.find("input[name='lastName']");
            let email = form.find("input[name='email']");
            let userName = form.find("input[name='userName']");
            let password = form.find("input[name='password']");
            let confirmPassword = form.find("input[name='confirmPassword']");
            let isValid = true;

            const data = {
                firstName: firstName.val(),
                lastName: lastName.val(),
                email: email.val(),
                userName: userName.val(),
                password: password.val(),
                confirmPassword: confirmPassword.val(),
                lang: document.documentElement.lang.toString()
            }

            if (data.firstName.length == 0) {
                firstName.css("border-color", "red");
                isValid = false;
            } else {
                firstName.css("border-color", borderColor);
            }

            if (data.lastName.length == 0) {
                lastName.css("border-color", "red");
                isValid = false;
            } else {
                lastName.css("border-color", borderColor);
            }

            if (data.email.length == 0) {
                email.css("border-color", "red");
                isValid = false;
            } else {
                email.css("border-color", borderColor);
            }

            if (data.userName.length == 0) {
                userName.css("border-color", "red");
                isValid = false;
            } else {
                userName.css("border-color", borderColor);
            }

            if (data.password.length == 0) {
                password.css("border-color", "red");
                isValid = false;
            } else {
                password.css("border-color", borderColor);
            }

            if (data.confirmPassword.length == 0) {
                confirmPassword.css("border-color", "red");
                isValid = false;
            } else {
                confirmPassword.css("border-color", borderColor);
            }

            if (data.password !== data.confirmPassword) {
                $(".errorMessage").removeClass("hide");
                isValid = false;
            } else {
                $(".errorMessage").addClass("hide");
            }

            if (!isValid) {
                waitingPanel.style.visibility = 'hidden';
                return false;
            }

            form.find("button[type='submit']").prop("disabled", true);
            $.ajax({
                type: 'POST',
                url: 'http://' + domainName + ':8089/creat',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (resp) {
                    if (resp) {
                        if (resp.errorText && resp.errorText.length > 0) {
                            if (resp.errorText.includes("badFirstName")) {
                                $(".first-name-error").removeClass("hide");
                            } else {
                                $(".first-name-error").addClass("hide");
                            }
                            if (resp.errorText.includes("badLastName")) {
                                $(".last-name-error").removeClass("hide");
                            } else {
                                $(".last-name-error").addClass("hide");
                            }
                            if (resp.errorText.includes("badMail")) {
                                $(".email-error").removeClass("hide");
                            } else {
                                $(".email-error").addClass("hide");
                            }
                            if (resp.errorText.includes("badUsername")) {
                                $(".username-error").removeClass("hide");
                            } else {
                                $(".username-error").addClass("hide");
                            }
                            if (resp.errorText.includes("badPassword")) {
                                $(".password-error").removeClass("hide");
                            } else {
                                $(".password-error").addClass("hide");
                            }
                            if (resp.errorText.includes("emailUsed")) {
                                $(".email-error-exist").removeClass("hide");
                            } else {
                                $(".email-error-exist").addClass("hide");
                            }
                            if (resp.errorText.includes("usernameUsed")) {
                                $(".username-error-exist").removeClass("hide");
                            } else {
                                $(".username-error-exist").addClass("hide");
                            }
                        } else {
                            $(".email-error-exist").addClass("hide");
                            $(".username-error-exist").addClass("hide");
                            $(".first-name-error").addClass("hide");
                            $(".last-name-error").addClass("hide");
                            $(".email-error").addClass("hide");
                            $(".username-error").addClass("hide");
                            $(".password-error").addClass("hide");
                            $(".errorMessage").addClass("hide");
                            $(".psy-popup[data-popup='registr']").hide();
                            form.find("input[name='firstName']").val("");
                            form.find("input[name='lastName']").val("");
                            form.find("input[name='email']").val("");
                            form.find("input[name='userName']").val("");
                            form.find("input[name='password']").val("");
                            $(".psy-popup[data-popup='registerSuccess']").show();
                        }
                    } else {
                        form.find("p[class='error']").text("Something wrong");
                    }
                    form.find("button[type='submit']").prop("disabled", false);
                    waitingPanel.style.visibility = 'hidden';
                }
            });

        });
        $("#form-createpost").on("submit", async function (e) {
            e.preventDefault();

            let userData = localStorage.getItem("userData");
            const token = localStorage.getItem("token");
            if (userData) {
                const json = JSON.parse(userData);
                const form = $(this);
                form.find("p[class='error']").text("");

                let category = form.find("select[name='category']");
                let title = form.find("input[name='title']");
                let description = form.find("textarea[name='description']");
                let isValid = true;
                let base64 = "";

                if (document.getElementById("imagepath").files) {
                    const file = document.getElementById("imagepath").files[0];
                    base64 = await self.getFileBase64(file);
                }

                const data = {
                    categoryId: parseInt(category.val()),
                    title: title.val(),
                    descriptionPath: description.val(),
                    userName: json.userName,
                    imagePath: (base64 ? base64 : "")
                }

                if (data.title.length == 0) {
                    title.css("border-color", "red");
                    isValid = false;
                } else {
                    title.css("border-color", borderColor);
                }

                if (data.descriptionPath.length == 0) {
                    description.css("border-color", "red");
                    isValid = false;
                } else {
                    description.css("border-color", borderColor);
                }

                if (!isValid) {
                    return false;
                }

                form.find("button[type='submit']").prop("disabled", true);
                $.ajax({
                    type: 'POST',
                    url: 'http://' + domainName + ':8089/post',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    headers: {"Authorization": "Bearer " + token},
                    success: function (resp) {
                        if (resp) {
                            if (resp.errorText && resp.errorText.length > 0) {
                                form.find("p[class='error']").text(resp.errorText);
                            } else {
                                $(".psy-popup[data-popup='createpost']").hide();
                                form.find("input[name='title']").val("");
                                form.find("input[name='description']").val("");

                                let category = document.documentElement.lang == "hy" ? resp.category[1] :
                                    document.documentElement.lang == "ru" ? resp.category[2] :
                                        resp.category[0];

                                let html = '<div class="row" data-id="' + resp.postId + '">' +
                                    '<div class="td ds-cat" style="width:335px;">' + category + '</div>' +
                                    '<div class="td ds-title" style="width:335px;">' + resp.title + '</div>' +
                                    '<div class="td" style="width:335px;">' + self.getDateByFormat(resp.localDateTime, ".") + '</div>' +
                                    '<div class="td ds-status" style="width:335px;">' + resp.status + '</div>' +
                                    '<div class="td navigation" style="width:30px;">' + self.getCursoreImage(resp.status, resp.postId) + '</div>' +
                                    '<input type="hidden" class="pst-desc" value="' + resp.descriptionPath + '" />' +
                                    '<input type="hidden" class="pst-img" value="' + resp.imagePath + '" />' +
                                    '</div>';
                                $(".row-data").append(html);
                            }
                        } else {
                            form.find("p[class='error']").text("Something wrong");
                        }
                        form.find("button[type='submit']").prop("disabled", false);
                    }
                });
            }
        });
        $("#form-userprofile").on("submit", async function (e) {
            e.preventDefault();

            let userData = localStorage.getItem("userData");
            const token = localStorage.getItem("token");
            if (userData) {
                const json = JSON.parse(userData);
                const form = $(this);
                form.find("p[class='error']").text("");

                let base64 = "";
                if (document.getElementById("imagepath").files) {
                    const file = document.getElementById("imagepath").files[0];
                    base64 = await self.getFileBase64(file);
                }

                const data = {
                    userName: json.userName,
                    imagePath: (base64 ? base64 : "")
                }
                $.ajax({
                    type: 'POST',
                    url: 'http://' + domainName + ':8089/upload',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    headers: {"Authorization": "Bearer " + token},
                    success: function (resp) {
                        if (resp) {
                            console.log(resp)
                            localStorage.setItem("userData", JSON.stringify(resp));
                            document.getElementById("userImg").src = data.imagePath;
                            document.getElementById("userBigImg").src = data.imagePath;
                            form.find("p[class='error']").text("okayyyyyyyyyyyyyyyyyy");
                        } else {
                            //error
                        }
                    }
                });
            }
        });
        $("#form-createcategories").on("submit", function (e) {
            e.preventDefault();
            const form = $(this);
            form.find("p[class='error']").text("");

            let category = form.find("input[name='category']");
            let categoryHy = form.find("input[name='category_hy']");
            let categoryRu = form.find("input[name='category_ru']");
            let isValid = true;

            const data = {
                postCategoryType: category.val(),
                postCategoryTypeHy: categoryHy.val(),
                postCategoryTypeRu: categoryRu.val()
            }

            if (data.postCategoryType.length == 0) {
                category.css("border-color", "red");
                isValid = false;
            } else {
                category.css("border-color", borderColor);
            }
            if (data.postCategoryTypeHy.length == 0) {
                categoryHy.css("border-color", "red");
                isValid = false;
            } else {
                categoryHy.css("border-color", borderColor);
            }
            if (data.postCategoryTypeRu.length == 0) {
                categoryRu.css("border-color", "red");
                isValid = false;
            } else {
                categoryRu.css("border-color", borderColor);
            }

            if (!isValid) {
                return false;
            }

            form.find("button[type='submit']").prop("disabled", true);
            const token = localStorage.getItem("token");
            $.ajax({
                type: 'POST',
                url: 'http://' + domainName + ':8089/category',
                data: JSON.stringify(data),
                contentType: 'application/json',
                headers: {"Authorization": "Bearer " + token},
                success: function (resp) {
                    if (resp) {
                        if (resp.errorText && resp.errorText.length > 0) {
                            form.find("p[class='error']").text(resp.errorText);
                        } else {
                            $(".psy-popup[data-popup='createcategories']").hide();
                            let categorys = document.documentElement.lang == "hy" ? resp.postCategoryTypeHy :
                                document.documentElement.lang == "ru" ? resp.postCategoryTypeRu :
                                    resp.postCategoryType;
                            let html = '<div class="row" data-id="' + resp.id + '">' +
                                '<div class="td" style="width:1340px">' + categorys + '</div>' +
                                '</div>';
                            $(".row-data").append(html);
                            category.val("");
                            categoryHy.val("");
                            categoryRu.val("");
                        }
                    } else {
                        form.find("p[class='error']").text("Something wrong");
                    }
                    form.find("button[type='submit']").prop("disabled", false);
                }
            });
        });
        $("#form-forgotpass").on("submit", function (e) {
            e.preventDefault();
            const form = $(this);

            let email = form.find("input[name='email']");
            let isValid = true;
            const waitingPanel = document.getElementById('waiting-panel');
            waitingPanel.style.visibility = 'visible';

            const data = {
                email: email.val(),
                lang: document.documentElement.lang.toString()
            }

            if (data.email.length == 0) {
                email.css("border-color", "red");
                isValid = false;
            } else {
                email.css("border-color", borderColor);
            }

            if (!isValid) {
                waitingPanel.style.visibility = 'hidden';
                return false;
            }
            form.find("button[type='submit']").prop("disabled", true);
            $.ajax({
                type: 'POST',
                url: 'http://' + domainName + ':8089/resetPassword',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (resp) {
                    if (resp) {
                        if (resp.errorText && resp.errorText.length > 0) {
                            if (resp.errorText.includes("notFound")) {
                                $(".error").removeClass("hide");
                            }
                        } else {
                            $(".username-error-exist").addClass("hide");
                            $(".psy-popup[data-popup='forgotpass']").hide();
                            $(".psy-popup[data-popup='forgotSuccess']").show();
                        }
                    }
                    form.find("button[type='submit']").prop("disabled", false);
                    waitingPanel.style.visibility = 'hidden';
                }
            });
        });
        $("#form-changepassword").on("submit", function (e) {
            e.preventDefault();
            const form = $(this);
            form.find("p[class='error']").text("");
            let password = form.find("input[name='password']");
            let confirmpassword = form.find("input[name='confirmpassword']");
            let isValid = true;

            const data = {
                password: password.val(),
                confirmpassword: confirmpassword.val(),
                token: self.getRequestParam("token")
            }

            if (data.password.length == 0) {
                password.css("border-color", "red");
                isValid = false;
            } else {
                password.css("border-color", borderColor);
            }

            if (data.confirmpassword.length == 0) {
                confirmpassword.css("border-color", "red");
                isValid = false;
            } else {
                confirmpassword.css("border-color", borderColor);
            }

            if (data.password != data.confirmpassword) {
                $(".not-matches").removeClass("hide");
                isValid = false;
            } else {
                $(".not-matches").addClass("hide");
            }

            if (!isValid) {
                return false;
            }
            form.find("button[type='submit']").prop("disabled", true);
            $.ajax({
                type: 'POST',
                url: 'http://' + domainName + ':8089/updatePassword',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (resp) {
                    if (resp) {
                        if (resp.errorText && resp.errorText.length > 0) {
                            if (resp.errorText.includes("badPassword")) {
                                $(".not-matches-be").removeClass("hide");
                            }
                        } else {
                            $(".not-matches-be").addClass("hide");
                            window.location.href = "index";
                        }
                    }
                    form.find("button[type='submit']").prop("disabled", false);
                }
            });
        });
        $("#form-changeUserPassword").on("submit", function (e) {
            e.preventDefault();
            let userData = localStorage.getItem("userData");
            const token = localStorage.getItem("token");

            const form = $(this);
            let password = form.find("input[name='password']");
            let confirmpassword = form.find("input[name='confirmpassword']");
            let isValid = true;
            if (userData) {
                const json = JSON.parse(userData);
                const data = {
                    password: password.val(),
                    confirmPassword: confirmpassword.val(),
                    userName: json.userName
                }

                if (data.password.length == 0) {
                    password.css("border-color", "red");
                    isValid = false;
                } else {
                    password.css("border-color", borderColor);
                }

                if (data.confirmPassword.length == 0) {
                    confirmpassword.css("border-color", "red");
                    isValid = false;
                } else {
                    confirmpassword.css("border-color", borderColor);
                }


                if (!isValid) {
                    return false;
                }
                form.find("button[type='submit']").prop("disabled", true);
                $.ajax({
                    type: 'POST',
                    url: 'http://' + domainName + ':8089/changePassword',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    headers: {"Authorization": "Bearer " + token},
                    success: function (resp) {
                        if (resp) {
                            if (resp.errorText && resp.errorText.length > 0) {
                                if (resp.errorText.includes("Wrong old password")) {
                                    $(".info").addClass("hide");
                                    $(".error-message").removeClass("hide");
                                } else {
                                    $(".error-message").addClass("hide");
                                }
                                if (resp.errorText.includes("badPassword")) {
                                    $(".error-password").removeClass("hide");
                                } else {
                                    $(".error-password").addClass("hide");
                                }
                            } else {
                                $(".error-message").addClass("hide");
                                $(".error-password").addClass("hide");
                                $(".info").removeClass("hide");
                            }
                            form.find("input[name='password']").val("");
                            form.find("input[name='confirmpassword']").val("");
                        }
                        form.find("button[type='submit']").prop("disabled", false);
                    }
                });
            }
        });
        //click on row
        $(document).on("click", ".row", function () {
            let row = $(this);

            $(".row-hover").removeClass("row-hover");
            row.addClass("row-hover");
            $(".bt-actions").removeClass("hide");

            let id = row.attr("data-id");
            $(".row-id").val(id);
            var uri = window.location.href;
            if (uri.indexOf("/admins") > 0 || uri.indexOf("/users") > 0) {
                var state = row.find(".user-state").html();
                $(".remove-admin-user").removeClass("hide");
                if (state == "Active" || state == "Ակտիվ" || state == "Активный") {
                    $(".block-admin-user").removeClass("hide");
                    $(".unblock-admin-user").addClass("hide");
                } else {
                    $(".block-admin-user").addClass("hide");
                    $(".unblock-admin-user").removeClass("hide");
                }
            } else if (uri.indexOf("/postsforapproval") > 0) {
                $(".approve-forum").removeClass("hide");
                $(".block-forum").removeClass("hide");
                $(".descr-forum").removeClass("hide");
                var desc = row.find(".pst-desc").val();
                var cat = row.find(".ds-cat").text();
                var title = row.find(".ds-title").text();
                var img = row.find(".pst-img").val();
                $(".psy-popup-cat").text(cat);
                $(".psy-popup-title").text(title);
                $(".post-descr").text(desc);
                if (img) {
                    $(".post-img").removeClass("hide");
                    $(".post-img").attr("src", img);
                } else {
                    $(".post-img").addClass("hide");
                }
            } else if (uri.indexOf("/myposts") > 0) {
                $(".descr-forum").removeClass("hide");
                $(".approve-forum").addClass("hide");
                $(".block-forum").addClass("hide");
                $(".privet-forum").addClass("hide");

                var desc = row.find(".pst-desc").val();
                var cat = row.find(".ds-cat").text();
                var title = row.find(".ds-title").text();
                var img = row.find(".pst-img").val();
                $(".psy-popup-cat").text(cat);
                $(".popup-title").text(title);
                $(".post-descr").text(desc);
                if (img) {
                    $(".post-img").removeClass("hide");
                    $(".post-img").attr("src", img);
                } else {
                    $(".post-img").addClass("hide");
                }

                var status = row.find(".ds-status").text();
                if (status == "Created" || status == "Ստեղծված" || status == "Создано") {
                    $(".block-forum").removeClass("hide");
                    $(".privet-forum").removeClass("hide");
                } else if (status == "Private" || status == "Անձնական" || status == "Частный") {
                    $(".approve-forum").removeClass("hide");
                }
            } else if (uri.indexOf("/user/details") > 0) {

            }
        });

        //to admin
        $(document).on("click", ".add-admin-user", function () {
            let btn = $(this);
            let rowId = $(".row-id").val();
            let userData = localStorage.getItem("userData");
            const token = localStorage.getItem("token");

            if (userData && parseInt(rowId) > 0) {
                const json = JSON.parse(userData);
                const data = {
                    userName: json.userName,
                    id: rowId,
                    roles: 1
                }

                btn.prop("disabled", true);
                $.ajax({
                    type: 'POST',
                    url: 'http://' + domainName + ':8089/changeRole',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    headers: {"Authorization": "Bearer " + token},
                    success: function (resp) {
                        if (resp) {
                            if (resp.errorText && resp.errorText.length > 0) {
                                alert(resp.errorText);
                            } else {
                                $(".row-id").val('0');
                                $(".bt-actions").addClass("hide");
                                $(".row-hover").remove();
                            }
                        } else {
                            alert("Something wrong");
                        }
                        btn.prop("disabled", false);
                    }
                });
            } else {
                alert("Something wrong");
            }
        });

        //remove admin
        $(document).on("click", ".remove-admin-user", function () {
            let btn = $(this);
            let rowId = $(".row-id").val();
            let userData = localStorage.getItem("userData");
            const token = localStorage.getItem("token");

            if (userData && parseInt(rowId) > 0) {
                const json = JSON.parse(userData);
                const data = {
                    userName: json.userName,
                    id: rowId,
                    roles: 2
                }

                btn.prop("disabled", true);
                $.ajax({
                    type: 'POST',
                    url: 'http://' + domainName + ':8089/changeRole',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    headers: {"Authorization": "Bearer " + token},
                    success: function (resp) {
                        if (resp) {
                            if (resp.errorText && resp.errorText.length > 0) {
                                alert(resp.errorText);
                            } else {
                                $(".row-id").val('0');
                                $(".bt-actions").addClass("hide");
                                $(".row-hover").remove();
                            }
                        } else {
                            alert("Something wrong");
                        }
                        btn.prop("disabled", false);
                    }
                });
            } else {
                alert("Something wrong");
            }
        });

        //block user
        $(document).on("click", ".block-admin-user", function () {
            let btn = $(this);
            let rowId = $(".row-id").val();
            let userData = localStorage.getItem("userData");
            const token = localStorage.getItem("token");

            if (userData && parseInt(rowId) > 0) {
                const json = JSON.parse(userData);
                const data = {
                    userName: json.userName,
                    id: rowId,
                    status: false
                }

                btn.prop("disabled", true);
                $.ajax({
                    type: 'POST',
                    url: 'http://' + domainName + ':8089/updateUser',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    headers: {"Authorization": "Bearer " + token},
                    success: function (resp) {
                        if (resp) {
                            if (resp.errorText && resp.errorText.length > 0) {
                                alert(resp.errorText);
                            } else {
                                $(".row-hover").find(".user-state")
                                    .text(document.documentElement.lang == "hy" ? "Պասիվ" : document.documentElement.lang == "ru" ? "Неактивный" : "Inactive");
                                $(".row-id").val('0');
                                $(".bt-actions").addClass("hide");
                            }
                        } else {
                            alert("Something wrong");
                        }
                        btn.prop("disabled", false);
                    }
                });
            } else {
                alert("Something wrong");
            }
        });

        //unblock user
        $(document).on("click", ".unblock-admin-user", function () {
            let btn = $(this);
            let rowId = $(".row-id").val();
            let userData = localStorage.getItem("userData");
            const token = localStorage.getItem("token");

            if (userData && parseInt(rowId) > 0) {
                const json = JSON.parse(userData);
                const data = {
                    userName: json.userName,
                    id: rowId,
                    status: true
                }

                btn.prop("disabled", true);
                $.ajax({
                    type: 'POST',
                    url: 'http://' + domainName + ':8089/updateUser',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    headers: {"Authorization": "Bearer " + token},
                    success: function (resp) {
                        if (resp) {
                            if (resp.errorText && resp.errorText.length > 0) {
                                alert(resp.errorText);
                            } else {
                                $(".row-hover").find(".user-state")
                                    .text(document.documentElement.lang == "hy" ? "Ակտիվ" : document.documentElement.lang == "ru" ? "Активный" : "Active");
                                $(".row-id").val('0');
                                $(".bt-actions").addClass("hide")
                            }
                        } else {
                            alert("Something wrong");
                        }
                        btn.prop("disabled", false);
                    }
                });
            } else {
                alert("Something wrong");
            }
        });

        //approve forum
        $(document).on("click", ".approve-forum", function () {
            let btn = $(this);
            let rowId = $(".row-id").val();
            let userData = localStorage.getItem("userData");
            const token = localStorage.getItem("token");

            if (userData && parseInt(rowId) > 0) {
                const json = JSON.parse(userData);
                const data = {
                    userName: json.userName,
                    id: rowId
                }

                btn.prop("disabled", true);
                $.ajax({
                    type: 'POST',
                    url: 'http://' + domainName + ':8089/activatePost',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    headers: {"Authorization": "Bearer " + token},
                    success: function (resp) {
                        if (resp) {
                            if (resp.errorText && resp.errorText.length > 0) {
                                alert(resp.errorText);
                            } else {
                                var uri = window.location.href;
                                let status = document.documentElement.lang == "hy" ? "Ստեղծված" :
                                    document.documentElement.lang == "ru" ? "Создано" :
                                        "Created";
                                $(".row-id").val('0');
                                $(".descr-forum").addClass("hide");
                                $(".approve-forum").addClass("hide");
                                $(".block-forum").addClass("hide");
                                $(".privet-forum").addClass("hide");
                                if (uri.indexOf("/postsforapproval") > 0) {
                                    $(".row-hover").remove();
                                } else {
                                    $(".row-hover").find(".ds-status").text(status);
                                }
                            }
                        } else {
                            alert("Something wrong");
                        }
                        btn.prop("disabled", false);
                    }
                });
            } else {
                alert("Something wrong");
            }
        });

        //block forum
        $(document).on("click", ".block-forum", function () {
            let btn = $(this);
            let rowId = $(".row-id").val();
            let userData = localStorage.getItem("userData");
            const token = localStorage.getItem("token");

            if (userData && parseInt(rowId) > 0) {
                const json = JSON.parse(userData);
                const data = {
                    userName: json.userName,
                    id: rowId
                }

                btn.prop("disabled", true);
                $.ajax({
                    type: 'POST',
                    url: 'http://' + domainName + ':8089/blockPost',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    headers: {"Authorization": "Bearer " + token},
                    success: function (resp) {
                        if (resp) {
                            if (resp.errorText && resp.errorText.length > 0) {
                                alert(resp.errorText);
                            } else {
                                $(".row-id").val('0');
                                $(".descr-forum").addClass("hide");
                                $(".approve-forum").addClass("hide");
                                $(".block-forum").addClass("hide");
                                $(".privet-forum").addClass("hide");
                                $(".row-hover").remove();
                            }
                        } else {
                            alert("Something wrong");
                        }
                        btn.prop("disabled", false);
                    }
                });
            } else {
                alert("Something wrong");
            }
        });

        //privet forum
        $(document).on("click", ".privet-forum", function () {
            let btn = $(this);
            let rowId = $(".row-id").val();
            let userData = localStorage.getItem("userData");
            const token = localStorage.getItem("token");

            if (userData && parseInt(rowId) > 0) {
                const json = JSON.parse(userData);
                const data = {
                    userName: json.userName,
                    id: rowId
                }

                btn.prop("disabled", true);
                $.ajax({
                    type: 'POST',
                    url: 'http://' + domainName + ':8089/privatePost',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    headers: {"Authorization": "Bearer " + token},
                    success: function (resp) {
                        if (resp) {
                            if (resp.errorText && resp.errorText.length > 0) {
                                alert(resp.errorText);
                            } else {
                                let status = document.documentElement.lang == "hy" ? "Անձնական" :
                                    document.documentElement.lang == "ru" ? "Частный" :
                                        "Private";
                                $(".row-id").val('0');
                                $(".descr-forum").addClass("hide");
                                $(".approve-forum").addClass("hide");
                                $(".block-forum").addClass("hide");
                                $(".privet-forum").addClass("hide");
                                $(".row-hover").find(".ds-status").text(status);
                            }
                        } else {
                            alert("Something wrong");
                        }
                        btn.prop("disabled", false);
                    }
                });
            } else {
                alert("Something wrong");
            }
        });

        //add comment forum
        $(document).on("keyup", ".add-comment", function (e) {
            let item = $(this)
            let userData = localStorage.getItem("userData");
            const token = localStorage.getItem("token");

            if (e.key === 'Enter' || e.keyCode === 13) {
                if (userData) {
                    const json = JSON.parse(userData);
                    const text = item.val();

                    const data = {
                        postId: item.attr("data-post-id"),
                        userId: json.userId,
                        comment: text
                    }

                    $.ajax({
                        type: 'POST',
                        url: 'http://' + domainName + ':8089/comment',
                        data: JSON.stringify(data),
                        contentType: 'application/json',
                        headers: {"Authorization": "Bearer " + token},
                        success: function (resp) {
                            if (resp) {
                                if (resp.errorText && resp.errorText.length > 0) {
                                    alert(resp.errorText);
                                } else {
                                    const html = '<div class="comment-box">' +
                                        '<p class="comm-user" style=" display: flex; align-items: center;">' +
                                        '<img src="' + json.imagePath + '" alt="" class="user-navbar" style="margin-right: 10px; border-radius: 20px" ' + '">' +
                                        json.firstName + ' ' + json.lastName + ' ' + self.shortDateBySymbol(new Date()) + '</p>' +
                                        '<div class="comm-cont" style="margin-top: 10px">' + text + '</div>' +
                                        '</div>';

                                    item.closest('.post-data').find('.comment-container').append(html);
                                    item.val('');
                                }
                            } else {
                                alert("Something wrong");
                            }
                        }
                    });
                } else {
                    alert("Something wrong");
                }
            }
        });

        //search forum
        $(document).on("click", ".search-forum", function () {
            let btn = $(this);
            let userData = localStorage.getItem("userData");
            const token = localStorage.getItem("token");
            const id = self.getRequestParam('id');
            const data = {
                title: $(".src-title").val(),
                categoryId: parseInt($(".src-option").val())
            }
            if (data) {
                $.ajax({
                    type: 'POST',
                    url: 'http://' + domainName + ':8089/searchPosts',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    // headers: { "Authorization": "Bearer " + token },
                    success: function (resp) {
                        if (resp) {
                            $(".post-container").html('');
                            resp.forEach(obj => {

                                let category = document.documentElement.lang == "hy" ? obj.category[1] :
                                    document.documentElement.lang == "ru" ? obj.category[2] :
                                        obj.category[0];
                                let icon = id ? '' : '<div class="navigation" style="width:30px;">' +
                                    '<a href="/posts?id=' + obj.postId + '"><img src="/images/arrow_right.png" className="img-nav" alt=""></a>' +
                                    '</div>';
                                let html = '<div class="post-data">' +
                                    '<div class="post-box" >' +
                                    '<div style="display: flex; justify-content: space-between;">' +
                                    '<h3>' + category + ' (' + obj.title + ')' + '</h3>' +
                                    icon +
                                    '</div>' +
                                    '<p class="post-user"  style=" display: flex; align-items: center;">' +
                                    '<img src="' + obj.userImg + '" alt="" class="user-navbar" style="margin-right: 10px; border-radius: 20px" ' + (obj.userImg ? null : "hide") + '">' +
                                    obj.firstName + ' ' + obj.lastName + ' ' + self.getDateByFormat(obj.localDateTime, ".") + '</p>' +
                                    '<img src="' + obj.imagePath + '" alt="" class="post-img ' + (obj.imagePath ? null : "hide") + '">' +
                                    '<span class="post-decription" style="margin-top: 10px">' + obj.descriptionPath + '</span>' +
                                    '</div>' +
                                    '<div class="comment-container">' + self.getCommentList(obj.comments) + '</div>' +
                                    '<div class="input-wrap w-100 p-top-24">' +
                                    '<div class="content m-top-4">';
                                if (userData) {
                                    html += '<input class="add-comment" style="margin-bottom: 100px" type="text" data-post-id="' + obj.postId + '" placeholder="Write a comment…" autocomplete="off">' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>';
                                } else {
                                    html += '</div>' +
                                        '</div>' +
                                        '</div>';
                                }

                                $(".post-container").append(html);
                            });
                        }
                    }
                });
            } else {
                alert("Something wrong");
            }
        });

    },
    init: function () {
        let active = document.documentElement.lang == "hy" ? "Ակտիվ" : document.documentElement.lang == "ru" ? "Активный" : "Active"
        let inactive = document.documentElement.lang == "hy" ? "Պասիվ" : document.documentElement.lang == "ru" ? "Неактивный" : "Inactive"
        var self = this;
        let userData = localStorage.getItem("userData");
        const token = localStorage.getItem("token");
        var uri = window.location.href;
        if (userData) {

            const json = JSON.parse(userData);
            console.log(json)
            if (json.imagePath !== null && json.imagePath.toString().trim().length > 0) {
                document.getElementById("userImg").src = json.imagePath;
            }

            if (uri.indexOf("/admins") > 0) {
                // $(".psy-footer").css("position", "absolute");
                // $(".psy-footer").css("bottom", "0");
                if (json.role == 2 || json.role == 1) {
                    window.location.href = "index";
                } else {
                    $(".remove-admin-user").addClass("hide");
                }


                $.ajax({
                    type: 'GET',
                    url: 'http://' + domainName + ':8089/getAllAdmins/',
                    contentType: 'application/json',
                    headers: {"Authorization": "Bearer " + token},
                    success: function (resp) {
                        if (resp) {
                            resp.forEach(obj => {
                                let html = '<div class="row" data-id="' + obj.userId + '">' +
                                    '<div class="td">' + obj.firstName + '</div>' +
                                    '<div class="td">' + obj.lastName + '</div>' +
                                    '<div class="td">' + obj.email + '</div>' +
                                    '<div class="td">' + obj.userName + '</div>' +
                                    '<div class="td user-state">' + (obj.verification ? active : inactive) + '</div>' +
                                    '</div>';
                                $(".row-data").append(html);
                            });
                        }
                    }
                });
            } else if (uri.indexOf("users") > 0) {
                // $(".psy-footer").css("position", "absolute");
                // $(".psy-footer").css("bottom", "0");
                if (json.role == 2) {
                    window.location.href = "index";
                } else if (json.role == 0 || json.role == 1) {
                    $(".add-admin-user").removeClass("hide");
                }


                $.ajax({
                    type: 'GET',
                    url: 'http://' + domainName + ':8089/getAllUsers',
                    contentType: 'application/json',
                    headers: {"Authorization": "Bearer " + token},
                    success: function (resp) {
                        if (resp) {
                            resp.forEach(obj => {
                                let html = '<div class="row" data-id="' + obj.userId + '">' +
                                    '<div class="td">' + obj.firstName + '</div>' +
                                    '<div class="td">' + obj.lastName + '</div>' +
                                    '<div class="td">' + obj.email + '</div>' +
                                    '<div class="td">' + obj.userName + '</div>' +
                                    '<div class="td user-state">' + (obj.verification ? active : inactive) + '</div>' +
                                    '</div>';
                                $(".row-data").append(html);
                            });
                        }
                    }
                });
            } else if (uri.indexOf("/postsforapproval") > 0) {
                $(".th").css("width", "450px");
                // $(".psy-footer").css("position", "absolute");
                // $(".psy-footer").css("bottom", "0");


                if (json.role == 2) {
                    window.location.href = "index";
                }

                $.ajax({
                    type: 'GET',
                    url: 'http://' + domainName + ':8089/waitingPosts',
                    contentType: 'application/json',
                    headers: {"Authorization": "Bearer " + token},
                    success: function (resp) {
                        if (resp) {
                            resp.forEach(obj => {
                                let category = document.documentElement.lang == "hy" ? obj.category[1] :
                                    document.documentElement.lang == "ru" ? obj.category[2] :
                                        obj.category[0];
                                let html = '<div class="row" data-id="' + obj.postId + '">' +
                                    '<div class="td ds-cat" style="width:450px;">' + category + '</div>' +
                                    '<div class="td ds-title" style="width:450px;">' + obj.title + '</div>' +
                                    '<div class="td" style="width:450px;">' + self.getDateByFormat(obj.localDateTime, ".") + '</div>' +
                                    '<input type="hidden" class="pst-desc" value="' + obj.descriptionPath + '" />' +
                                    '<input type="hidden" class="pst-img" value="' + obj.imagePath + '" />' +
                                    '</div>';
                                $(".row-data").append(html);
                            });
                        }
                    }
                });
            } else if (uri.indexOf("/myposts") > 0) {
                $(".th").css("width", "335px");
                $(".navigation").css("width", "30px");
                // $(".psy-footer").css("position", "absolute");
                // $(".psy-footer").css("bottom", "0");


                $.ajax({
                    type: 'GET',
                    url: 'http://' + domainName + ':8089/getPostsByUserName/' + json.userName,
                    contentType: 'application/json',
                    headers: {"Authorization": "Bearer " + token},
                    success: function (resp) {
                        if (resp) {
                            resp.forEach(obj => {
                                let category = document.documentElement.lang == "hy" ? obj.category[1] :
                                    document.documentElement.lang == "ru" ? obj.category[2] :
                                        obj.category[0];
                                let status;
                                if (obj.status.includes("Waiting")) {
                                    status = document.documentElement.lang == "hy" ? "Ընթացքի մեջ" :
                                        document.documentElement.lang == "ru" ? "В процессе" :
                                            "In progress";
                                } else if (obj.status.includes("Created")) {
                                    status = document.documentElement.lang == "hy" ? "Ստեղծված" :
                                        document.documentElement.lang == "ru" ? "Создано" :
                                            "Created";
                                } else if (obj.status.includes("Blocked")) {
                                    status = document.documentElement.lang == "hy" ? "Արգելափակված" :
                                        document.documentElement.lang == "ru" ? "Заблокировано" :
                                            "Blocked";
                                } else if (obj.status.includes("Private")) {
                                    status = document.documentElement.lang == "hy" ? "Անձնական" :
                                        document.documentElement.lang == "ru" ? "Частный" :
                                            "Private";
                                }
                                console.log(obj.status)
                                let html = '<div class="row" data-id="' + obj.postId + '">' +
                                    '<div class="td ds-cat" style="width:335px;">' + category + '</div>' +
                                    '<div class="td ds-title" style="width:335px;">' + obj.title + '</div>' +
                                    '<div class="td" style="width:335px;">' + self.getDateByFormat(obj.localDateTime, ".") + '</div>' +
                                    '<div class="td ds-status" style="width:335px;">' + status + '</div>' +
                                    '<div class="td navigation" style="width:30px;">' + self.getCursoreImage(obj.status, obj.postId) + '</div>' +
                                    '<input type="hidden" class="pst-desc" value="' + obj.descriptionPath + '" />' +
                                    '<input type="hidden" class="pst-img" value="' + obj.imagePath + '" />' +
                                    '</div>';
                                $(".row-data").append(html);
                            });

                        }
                    }
                });
            } else if (uri.indexOf("/posts") > 0) {
                const token = localStorage.getItem("token");
                let idParam = "";
                const id = self.getRequestParam('id');
                if (id) {
                    idParam = "/" + id;
                }


                $.ajax({
                    type: 'GET',
                    url: 'http://' + domainName + ':8089/createdPosts' + idParam,
                    contentType: 'application/json',
                    headers: {"Authorization": "Bearer " + token},
                    success: function (resp) {
                        if (resp) {
                            resp.forEach(obj => {
                                let category = document.documentElement.lang == "hy" ? obj.category[1] :
                                    document.documentElement.lang == "ru" ? obj.category[2] :
                                        obj.category[0];
                                let icon = id ? '' : '<div class="navigation" style="width:30px;">' +
                                    '<a href="/posts?id=' + obj.postId + '"><img src="/images/arrow_right.png" className="img-nav" alt=""></a>' +
                                    '</div>';
                                let html = '<div class="post-data">' +
                                    '<div class="post-box" >' +
                                    '<div style="display: flex; justify-content: space-between;">' +
                                    '<h3>' + category + ' (' + obj.title + ')' + '</h3>' +
                                    icon +
                                    '</div>' +
                                    '<p class="post-user"  style=" display: flex; align-items: center;">' +
                                    '<img src="' + obj.userImg + '" alt="" class="user-navbar" style="margin-right: 10px; border-radius: 20px" ' + (obj.userImg ? null : "hide") + '">' +
                                    obj.firstName + ' ' + obj.lastName + ' ' + self.getDateByFormat(obj.localDateTime, ".") + '</p>' +
                                    '<img src="' + obj.imagePath + '" alt="" class="post-img ' + (obj.imagePath ? null : "hide") + '">' +
                                    '<span class="post-decription" style="margin-top: 10px">' + obj.descriptionPath + '</span>' +
                                    '</div>' +
                                    '<div class="comment-container">' + self.getCommentList(obj.comments) + '</div>' +
                                    '<div class="input-wrap w-100 p-top-24">' +
                                    '<div class="content m-top-4">' +
                                    '<input class="add-comment" style="margin-bottom: 100px" type="text" data-post-id="' + obj.postId + '" placeholder="Write a comment…" autocomplete="off">' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>';

                                $(".post-container").append(html);
                            });
                        }
                    }
                });
                $(".src-option").append(new Option('', '0'));
                $.ajax({
                    type: 'GET',
                    url: 'http://' + domainName + ':8089/allCategory',
                    contentType: 'application/json',
                    headers: {"Authorization": "Bearer " + token},
                    success: function (resp) {
                        if (resp) {
                            resp.forEach(obj => {
                                $(".src-option").append(new Option(
                                    document.documentElement.lang == "hy" ? obj.postCategoryTypeHy :
                                        document.documentElement.lang == "ru" ? obj.postCategoryTypeRu :
                                            obj.postCategoryType, obj.id));
                            });
                        }
                    }
                });

            } else if (uri.indexOf("/categories") > 0) {
                $(".th").css("width", "1340px");

                if (json.role != 0) {
                    window.location.href = "index";
                }


                $.ajax({
                    type: 'GET',
                    url: 'http://' + domainName + ':8089/allCategory',
                    contentType: 'application/json',
                    headers: {"Authorization": "Bearer " + token},
                    success: function (resp) {
                        if (resp) {
                            resp.forEach(obj => {
                                let category = document.documentElement.lang == "hy" ? obj.postCategoryTypeHy :
                                    document.documentElement.lang == "ru" ? obj.postCategoryTypeRu :
                                        obj.postCategoryType;
                                let html = '<div class="row" data-id="' + obj.id + '">' +
                                    '<div class="td" style="width:1340px">' +
                                    category +
                                    '</div>' +
                                    '</div>';
                                $(".row-data").append(html);
                            });
                        }
                    }
                });
            } else if (uri.indexOf("/user/details") > 0) {
                if (json.imagePath !== null && json.imagePath.length > 0 && json.imagePath.toString().trim().length > 0) {
                    document.getElementById("userBigImg").src = json.imagePath;
                }
                let fulName = json.firstName + " " + json.lastName;
                document.getElementById("fullName").textContent = fulName;
                document.getElementById("email").textContent = json.email;
                document.getElementById("post").textContent = json.postCount;
                document.getElementById("comment").textContent = json.commentCount;
            }

        }
        else if (uri.indexOf("/posts") > 0) {
            let idParam = "";
            const id = self.getRequestParam('id');
            if (id) {
                idParam = "/" + id;
            }
            $.ajax({
                type: 'GET',
                url: 'http://' + domainName + ':8089/createdPosts' + idParam,
                contentType: 'application/json',

                success: function (resp) {
                    if (resp) {
                        resp.forEach(obj => {
                            let category = document.documentElement.lang == "hy" ? obj.category[1] :
                                document.documentElement.lang == "ru" ? obj.category[2] :
                                    obj.category[0];
                            let icon = id ? '' : '<div class="navigation" style="width:30px;">' +
                                '<a href="/posts?id=' + obj.postId + '"><img src="/images/arrow_right.png" className="img-nav" alt=""></a>' +
                                '</div>';
                            let html = '<div class="post-data">' +
                                '<div class="post-box" >' +
                                '<div style="display: flex; justify-content: space-between;">' +
                                '<h3>' + category + ' (' + obj.title + ')' + '</h3>' +
                                icon +
                                '</div>' +
                                '<p class="post-user"  style=" display: flex; align-items: center;">' +
                                '<img src="' + obj.userImg + '" alt="" class="user-navbar" style="margin-right: 10px; border-radius: 20px" ' + (obj.userImg ? null : "hide") + '">' +
                                obj.firstName + ' ' + obj.lastName + ' ' + self.getDateByFormat(obj.localDateTime, ".") + '</p>' +
                                '<img src="' + obj.imagePath + '" alt="" class="post-img ' + (obj.imagePath ? null : "hide") + '">' +
                                '<span class="post-decription" style="margin-top: 10px">' + obj.descriptionPath + '</span>' +
                                '<div class="comment-container">' + self.getCommentList(obj.comments) + '</div>' +
                                '<div class="input-wrap w-100 p-top-24">' +
                                '<div class="content m-top-4">' +
                                '</div>' +
                                '</div>';

                            $(".post-container").append(html);
                        });
                    }
                }
            });
            $(".src-option").append(new Option('', '0'));
            $.ajax({
                type: 'GET',
                url: 'http://' + domainName + ':8089/allCategory',
                contentType: 'application/json',

                success: function (resp) {
                    if (resp) {
                        resp.forEach(obj => {
                            $(".src-option").append(new Option(
                                document.documentElement.lang == "hy" ? obj.postCategoryTypeHy :
                                    document.documentElement.lang == "ru" ? obj.postCategoryTypeRu :
                                        obj.postCategoryType, obj.id));
                        });
                    }
                }
            });

        } else {
            if (uri.indexOf("forgot=true") > -1) {
                $(".psy-popup[data-popup='forgotpass']").show();
            }
                // else if (uri.indexOf("index?token=") > -1) {
                //     $(".psy-popup[data-popup='changepassword']").show();
            // }
            else if (uri.indexOf("/admins") > 0 || uri.indexOf("/categories") > 0 ||
                uri.indexOf("/users") > 0 || uri.indexOf("/postsforapproval") > 0 || uri.indexOf("/myposts") > 0 || uri.indexOf("/user/details") > 0) {
                window.location = "http://" + domainName + ":8089/index";
            }
        }
    },
    isAuthorized: function (data) {
        var self = this;
        if (data) {
            if (!data.verification) {
                self.logOut();
            } else {
                self.logIn(data);
            }
        } else {
            self.logOut();
        }
    },
    logOut: function (isRedirect = false) {
        var self = this;
        localStorage.removeItem("userData");
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        if (isRedirect) {
            window.location = "http://" + domainName + ":8089/index";
        }
    },
    logIn: function (data) {
        var self = this;

        $(".header-no-auth").addClass("hide");
        $(".header-is-auth").removeClass("hide");
        $(".head-fullname").text(data.firstName + " " + data.lastName);

        if (data.role == 2) {
            $(".categories").addClass("hide");
            $(".mnAdmins").addClass("hide");
            $(".mnUsers").addClass("hide");
            $(".mnPosts-for-approval").addClass("hide");
            $(".mnMy-posts").removeClass("hide");

        } else if (data.role == 1) {
            $(".categories").addClass("hide");
            $(".mnAdmins").addClass("hide");
            $(".mnUsers").removeClass("hide");
            $(".mnPosts-for-approval").removeClass("hide");
            $(".mnMy-posts").removeClass("hide");

        } else if (data.role == 0) {
            $(".categories").removeClass("hide");
            $(".mnAdmins").removeClass("hide");
            $(".mnUsers").removeClass("hide");
            $(".mnPosts-for-approval").removeClass("hide");
            $(".mnMy-posts").removeClass("hide");

        }

    },
    shortDateBySymbol: function (date, symbol = ".") {
        var self = this;

        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        let yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        let hour = date.getHours()
        let minute = date.getMinutes();

        if (hour < 10) {
            hour = "0" + hour;
        }

        if (minute < 10) {
            minute = "0" + minute;
        }

        return dd + symbol + mm + symbol + yyyy + " " + hour + ":" + minute;
    },
    getDateByFormat: function (date, symbol = ".") {
        var self = this;
        if (date.indexOf("T") == -1) {
            return date;
        }
        let tDate = date.split("T");
        let timeArr = tDate[1].split(":");
        let hour = timeArr[0];
        let minute = timeArr[1];
        date = new Date(date);
        date = `${self.dateateBySymbol(date, symbol)} ${hour}:${minute}`;
        return date;
    },
    dateateBySymbol: function (date, char = ".") {
        var self = this;
        var dd = date.getDate();
        var mm = date.getMonth() + 1;
        var yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return dd + char + mm + char + yyyy;
    },
    getCommentList: function (data) {
        var self = this;
        let html = '';
        for (const obj of data) {
            html += '<div class="comment-box">' +
                '<p class="comm-user" style=" display: flex; align-items: center;">' +
                '<img src="' + obj.userImg + '" alt="" class="user-navbar" style="margin-right: 10px; border-radius: 20px" ' + (obj.userImg ? null : "hide") + '">' +
                obj.firstName + ' ' + obj.lastName + ' ' + self.getDateByFormat(obj.localDateTime, ".") + '</p>' +
                '<div class="comm-cont" style="margin-top: 10px;">' + obj.comment + '</div>' +
                '</div>';
            if (!document.documentURI.toString().includes("id")) {
                $(".src-block").removeClass("hide");
                return html;
            } else {
                $(".src-block").addClass("hide");
            }
        }
        return html;
    },
    getRequestParam: function (name) {
        var self = this;
        if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
            return decodeURIComponent(name[1]);
    },
    getCursoreImage: function (status, postId) {
        var self = this;
        if (status == "Waiting" || status == "Blocked") {
            return "";
        } else {
            return '<a href="/posts?id=' + postId + '"><img src="/images/arrow_right.png" class="img-nav" alt=""></a>';
        }
    },
    getFileBase64: function (file) {
        var self = this;
        if (file) {
            const promise = new Promise((resolve, reject) => {
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    resolve(e.target.result);
                }
            });
            return promise;
        }
        return null;
    }
};