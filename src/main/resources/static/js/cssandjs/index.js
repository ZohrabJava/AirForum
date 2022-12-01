jQuery(document).ready(function () {
    indexFunctions.init();
    indexFunctions.events();
});

var borderColor = "#b3bac3";
var indexFunctions = {
    events: function () {
        var self = this;

        let data = localStorage.getItem("userData");
        if (data) {
            const json = JSON.parse(data);
            const token = localStorage.getItem("token");
            try{
                $.ajax({
                    type: 'GET',
                    url: 'http://localhost:8089/userById/' + json.userId,
                    contentType: 'application/json',
                    headers: { "Authorization": "Bearer " + token },
                    success: function (resp) {
                        if (resp) {
                            data = resp;
                            localStorage.setItem("userData", JSON.stringify(resp));
                        }
                        else {
                            data = null;
                        }
                        self.isAuthorized(data);
                    }
                });
            }
            catch (error){
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
                url: 'http://localhost:8089/allCategory/',
                contentType: 'application/json',
                headers: { "Authorization": "Bearer " + token },
                success: function (resp) {
                    if (resp) {
                        $(".cat-option").html('');
                        resp.forEach(obj => {
                            $(".cat-option").append(new Option(obj.postCategoryType, obj.id));
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
            window.location.href = "index.html";
        });

        $(document).on("click", ".psy-popup-close-btn[data-popup-name='changepassword']", function () {
            window.location.href = "index.html";
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
            try {
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8089/login?username=' + data.username + '&password=' + data.password + '',
                    //data: JSON.stringiy(data),
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

                            try{
                                $.ajax({
                                    type: 'GET',
                                    url: 'http://localhost:8089/user/' + resp.userName,
                                    contentType: 'application/json',
                                    headers: { "Authorization": "Bearer " + resp.access_token },
                                    error: function (xhr) {

                                    },
                                    success: function (resp) {
                                        localStorage.setItem("userData", JSON.stringify(resp));
                                        self.isAuthorized(resp);
                                        window.location.href = "index.html";
                                    }
                                });
                            }
                            catch (error) {

                            }
                        } else {
                            form.find("p[class='error']").text("Something wrong");
                        }
                        form.find("button[type='submit']").prop("disabled", false);
                    }
                });
            }
            catch (error){
                form.find("button[type='submit']").prop("disabled", false);
            }
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
                url: 'http://localhost:8089/creat',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (resp) {
                    if (resp) {
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
                        }
                    }
                    else {
                        form.find("p[class='error']").text("Something wrong");
                    }
                    form.find("button[type='submit']").prop("disabled", false);
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

                if(document.getElementById("imagepath").files){
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
                }
                else {
                    title.css("border-color", borderColor);
                }

                if (data.descriptionPath.length == 0) {
                    description.css("border-color", "red");
                    isValid = false;
                }
                else {
                    description.css("border-color", borderColor);
                }

                if (!isValid) {
                    return false;
                }

                form.find("button[type='submit']").prop("disabled", true);
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8089/post',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    headers: { "Authorization": "Bearer " + token },
                    success: function (resp) {
                        if (resp) {
                            if (resp.errorText && resp.errorText.length > 0) {
                                form.find("p[class='error']").text(resp.errorText);
                            }
                            else {
                                $(".psy-popup[data-popup='createpost']").hide();
                                form.find("input[name='title']").val("");
                                form.find("input[name='description']").val("");

                                let html = '<div class="row" data-id="' + resp.postId + '">' +
                                    '<div class="td ds-cat" style="width:335px;">' + resp.category + '</div>' +
                                    '<div class="td ds-title" style="width:335px;">' + resp.title + '</div>' +
                                    '<div class="td" style="width:335px;">' + self.getDateByFormat(resp.localDateTime, ".") + '</div>' +
                                    '<div class="td ds-status" style="width:335px;">' + resp.status + '</div>' +
                                    '<div class="td navigation" style="width:30px;">' + self.getCursoreImage(resp.status, resp.postId) + '</div>' +
                                    '<input type="hidden" class="pst-desc" value="' + resp.descriptionPath + '" />' +
                                    '<input type="hidden" class="pst-img" value="' + resp.imagePath + '" />' +
                                    '</div>';
                                $(".row-data").append(html);
                            }
                        }
                        else {
                            form.find("p[class='error']").text("Something wrong");
                        }
                        form.find("button[type='submit']").prop("disabled", false);
                    }
                });
            }
        });
        $("#form-createcategories").on("submit", function (e) {
            e.preventDefault();
            const form = $(this);
            form.find("p[class='error']").text("");

            let category = form.find("input[name='category']");
            let isValid = true;

            const data = {
                postCategoryType: category.val()
            }

            if (data.postCategoryType.length == 0) {
                category.css("border-color", "red");
                isValid = false;
            }
            else {
                category.css("border-color", borderColor);
            }

            if (!isValid) {
                return false;
            }

            form.find("button[type='submit']").prop("disabled", true);
            const token = localStorage.getItem("token");
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8089/category',
                data: JSON.stringify(data),
                contentType: 'application/json',
                headers: { "Authorization": "Bearer " + token },
                success: function (resp) {
                    if (resp) {
                        if (resp.errorText && resp.errorText.length > 0) {
                            form.find("p[class='error']").text(resp.errorText);
                        }
                        else {
                            $(".psy-popup[data-popup='createcategories']").hide();
                            let html = '<div class="row" data-id="' + resp.id + '">' +
                                '<div class="td" style="width:1340px">' + resp.postCategoryType + '</div>' +
                                '</div>';
                            $(".row-data").append(html);
                            category.val("");
                        }
                    }
                    else {
                        form.find("p[class='error']").text("Something wrong");
                    }
                    form.find("button[type='submit']").prop("disabled", false);
                }
            });
        });
        $("#form-forgotpass").on("submit", function (e) {
            e.preventDefault();
            const form = $(this);
            form.find("p[class='error']").text("");
            let email = form.find("input[name='email']");
            let isValid = true;

            const data = {
                email: email.val()
            }

            if (data.email.length == 0) {
                email.css("border-color", "red");
                isValid = false;
            }
            else {
                email.css("border-color", borderColor);
            }

            if (!isValid) {
                return false;
            }
            form.find("button[type='submit']").prop("disabled", true);
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8089/resetPassword',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (resp) {
                    if (resp) {
                        if (resp.errorText && resp.errorText.length > 0) {
                            form.find("p[class='error']").text(resp.errorText);
                        }
                        else {
                            window.location.href = "index.html";
                        }
                    }
                    form.find("button[type='submit']").prop("disabled", false);
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
            }
            else {
                password.css("border-color", borderColor);
            }

            if (data.confirmpassword.length == 0) {
                confirmpassword.css("border-color", "red");
                isValid = false;
            }
            else {
                confirmpassword.css("border-color", borderColor);
            }

            if (data.password != data.confirmpassword) {
                form.find("p[class='error']").text("Password and Confirm Password does not match");
                isValid = false;
            }

            if (!isValid) {
                return false;
            }
            form.find("button[type='submit']").prop("disabled", true);
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8089/updatePassword',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (resp) {
                    if (resp) {
                        if (resp.errorText && resp.errorText.length > 0) {
                            form.find("p[class='error']").text(resp.errorText);
                        }
                        else {
                            window.location.href = "index.html";
                        }
                    }
                    form.find("button[type='submit']").prop("disabled", false);
                }
            });
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
            if (uri.indexOf("admins") > 0 || uri.indexOf("users") > 0) {
                var state = row.find(".user-state").html();
                $(".remove-admin-user").removeClass("hide");
                if (state == "true") {
                    $(".block-admin-user").removeClass("hide");
                    $(".unblock-admin-user").addClass("hide");
                }
                else {
                    $(".block-admin-user").addClass("hide");
                    $(".unblock-admin-user").removeClass("hide");
                }
            }
            else if (uri.indexOf("postsforapproval") > 0) {
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
                if(img) {
                    $(".post-img").removeClass("hide");
                    $(".post-img").attr("src", img);
                }
                else{
                    $(".post-img").addClass("hide");
                }
            }
            else if (uri.indexOf("myposts") > 0) {
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
                if(img) {
                    $(".post-img").removeClass("hide");
                    $(".post-img").attr("src", img);
                }
                else{
                    $(".post-img").addClass("hide");
                }

                var status = row.find(".ds-status").text();
                if (status == "Created") {
                    $(".block-forum").removeClass("hide");
                    $(".privet-forum").removeClass("hide");
                }
                else if (status == "Private") {
                    $(".approve-forum").removeClass("hide");
                }
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
                    url: 'http://localhost:8089/changeRole',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    headers: { "Authorization": "Bearer " + token },
                    success: function (resp) {
                        if (resp) {
                            if (resp.errorText && resp.errorText.length > 0) {
                                alert(resp.errorText);
                            }
                            else {
                                $(".row-id").val('0');
                                $(".bt-actions").addClass("hide");
                                $(".row-hover").remove();
                            }
                        }
                        else {
                            alert("Something wrong");
                        }
                        btn.prop("disabled", false);
                    }
                });
            }
            else {
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
                    url: 'http://localhost:8089/changeRole',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    headers: { "Authorization": "Bearer " + token },
                    success: function (resp) {
                        if (resp) {
                            if (resp.errorText && resp.errorText.length > 0) {
                                alert(resp.errorText);
                            }
                            else {
                                $(".row-id").val('0');
                                $(".bt-actions").addClass("hide");
                                $(".row-hover").remove();
                            }
                        }
                        else {
                            alert("Something wrong");
                        }
                        btn.prop("disabled", false);
                    }
                });
            }
            else {
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
                    url: 'http://localhost:8089/updateUser',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    headers: { "Authorization": "Bearer " + token },
                    success: function (resp) {
                        if (resp) {
                            if (resp.errorText && resp.errorText.length > 0) {
                                alert(resp.errorText);
                            }
                            else {
                                $(".row-hover").find(".user-state").text("false");
                                $(".row-id").val('0');
                                $(".bt-actions").addClass("hide");
                            }
                        }
                        else {
                            alert("Something wrong");
                        }
                        btn.prop("disabled", false);
                    }
                });
            }
            else {
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
                    url: 'http://localhost:8089/updateUser',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    headers: { "Authorization": "Bearer " + token },
                    success: function (resp) {
                        if (resp) {
                            if (resp.errorText && resp.errorText.length > 0) {
                                alert(resp.errorText);
                            }
                            else {
                                $(".row-hover").find(".user-state").text("true");
                                $(".row-id").val('0');
                                $(".bt-actions").addClass("hide")
                            }
                        }
                        else {
                            alert("Something wrong");
                        }
                        btn.prop("disabled", false);
                    }
                });
            }
            else {
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
                    url: 'http://localhost:8089/activatePost',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    headers: { "Authorization": "Bearer " + token },
                    success: function (resp) {
                        if (resp) {
                            if (resp.errorText && resp.errorText.length > 0) {
                                alert(resp.errorText);
                            }
                            else {
                                var uri = window.location.href;
                                $(".row-id").val('0');
                                $(".descr-forum").addClass("hide");
                                $(".approve-forum").addClass("hide");
                                $(".block-forum").addClass("hide");
                                $(".privet-forum").addClass("hide");
                                if (uri.indexOf("postsforapproval") > 0){
                                    $(".row-hover").remove();
                                }
                                else {
                                    $(".row-hover").find(".ds-status").text("Created");
                                }
                            }
                        }
                        else {
                            alert("Something wrong");
                        }
                        btn.prop("disabled", false);
                    }
                });
            }
            else {
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
                    url: 'http://localhost:8089/blockPost',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    headers: { "Authorization": "Bearer " + token },
                    success: function (resp) {
                        if (resp) {
                            if (resp.errorText && resp.errorText.length > 0) {
                                alert(resp.errorText);
                            }
                            else {
                                $(".row-id").val('0');
                                $(".descr-forum").addClass("hide");
                                $(".approve-forum").addClass("hide");
                                $(".block-forum").addClass("hide");
                                $(".privet-forum").addClass("hide");
                                $(".row-hover").remove();
                            }
                        }
                        else {
                            alert("Something wrong");
                        }
                        btn.prop("disabled", false);
                    }
                });
            }
            else {
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
                    url: 'http://localhost:8089/privatePost',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    headers: { "Authorization": "Bearer " + token },
                    success: function (resp) {
                        if (resp) {
                            if (resp.errorText && resp.errorText.length > 0) {
                                alert(resp.errorText);
                            }
                            else {
                                $(".row-id").val('0');
                                $(".descr-forum").addClass("hide");
                                $(".approve-forum").addClass("hide");
                                $(".block-forum").addClass("hide");
                                $(".privet-forum").addClass("hide");
                                $(".row-hover").find(".ds-status").text("Private");
                            }
                        }
                        else {
                            alert("Something wrong");
                        }
                        btn.prop("disabled", false);
                    }
                });
            }
            else {
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
                        url: 'http://localhost:8089/comment',
                        data: JSON.stringify(data),
                        contentType: 'application/json',
                        headers: {"Authorization": "Bearer " + token},
                        success: function (resp) {
                            if (resp) {
                                if (resp.errorText && resp.errorText.length > 0) {
                                    alert(resp.errorText);
                                } else {
                                    const html = '<div class="comment-box">' +
                                        '<p class="comm-user">' + json.firstName + ' ' + json.lastName + ' ' + self.shortDateBySymbol(new Date()) + '</p>' +
                                        '<div class="comm-cont">' + text + '</div>' +
                                        '</div>';

                                    item.closest('.post-data').find('.comment-container').append(html);
                                    item.val('');
                                }
                            } else {
                                alert("Something wrong");
                            }
                        }
                    });
                }
                else {
                    alert("Something wrong");
                }
            }
        });

        //search forum
        $(document).on("click", ".search-forum", function () {
            let btn = $(this);
            let userData = localStorage.getItem("userData");
            const token = localStorage.getItem("token");

            if (userData) {
                const data = {
                    title: $(".src-title").val(),
                    categoryId: parseInt($(".src-option").val())
                }

                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8089/searchPosts',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    headers: { "Authorization": "Bearer " + token },
                    success: function (resp) {
                        if (resp) {
                            $(".post-container").html('');
                            resp.forEach(obj => {
                                let html = '<div class="post-data">' +
                                    '<div class="post-box" >' +
                                    '<h3>' + obj.category + ' (' + obj.title + ')</h3>' +
                                    '<img src="' + obj.imagePath +'" alt="" class="post-img ' + (obj.imagePath ? null : "hide") + '">'+
                                    '<p class="post-user">' + obj.firstName + ' ' + obj.lastName + ' ' + self.getDateByFormat(obj.localDateTime, ".") + '</p>' +
                                    '<span class="post-decription">' + obj.descriptionPath + '</span>' +
                                    '</div>' +
                                    '<div class="comment-container">' + self.getCommentList(obj.comments) + '</div>' +
                                    '<div class="input-wrap w-100 p-top-24">' +
                                    '<div class="content m-top-4">' +
                                    '<input class="add-comment" type="text" data-post-id="' + obj.postId + '" placeholder="Write a comment…" autocomplete="off">' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>';

                                $(".post-container").append(html);
                            });
                        }
                    }
                });
            }
            else {
                alert("Something wrong");
            }
        });

    },
    init: function () {
        var self = this;
        let userData = localStorage.getItem("userData");
        const token = localStorage.getItem("token");
        var uri = window.location.href;
        if (userData) {
            const json = JSON.parse(userData);
            if (uri.indexOf("admins") > 0) {
                // $(".psy-footer").css("position", "absolute");
                // $(".psy-footer").css("bottom", "0");
                if (json.role == 2 || json.role == 1) {
                    window.location.href = "index.html";
                } else {
                    $(".remove-admin-user").addClass("hide");
                }

                $.ajax({
                    type: 'GET',
                    url: 'http://localhost:8089/getAllAdmins/',
                    contentType: 'application/json',
                    headers: { "Authorization": "Bearer " + token },
                    success: function (resp) {
                        if (resp) {
                            resp.forEach(obj => {
                                let html = '<div class="row" data-id="' + obj.userId + '">' +
                                    '<div class="td">' + obj.firstName + '</div>' +
                                    '<div class="td">' + obj.lastName + '</div>' +
                                    '<div class="td">' + obj.email + '</div>' +
                                    '<div class="td">' + obj.userName + '</div>' +
                                    '<div class="td user-state">' + (obj.verification ? "true" : "false") + '</div>' +
                                    '</div>';
                                $(".row-data").append(html);
                            });
                        }
                    }
                });
            }
            else if (uri.indexOf("users") > 0) {
                // $(".psy-footer").css("position", "absolute");
                // $(".psy-footer").css("bottom", "0");
                if (json.role == 2) {
                    window.location.href = "index.html";
                } else if (json.role == 0 || json.role == 1) {
                    $(".add-admin-user").removeClass("hide");
                }

                $.ajax({
                    type: 'GET',
                    url: 'http://localhost:8089/getAllUsers',
                    contentType: 'application/json',
                    headers: { "Authorization": "Bearer " + token },
                    success: function (resp) {
                        if (resp) {
                            resp.forEach(obj => {
                                let html = '<div class="row" data-id="' + obj.userId + '">' +
                                    '<div class="td">' + obj.firstName + '</div>' +
                                    '<div class="td">' + obj.lastName + '</div>' +
                                    '<div class="td">' + obj.email + '</div>' +
                                    '<div class="td">' + obj.userName + '</div>' +
                                    '<div class="td user-state">' + (obj.verification ? "true" : "false") + '</div>' +
                                    '</div>';
                                $(".row-data").append(html);
                            });
                        }
                    }
                });
            }
            else if (uri.indexOf("postsforapproval") > 0) {
                $(".th").css("width", "450px");
                // $(".psy-footer").css("position", "absolute");
                // $(".psy-footer").css("bottom", "0");

                if (json.role == 2) {
                    window.location.href = "index.html";
                }

                $.ajax({
                    type: 'GET',
                    url: 'http://localhost:8089/waitingPosts',
                    contentType: 'application/json',
                    headers: { "Authorization": "Bearer " + token },
                    success: function (resp) {
                        if (resp) {
                            resp.forEach(obj => {
                                let html = '<div class="row" data-id="' + obj.postId + '">' +
                                    '<div class="td ds-cat" style="width:450px;">' + obj.category + '</div>' +
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
            }
            else if (uri.indexOf("myposts") > 0) {
                $(".th").css("width", "335px");
                $(".navigation").css("width", "30px");
                // $(".psy-footer").css("position", "absolute");
                // $(".psy-footer").css("bottom", "0");

                $.ajax({
                    type: 'GET',
                    url: 'http://localhost:8089/getPostsByUserName/' + json.userName,
                    contentType: 'application/json',
                    headers: { "Authorization": "Bearer " + token },
                    success: function (resp) {
                        if (resp) {
                            resp.forEach(obj => {
                                let html = '<div class="row" data-id="' + obj.postId + '">' +
                                    '<div class="td ds-cat" style="width:335px;">' + obj.category + '</div>' +
                                    '<div class="td ds-title" style="width:335px;">' + obj.title + '</div>' +
                                    '<div class="td" style="width:335px;">' + self.getDateByFormat(obj.localDateTime, ".") + '</div>' +
                                    '<div class="td ds-status" style="width:335px;">' + obj.status + '</div>' +
                                    '<div class="td navigation" style="width:30px;">' + self.getCursoreImage(obj.status, obj.postId) + '</div>' +
                                    '<input type="hidden" class="pst-desc" value="' + obj.descriptionPath + '" />' +
                                    '<input type="hidden" class="pst-img" value="' + obj.imagePath + '" />' +
                                    '</div>';
                                $(".row-data").append(html);
                            });

                        }
                    }
                });
            }
            else if (uri.indexOf("posts") > 0) {
                const token = localStorage.getItem("token");
                let idParam = "";
                const id = self.getRequestParam('id');
                if(id){
                    idParam = "/" + id;
                }
                $.ajax({
                    type: 'GET',
                    url: 'http://localhost:8089/createdPosts' + idParam,
                    contentType: 'application/json',
                    headers: { "Authorization": "Bearer " + token },
                    success: function (resp) {
                        if (resp) {
                            resp.forEach(obj => {
                                let html = '<div class="post-data">' +
                                    '<div class="post-box" >' +
                                    '<h3>' + obj.category + ' (' + obj.title + ')</h3>' +
                                    '<img src="' + obj.imagePath +'" alt="" class="post-img ' + (obj.imagePath ? null : "hide") + '">'+
                                    '<p class="post-user">' + obj.firstName + ' ' + obj.lastName + ' ' + self.getDateByFormat(obj.localDateTime, ".") + '</p>' +
                                    '<span class="post-decription">' + obj.descriptionPath + '</span>' +
                                    '</div>' +
                                    '<div class="comment-container">' + self.getCommentList(obj.comments) + '</div>' +
                                    '<div class="input-wrap w-100 p-top-24">' +
                                    '<div class="content m-top-4">' +
                                    '<input class="add-comment" type="text" data-post-id="' + obj.postId + '" placeholder="Write a comment…" autocomplete="off">' +
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
                    url: 'http://localhost:8089/allCategory/',
                    contentType: 'application/json',
                    headers: { "Authorization": "Bearer " + token },
                    success: function (resp) {
                        if (resp) {
                            resp.forEach(obj => {
                                $(".src-option").append(new Option(obj.postCategoryType, obj.id));
                            });
                        }
                    }
                });

            }
            else if (uri.indexOf("categories") > 0) {
                $(".th").css("width", "1340px");
                // $(".psy-footer").css("position", "absolute");
                // $(".psy-footer").css("bottom", "0");

                if (json.role != 0) {
                    window.location.href = "index.html";
                }

                $.ajax({
                    type: 'GET',
                    url: 'http://localhost:8089/allCategory/',
                    contentType: 'application/json',
                    headers: { "Authorization": "Bearer " + token },
                    success: function (resp) {
                        if (resp) {
                            resp.forEach(obj => {
                                let html = '<div class="row" data-id="' + obj.id + '">' +
                                    '<div class="td" style="width:1340px">' + obj.postCategoryType + '</div>' +
                                    '</div>';
                                $(".row-data").append(html);
                            });
                        }
                    }
                });
            }
        }
        else if (uri.indexOf("index") == -1) {
            window.location.href = "index.html";
        }
        else {
            if (uri.indexOf("forgot=true") > -1) {
                $(".psy-popup[data-popup='forgotpass']").show();
            }
            else if (uri.indexOf("token=") > -1) {
                $(".psy-popup[data-popup='changepassword']").show();
            }
        }
    },
    isAuthorized: function (data) {
        var self = this;
        if (data) {
            if (!data.verification) {
                self.logOut();
            }
            else {
                self.logIn(data);
            }
        }
        else {
            self.logOut();
        }
    },
    logOut: function (isRedirect = false) {
        var self = this;
        localStorage.removeItem("userData");
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        if(isRedirect) {
            window.location.href = "index.html";
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
            $(".mnPosts").removeClass("hide");
        }
        else if (data.role == 1) {
            $(".categories").addClass("hide");
            $(".mnAdmins").addClass("hide");
            $(".mnUsers").removeClass("hide");
            $(".mnPosts-for-approval").removeClass("hide");
            $(".mnMy-posts").removeClass("hide");
            $(".mnPosts").removeClass("hide");
        }
        else if (data.role == 0) {
            $(".categories").removeClass("hide");
            $(".mnAdmins").removeClass("hide");
            $(".mnUsers").removeClass("hide");
            $(".mnPosts-for-approval").removeClass("hide");
            $(".mnMy-posts").removeClass("hide");
            $(".mnPosts").removeClass("hide");
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
        data.forEach(obj => {
            html += '<div class="comment-box">' +
                '<p class="comm-user">' + obj.firstName + ' ' + obj.lastName + ' ' + self.getDateByFormat(obj.localDateTime, ".") + '</p>' +
                '<div class="comm-cont">' + obj.comment + '</div>' +
                '</div>';
        });
        return html;
    },
    getRequestParam: function (name) {
        var self = this;
        if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
            return decodeURIComponent(name[1]);
    },
    getCursoreImage: function (status, postId) {
        var self = this;
        if (status != "Created") {
            return "";
        }
        else {
            return '<a href="/posts?id=' + postId + '"><img src="/images/arrow_right.png" class="img-nav" alt=""></a>';
        }
    },
    getFileBase64: function(file) {
        var self = this;
        if(file) {
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