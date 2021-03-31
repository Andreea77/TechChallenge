/**
 * Used to save info about user that is connected.
 * We identify user in loginRequest, but we also need it in securityCodeRequest.
 */
var user;

function loginRequest(req, res, users) {
    var _username = req.body.username;
    var _password = req.body.password;

    // username in unique, so we will get one or zero user.
    users.findOne({ username: _username }, function (err, _user) {
        if (err) {
            console.log("ERROR in [loginRequest]: " + err);
            res.render("login");
            return;
        }
        // find user in database
        if (_user != null && _user.password === _password) {
            console.log("Login Success!");
            user = _user;
            // should check the role
            checkRole(res, _user);
            return;
        }
        else 
        {
            console.log("Not such user or pass!");
            res.render("login");
        }
    });
}

function checkRole(res, user) {
    if (user.role === 0) {
        // is admin
        res.render("security-code");
        return;
        // make check for security code;
    }
    if (user.role === 1) {
        // is cleaning staff
        // page that cleaning staff have no access to the web app
        return;
    }

    res.render("home-page"); // guest
    console.log("guest");
}

function securityCodeRequest(req, res) {
    var _securityCode = req.body.securityKey;
    console.log("security code: " + _securityCode);

    if (user.securityCode == _securityCode) {
        // is admin
        res.render("rooms");
        return;
    }

    console.log("security code is not correct!");
    res.render("security-code");
}

module.exports = {
    loginRequest,
    securityCodeRequest
};
