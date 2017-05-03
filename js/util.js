function hideElement(element) {
    element.style.display = 'none';
}

function showElementBlock(element) {
    element.style.display = 'block';
}

function showElementInline(element) {
    element.style.display = 'inline';
}

function clearElementText(element) {
    element.innerText = '';
}

function clearElementHTML(element) {
    element.innerHTML = '';
}

function clearElementValue(element) {
    element.value = '';
}

function setElementText(element, text) {
    element.innerText = text;
}

function getUsername() {
    return document.getElementById('username').textContent;
}

// retrieve user data by username
function getUserData(username) {
    var storageKey = 'userdata_' + username;
    var userData = localStorage.getItem(storageKey);
    if (userData === null) return {};
    return JSON.parse(userData);
}

function setUserData(username, data) {
    var storageKey = 'userdata_' + username;
    var dataString = JSON.stringify(data);
    localStorage.setItem(storageKey, dataString);
}

// add the feed to the selected_feed list if it isn't already
function addSelectedFeed(feed) {
    var username = getUsername();
    var userData = getUserData(username);
    var positionInArray = userData.selected_feeds.indexOf(feed);
    if (positionInArray === -1) userData.selected_feeds.push(feed);
    setUserData(username, userData);
}

function removeSelectedFeed(feed) {
    var username = getUsername();
    var userData = getUserData(username);
    var positionInArray = userData.selected_feeds.indexOf(feed);
    if (positionInArray !== -1) userData.selected_feeds.splice(positionInArray, 1);
    setUserData(username, userData);
}
