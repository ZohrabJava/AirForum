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
                    url: 'http://localhost:8082/userById/' + json.userId,
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
            //$.ajax({
            //    type: 'GET',
            //    url: 'http://localhost:8082/categorieslist/' + json.userName,
            //    contentType: 'application/json',
            //    //headers: { "Authorization": "Basic token" },//put token
            //    success: function (resp) {
            //        if (resp) {
            //            resp = JSON.parse(resp);

            let resp = JSON.parse('[{"id": 1,"category": "category1"}, {"id": 2,"category": "category2"}, {"id": 3,"category": "category3"}]');


            resp.forEach(obj => {
                $(".cat-option").append(new Option(obj.category, obj.id));
            });

                //        }
                //    }
                //});

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
                    url: 'http://localhost:8082/login?username=' + data.username + '&password=' + data.password + '',
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

                            try{
                                $.ajax({
                                    type: 'GET',
                                    url: 'http://localhost:8082/user/' + resp.userName,
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
                url: 'http://localhost:8082/creat',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (resp) {
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
                            //generalFunctions.isAuthorized(resp);
                        }
                    }
                    else {
                        form.find("p[class='error']").text("Something wrong");
                    }
                    form.find("button[type='submit']").prop("disabled", false);
                }
            });
        });
        $("#form-createpost").on("submit", function (e) {
            e.preventDefault();
            const form = $(this);
            form.find("p[class='error']").text("");

            let category = form.find("select[name='category']");
            let title = form.find("input[name='title']");
            let description = form.find("textarea[name='description']");
            let isValid = true;

            const data = {
                category: category.val(),
                title: title.val(),
                description: description.val()
            }

            if (data.title.length == 0) {
                title.css("border-color", "red");
                isValid = false;
            }
            else {
                title.css("border-color", borderColor);
            }

            if (data.description.length == 0) {
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
                url: 'http://localhost:8082/creatpost',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (resp) {
                    if (resp) {
                        resp = JSON.parse(resp);
                        if (resp.errorText && resp.errorText.length > 0) {
                            form.find("p[class='error']").text(resp.errorText);
                        }
                        else {
                            $(".psy-popup[data-popup='registr']").hide();
                            form.find("input[name='category']").val("");
                            form.find("input[name='title']").val("");
                            form.find("input[name='description']").val("");
                        }
                    }
                    else {
                        form.find("p[class='error']").text("Something wrong");
                    }
                    form.find("button[type='submit']").prop("disabled", false);
                }
            });
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
                url: 'http://localhost:8082/category',
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

        //click on row
        $(document).on("click", ".row", function () {
            let row = $(this);

            $(".row-hover").removeClass("row-hover");
            row.addClass("row-hover");
            $(".actions").removeClass("hide");

            let id = row.attr("data-id");
            $(".row-id").val(id);
            var uri = window.location.href;
            if (uri.indexOf("admins") > 0 || uri.indexOf("users") > 0) {
                var state = row.find(".user-state").html();
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
                var desc = row.find(".pst-desc").val();
                var cat = row.find(".ds-cat").text();
                var title = row.find(".ds-title").text();
                $(".psy-popup-cat").text(cat);
                $(".psy-popup-title").text(title);
                $(".post-descr").text(desc);
            }
            else if (uri.indexOf("myposts") > 0) {
                $(".descr-forum").removeClass("hide");
                $(".approve-forum").addClass("hide");
                $(".block-forum").addClass("hide");
                var desc = row.find(".pst-desc").val();
                var cat = row.find(".ds-cat").text();
                var title = row.find(".ds-title").text();
                $(".psy-popup-cat").text(cat);
                $(".popup-title").text(title);
                $(".post-descr").text(desc);

                var status = row.find(".ds-status").text();
                if (status == "Created") {
                    $(".block-forum").removeClass("hide");
                }
                else if (status == "Blocked") {
                    $(".approve-forum").removeClass("hide");
                }
            }
        });

        //remove user
        $(document).on("click", ".remove-admin-user", function () {
            let rowId = $(".row-id").val();
            let userData = localStorage.getItem("userData");

            if (userData && parseInt(rowId) > 0) {
                const json = JSON.parse(userData);
                const data = {
                    userName: json.userName,
                    id: rowId
                }

                $(this).prop("disabled", true);
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8082/removeadmin',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    // headers: { "Authorization": "Basic token" },//put token
                    success: function (resp) {
                        if (resp) {
                            resp = JSON.parse(resp);
                            if (resp.errorText && resp.errorText.length > 0) {
                                alert(resp.errorText);
                            }
                            else {
                                $(".row-id").val('0');
                                $(".actions").addClass("hide");
                                $(".row-hover").remove();
                            }
                        }
                        else {
                            alert("Something wrong");
                        }
                        $(this).prop("disabled", false);
                    }
                });
            }
            else {
                alert("Something wrong");
            }
        });

        //block user
        $(document).on("click", ".block-admin-user", function () {
            let rowId = $(".row-id").val();
            let userData = localStorage.getItem("userData");

            if (userData && parseInt(rowId) > 0) {
                const json = JSON.parse(userData);
                const data = {
                    userName: json.userName,
                    id: rowId
                }

                $(this).prop("disabled", true);
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8082/blockadmin',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    // headers: { "Authorization": "Basic token" },//put token
                    success: function (resp) {
                        if (resp) {
                            resp = JSON.parse(resp);
                            if (resp.errorText && resp.errorText.length > 0) {
                                alert(resp.errorText);
                            }
                            else {
                                $(".row-id").val('0');
                                $(".actions").addClass("hide")
                            }
                        }
                        else {
                            alert("Something wrong");
                        }
                        $(this).prop("disabled", false);
                    }
                });
            }
            else {
                alert("Something wrong");
            }
        });

        //unblock user
        $(document).on("click", ".unblock-admin-user", function () {
            let rowId = $(".row-id").val();
            let userData = localStorage.getItem("userData");

            if (userData && parseInt(rowId) > 0) {
                const json = JSON.parse(userData);
                const data = {
                    userName: json.userName,
                    id: rowId
                }

                $(this).prop("disabled", true);
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8082/unblockadmin',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    // headers: { "Authorization": "Basic token" },//put token
                    success: function (resp) {
                        if (resp) {
                            resp = JSON.parse(resp);
                            if (resp.errorText && resp.errorText.length > 0) {
                                alert(resp.errorText);
                            }
                            else {
                                $(".row-id").val('0');
                                $(".actions").addClass("hide")
                            }
                        }
                        else {
                            alert("Something wrong");
                        }
                        $(this).prop("disabled", false);
                    }
                });
            }
            else {
                alert("Something wrong");
            }
        });

        //approve forum
        $(document).on("click", ".approve-forum", function () {
            let rowId = $(".row-id").val();
            let userData = localStorage.getItem("userData");

            if (userData && parseInt(rowId) > 0) {
                const json = JSON.parse(userData);
                const data = {
                    userName: json.userName,
                    id: rowId
                }

                $(this).prop("disabled", true);
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8082/approveforum',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    // headers: { "Authorization": "Basic token" },//put token
                    success: function (resp) {
                        if (resp) {
                            resp = JSON.parse(resp);
                            if (resp.errorText && resp.errorText.length > 0) {
                                alert(resp.errorText);
                            }
                            else {
                                $(".row-id").val('0');
                                $(".actions").addClass("hide");
                                $(".row-hover").remove();
                            }
                        }
                        else {
                            alert("Something wrong");
                        }
                        $(this).prop("disabled", false);
                    }
                });
            }
            else {
                alert("Something wrong");
            }
        });

        //block forum
        $(document).on("click", ".block-forum", function () {
            let rowId = $(".row-id").val();
            let userData = localStorage.getItem("userData");

            if (userData && parseInt(rowId) > 0) {
                const json = JSON.parse(userData);
                const data = {
                    userName: json.userName,
                    id: rowId
                }

                $(this).prop("disabled", true);
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8082/blockforum',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    // headers: { "Authorization": "Basic token" },//put token
                    success: function (resp) {
                        if (resp) {
                            resp = JSON.parse(resp);
                            if (resp.errorText && resp.errorText.length > 0) {
                                alert(resp.errorText);
                            }
                            else {
                                $(".row-id").val('0');
                                $(".actions").addClass("hide");
                                $(".row-hover").remove();
                            }
                        }
                        else {
                            alert("Something wrong");
                        }
                        $(this).prop("disabled", false);
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

            if (e.key === 'Enter' || e.keyCode === 13) {
                if (userData) {
                    const json = JSON.parse(userData);
                    const text = item.val();

                    const data = {
                        postId: item.attr("data-post-id"),
                        userName: json.userName,
                        description: text
                    }

                    //$.ajax({
                    //    type: 'POST',
                    //    url: 'http://localhost:8082/addcomment',
                    //    data: JSON.stringify(data),
                    //    contentType: 'application/json',
                    //    // headers: { "Authorization": "Basic token" },//put token
                    //    success: function (resp) {
                    //        if (resp) {
                    //            resp = JSON.parse(resp);
                    //            if (resp.errorText && resp.errorText.length > 0) {
                    //                alert(resp.errorText);
                    //            }
                    //            else {
                    const html = '<div class="comment-box">' +
                        '<p class="comm-user">' + json.firstName + ' ' + json.lastName + ' ' + self.shortDateBySymbol(new Date()) + '</p>' +
                        '<div class="comm-cont">' + text + '</div>' +
                        '</div>';

                    item.closest('.post-data').find('.comment-container').append(html);
                    item.val('');
                    //            }
                    //        }
                    //        else {
                    //            alert("Something wrong");
                    //        }
                    //    }
                    //});
                }
                else {
                    alert("Something wrong");
                }

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
                $(".psy-footer").css("position", "absolute");
                $(".psy-footer").css("bottom", "0");
                if (json.role == 2 || json.role == 1) {
                    window.location.href = "index.html";
                } else {
                    $(".remove-admin-user").addClass("hide");
                }

                $.ajax({
                    type: 'GET',
                    url: 'http://localhost:8082/getAllAdmins/',
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
                $(".psy-footer").css("position", "absolute");
                $(".psy-footer").css("bottom", "0");
                if (json.role == 2) {
                    window.location.href = "index.html";
                }
                else if (json.role == 1) {
                    $(".remove-admin-user").addClass("hide");
                }

                //$.ajax({
                //    type: 'GET',
                //    url: 'http://localhost:8082/userslist/' + json.userName,
                //    contentType: 'application/json',
                //    //headers: { "Authorization": "Basic token" },//put token
                //    success: function (resp) {
                //        if (resp) {
                //            resp = JSON.parse(resp);

                resp = JSON.parse('[{"userId": 1,		"firstName": "firstname1",		"lastName": "lastName1",		"userName": "userName1",		"email": "email1",		"verification": false,		"role": 1	},	{		"userId": 2,		"firstName": "firstname2",		"lastName": "lastName2","userName": "userName2",		"email": "email2",		"verification": true,		"role": 1	},	{		"userId": 1,		"firstName": "firstname2",		"lastName": "lastName2",		"userName": "userName2",		"email": "email2",		"verification": true,		"role": 1	}]');


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

                //        }
                //    }
                //});
            }
            else if (uri.indexOf("postsforapproval") > 0) {
                $(".th").css("width", "450px");
                $(".psy-footer").css("position", "absolute");
                $(".psy-footer").css("bottom", "0");

                if (json.role == 2) {
                    window.location.href = "index.html";
                }

                //$.ajax({
                //    type: 'GET',
                //    url: 'http://localhost:8082/postsforapproval/' + json.userName,
                //    contentType: 'application/json',
                //    //headers: { "Authorization": "Basic token" },//put token
                //    success: function (resp) {
                //        if (resp) {
                //            resp = JSON.parse(resp);

                resp = JSON.parse('[{"postId":1, "title": "Vaernagir1","descriptionPath": "Harc1","imagePath": "nkar1","category": "KITCHEN","localDateTime": "2022-06-17T00:31:50.0227728"},{"postId":2, "title":"Vernagir2","descriptionPath":"Harc2","category": "KITCHEN","localDateTime": "2022-06-17T00:31:50.0227728"},{"postId":3, "title":"Vernagir3","descriptionPath":"Harc3","imagePath":"Nkar3","category": "KITCHEN","localDateTime": "2022-06-17T00:31:50.0227728"}]');


                resp.forEach(obj => {
                    let html = '<div class="row" data-id="' + obj.postId + '">' +
                        '<div class="td ds-cat" style="width:450px;">' + obj.category + '</div>' +
                        '<div class="td ds-title" style="width:450px;">' + obj.title + '</div>' +
                        '<div class="td" style="width:450px;">' + self.getDateByFormat(obj.localDateTime, ".") + '</div>' +
                        '<input type="hidden" class="pst-desc" value="' + obj.descriptionPath + '" />' +
                        '</div>';
                    $(".row-data").append(html);
                });

                //        }
                //    }
                //});
            }
            else if (uri.indexOf("myposts") > 0) {
                $(".th").css("width", "335px");
                $(".psy-footer").css("position", "absolute");
                $(".psy-footer").css("bottom", "0");

                //$.ajax({
                //    type: 'GET',
                //    url: 'http://localhost:8082/pypostslist/' + json.userName,
                //    contentType: 'application/json',
                //    //headers: { "Authorization": "Basic token" },//put token
                //    success: function (resp) {
                //        if (resp) {
                //            resp = JSON.parse(resp);

                resp = JSON.parse('[{"postId":1, "title": "Vaernagir1","descriptionPath": "Harc1","imagePath": "nkar1","category": "KITCHEN","localDateTime": "2022-06-17T00:31:50.0227728","status":"Created"},{"postId":2, "title":"Vernagir2","descriptionPath":"Harc2","category": "KITCHEN","localDateTime": "2022-06-17T00:31:50.0227728","status":"Waiting"},{"postId":3, "title":"Vernagir3","descriptionPath":"Harc3","imagePath":"Nkar3","category": "KITCHEN","localDateTime": "2022-06-17T00:31:50.0227728","status":"Blocked"},{"postId":4, "title":"Vernagir4","descriptionPath":"Harc4","imagePath":"Nkar4","category": "KITCHEN","localDateTime": "2022-06-17T00:31:50.0227728","status":"Created"}]');


                resp.forEach(obj => {
                    let html = '<div class="row" data-id="' + obj.postId + '">' +
                        '<div class="td ds-cat" style="width:335px;">' + obj.category + '</div>' +
                        '<div class="td ds-title" style="width:335px;">' + obj.title + '</div>' +
                        '<div class="td" style="width:335px;">' + self.getDateByFormat(obj.localDateTime, ".") + '</div>' +
                        '<div class="td ds-status" style="width:335px;">' + obj.status + '</div>' +
                        '<input type="hidden" class="pst-desc" value="' + obj.descriptionPath + '" />' +
                        '</div>';
                    $(".row-data").append(html);
                });

                //        }
                //    }
                //});
            }
            else if (uri.indexOf("posts") > 0) {

                //$.ajax({
                //    type: 'GET',
                //    url: 'http://localhost:8082/pypostslist/' + json.userName,
                //    contentType: 'application/json',
                //    //headers: { "Authorization": "Basic token" },//put token
                //    success: function (resp) {
                //        if (resp) {
                //            resp = JSON.parse(resp);

                resp = JSON.parse('[{"postId": 1,"firstName": "firstname1","lastName": "lastName1", "title": "Vaernagir1","descriptionPath": "Harc1","imagePath": "nkar1","category": "KITCHEN","localDateTime": "2022-06-17T00:31:50.0227728","status": "Created","comments": [{"id": 1,"firstName": "firstname1","lastName": "lastName1","localDateTime": "2022-06-17T00:31:50.0227728","comment": "Lorem Ipsum is simply dummy text of the printing and typesetting industry."},{"id": 2,"firstName": "firstname1","lastName": "lastName1","localDateTime": "2022-06-17T00:31:50.0227728","comment": "Lorem Ipsum is simply dummy text of the printing and typesetting industry."	}]},{"postId": 1,"firstName": "firstname1","lastName": "lastName1", "title": "Vaernagir1","descriptionPath": "Harc1","imagePath": "nkar1","category": "KITCHEN","localDateTime": "2022-06-17T00:31:50.0227728","status": "Created","comments": [{"id": 1,"firstName": "firstname1","lastName": "lastName1","localDateTime": "2022-06-17T00:31:50.0227728","comment": "Lorem Ipsum is simply dummy text of the printing and typesetting industry."},{"id": 2,"firstName": "firstname1","lastName": "lastName1","localDateTime": "2022-06-17T00:31:50.0227728","comment": "Lorem Ipsum is simply dummy text of the printing and typesetting industry."	}]}]');


                resp.forEach(obj => {
                    let html = '<div class="post-data">' +
                        '<div class="post-box" >' +
                        '<h3>' + obj.category + ' (' + obj.title + ')</h3>' +
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

                //        }
                //    }
                //});
            }
            else if (uri.indexOf("categories") > 0) {
                $(".th").css("width", "1340px");
                $(".psy-footer").css("position", "absolute");
                $(".psy-footer").css("bottom", "0");

                if (json.role != 0) {
                    window.location.href = "index.html";
                }

                $.ajax({
                    type: 'GET',
                    url: 'http://localhost:8082/allCategory/',
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
    }
};