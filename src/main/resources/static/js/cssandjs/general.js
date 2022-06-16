jQuery(document).ready(function () {
    generalFunctions.events();
});

//var globalForTest = '{"firstName": "Artur","lastName": "Hayrapetyan","userName": "ahayrapetyan","email": "ahayrapetyan@gmail.com","errorText": null,"userId": 1,"status": 1,"verification": true,"role": 2}';

var generalFunctions = {
    events: function () {
        var self = this;
        let data = localStorage.getItem("userData");
        if (data) {
            const json = JSON.parse(data);
            console.log(json)
            $.ajax({
                type: 'GET',
                url: 'http://localhost:8082/user/' + json.sub,
                contentType: 'application/json',
                headers: { "Authorization": "Basic token" },//put token
                success: function (resp) {

                    //resp = globalForTest;

                    if (resp) {
                        resp = JSON.parse(resp);
                        console.log(resp)
                        if (resp.errorText && resp.errorText.length > 0) {
                            data = null;
                        }
                        else {
                            data = resp;
                            localStorage.setItem("userData", JSON.stringify(resp));
                        }
                    }
                    else {
                        data = null;
                    }
                    self.isAuthorized(data);
                }
            });

        }
        else {
            self.logOut();
        }

        $(document).on("click", ".header-logout", function () {
            self.logOut();
        });

    },
    isAuthorized: function (data) {
        var self = this;

        if (data) {
            if (data.status != 1) {
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
    logOut: function () {
        var self = this;
        localStorage.removeItem("userData");
        $(".mnAdmins").addClass("hide");
        $(".mnUsers").addClass("hide");
        $(".mnPosts-for-approval").addClass("hide");
        $(".mnMy-posts").addClass("hide");
        $(".mnPosts").addClass("hide");
        $(".header-is-auth").addClass("hide");
        $(".header-no-auth").removeClass("hide");
    },
    logIn: function (data) {
        var self = this;

        $(".header-no-auth").addClass("hide");
        $(".header-is-auth").removeClass("hide");
        $(".head-fullname").text(data.firstName + " " + data.lastName);

        if (data.role == 2) {
            $(".mnAdmins").removeClass("hide");
            $(".mnUsers").removeClass("hide");
            $(".mnPosts-for-approval").removeClass("hide");
            $(".mnMy-posts").removeClass("hide");
            $(".mnPosts").removeClass("hide");
        }
        else if (data.role == 1) {
            $(".mnAdmins").addClass("hide");
            $(".mnUsers").removeClass("hide");
            $(".mnPosts-for-approval").removeClass("hide");
            $(".mnMy-posts").removeClass("hide");
            $(".mnPosts").removeClass("hide");
        }
        else if (data.role == 0) {
            $(".mnAdmins").addClass("hide");
            $(".mnUsers").addClass("hide");
            $(".mnPosts-for-approval").addClass("hide");
            if (data.verification) {
                $(".mnMy-posts").removeClass("hide");
            }
            $(".mnPosts").removeClass("hide");
        }
    }
};