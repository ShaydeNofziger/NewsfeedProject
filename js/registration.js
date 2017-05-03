function registrationEventHandlers() {
    var registerButton = document.getElementById('registerButton');
    var registerCancel = document.getElementById('registerCancel');
    var registerSubmit = document.getElementById('registerSubmit');
    var registerModal = document.getElementById('registerModal');
    var registerForm = document.forms['registerUser'];
    var registerFormValidationDiv = document.getElementById('registerFormValidationDiv');
    var registerFormValidationList = document.getElementById('registerFormValidationList');

    registerButton.onclick = function() {
        clearElementValue(registerForm['username']);
        clearElementValue(registerForm['password']);
        clearElementValue(registerForm['confirmPassword']);

        // hide and clear existing validation issues
        hideElement(registerFormValidationDiv);
        clearElementHTML(registerFormValidationList);

        // show modal
        showElementBlock(registerModal);
    }
    registerCancel.onclick = function() {
        hideElement(registerModal);
    }
    registerSubmit.onclick = function() {
        // clear existing validation issues
        hideElement(registerFormValidationDiv);
        clearElementHTML(registerFormValidationList);

        var validationIssues = validateRegistrationForm();
        if (validationIssues.length !== 0) {
            validationIssues.forEach(
                function(issue) {
                    var listItem = document.createElement('li');
                    listItem.innerText = issue;
                    registerFormValidationList.appendChild(listItem);
                }
            );
            registerFormValidationDiv.style.display = 'block';
        } else {
            var username = registerForm['username'].value;
            var password = registerForm['password'].value;
            registerNewUser(username, password);
            var newUserData = {
                username: username,
                favorites: [],
                selected_feeds: []
            }
            setUserData(username, newUserData);
            hideElement(registerModal);
        }
    }
}

function validateRegistrationForm() {
    var registerForm = document.forms['registerUser'];
    var username = registerForm['username'].value;
    var password = registerForm['password'].value;
    var confirmPassword = registerForm['confirmPassword'].value;
    var validationIssues = [];

    // check required fields
    if (username === null || username === '')               validationIssues.push('Username is required');
    if (password === null || password === '')               validationIssues.push('Password is required');
    if (confirmPassword === null || confirmPassword === '') validationIssues.push('Confirm Password is required');

    // make sure password fields match
    if (password !== confirmPassword) validationIssues.push('"Password" and "Confirm Password" field must match');
    
    // does user already exist?
    if (localStorage.getItem(username) !== null) validationIssues.push('User: "' + username + '" already exists!');

    return validationIssues;
}

// stores the username and password in localstorage
function registerNewUser(username, password) {
    localStorage.setItem(username, password);
}
