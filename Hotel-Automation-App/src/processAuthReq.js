/**
 * Used to save info about user that is connected.
 * We identify user in loginRequest, but we also need it in securityCodeRequest.
 */
var user;


// ------------- methods --------------- //

/**
 * Used to perform login request.
 * @param {*} req 
 * @param {*} res 
 * @param {*} users  - all users from database.
 */
async function loginRequest(req, res, users) {
    var _username = req.body.username;
    var _password = req.body.password;
    // users.find({}, function(err, _uu)
    // {
    //     _uu.forEach(function(__user) {
    //         console.log(__user.username);
    //       });
        
    // });

    // username in unique, so we will get one or zero user.

    let _user =  await users.findOne({ username: _username });
    if (_user != null && _user.password === _password) {
        console.log("User and pass exist!");
        user = _user;
        // should check the role
        checkRole(res);
        return true;
    }
    else 
    {
        console.log("Not such user or pass!");
        res.render("login");
        return false;
    }
}

/**
 *  Used to render the page based on user role
 * @param {*} res
 */
function checkRole(res) {
    if (user.role === 0) {
        // is admin
        res.redirect("security-code");
        return;
        // make check for security code;
    }
    if (user.role === 1) {
        // is cleaning staff
        // page that cleaning staff have no access to the web app
        return;
    }

    res.redirect("home-page");
    // res.render("home-page", {
    //     fullName: user.firstName + " " + user.lastName
    // });
    return;
}

/**
 * Used to verify the security code for staff.
 * @param {*} req 
 * @param {*} res 
 */
function securityCodeRequest(req, res) {
    var _securityCode = req.body.securityKey;
    console.log("security code: " + _securityCode);

    if (user.securityCode == _securityCode) {
        // is admin
        res.redirect("rooms");
        return;
    }

    console.log("security code is not correct!");
    res.redirect("security-code");
}

function getUser()
{
    return user;
}

module.exports = {
    loginRequest,
    securityCodeRequest,
    getUser
};
