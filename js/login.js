function loginEventHandlers() {
    var loginButton = document.getElementById('loginButton');
    var loginModal = document.getElementById('loginModal');
    var loginCancel = document.getElementById('loginCancel');
    var loginSubmit = document.getElementById('loginSubmit');
    var loginFailedDiv = document.getElementById('loginFailedDiv');
    var loginForm = document.forms['loginUser'];

    loginButton.onclick = function() {
        // clear existing input data
        clearElementValue(loginForm['username']);
        clearElementValue(loginForm['password']);

        // hide validation error
        hideElement(loginFailedDiv);

        // display the login modal
        showElementBlock(loginModal);
    }

    loginCancel.onclick = function() {
        hideElement(loginModal);
    }

    loginSubmit.onclick = function() {
        var username = loginForm['username'].value;
        var password = loginForm['password'].value;
        logInUser(username, password);
    }
}

function logInUser(username, password) {
    var isValidLogin = validateLogin(username, password);
    if (isValidLogin !== true) {
        return showElementBlock(loginFailedDiv);
    }
    hideElement(loginModal);
    var userData = getUserData(username);
    userIsLoggedIn(userData);
}

// Once the user is logged in, 
// retrieve user data and set up their page
function userIsLoggedIn(userData) {
    var usernameTextElementsArray = Array.prototype.slice.call(document.getElementsByClassName('username-text'));
    var loggedOutElementsArray = Array.prototype.slice.call(document.getElementsByClassName('logged-out'));
    var loggedInElementsArray = Array.prototype.slice.call(document.getElementsByClassName('logged-in'));

    // set all username-text class elements inner text to username
    usernameTextElementsArray.forEach(
        function(element) {
            setElementText(element, userData.username);
        }
    );

    // hide logged-out elements
    loggedOutElementsArray.forEach(
        function(element) {
            hideElement(element);
        }
    );

    // show logged-in elements
    loggedInElementsArray.forEach(
        function(element) {
            showElementBlock(element);
        }
    );
}

// validate the username and password of a given user
function validateLogin(username, password) {
    var userPassword = localStorage.getItem(username);
    if (userPassword === password) return true;
    return false;
}
