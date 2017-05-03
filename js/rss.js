function rssEventHandlers() {
    var techcrunch = document.getElementById('techcrunch');
    var espn = document.getElementById('espn');
    
    techcrunch.onchange = function() {
        if (this.checked) addSelectedFeed('techcrunch');
        else removeSelectedFeed('techcrunch');
    }

    espn.onchange = function() {
        if (this.checked) addSelectedFeed('espn');
        else removeSelectedFeed('espn');
    }
}

getFeedTemplate(
    function(template) {
        console.log(template);
    }
)

function getFeedTemplate(callback) {
    var templateXhr = new XMLHttpRequest();
    templateXhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            callback(this.responseText);
        }
    }

    templateXhr.open('GET', './templates/rss_story.html');
    templateXhr.send();
}

function refreshFeeds() {
    var allFeeds = [];
    var username = getUsername();
    var userData = getUserData(username);
    userData.selected_feeds.forEach(
        function(feed) {
            getFeedContent(feed,
                function(feedData) {
                    allFeeds = allFeeds.concat(feedData);
                }
            );
        }
    );
}

function getFeedContent(feed, callback) {
    var espnUrl = 'http://www.espn.com/espn/rss/news';
    var techcrunchUrl = 'http://feeds.feedburner.com/TechCrunch/';

    var rssUrl = '';
    switch(feed) {
        case 'espn':
            rssUrl = espnUrl;
            break;
        case 'techcrunch':
            rssUrl = techcrunchUrl;
            break;
        default:
            rssUrl = 'INVALID';
    }

    // return empty array if feed is invalid
    if (rssUrl === 'INVALID') callback([]);

    var rssXhr = new XMLHttpRequest();
    rssXhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var xmlDoc = this.responseXML;

            // get all channels
            var rssChannels = xmlDoc.getElementsByTagName('channel');
            // make it an array
            rssChannels = Array.prototype.slice.call(rssChannels);

            var feedData = [];
            rssChannels.forEach(function (element) {
                var rssChannel = {
                    title: element.getElementsByTagName('title')[0].childNodes[0].nodeValue,
                    link: element.getElementsByTagName('link')[0].childNodes[0].nodeValue,
                    stories: []
                };
                // get all items
                var items = element.getElementsByTagName('item');
                items = Array.prototype.slice.call(items);
                items.forEach(function (item) {
                    var story = {
                        title:          item.getElementsByTagName('title')[0].childNodes[0].nodeValue,
                        description:    item.getElementsByTagName('description')[0].childNodes[0].nodeValue,
                        link:           item.getElementsByTagName('link')[0].childNodes[0].nodeValue,
                        published_date: item.getElementsByTagName('pubDate')[0].childNodes[0].nodeValue
                    };
                    rssChannel.stories.push(story);
                });
                feedData.push(rssChannel);
            });
            callback(feedData);
        }
    };

    rssXhr.open('GET', rssUrl);
    rssXhr.send();
}
