// register all event handlers
function registerEventHandlers() {
    registrationEventHandlers();
    loginEventHandlers();
    rssEventHandlers();
}

/**
 * The entry point for the newsfeed application
 */
function init(debug) {
    registerEventHandlers();

    if (debug === true) logInUser('shayde', 'password');
}
