var storiesList = [];
function rssEventHandlers() {
    var techcrunch = document.getElementById('techcrunch');
    var espn = document.getElementById('espn');
    
    techcrunch.onchange = function() {
        if (this.checked) addSelectedFeed('techcrunch');
        else removeSelectedFeed('techcrunch');
        refreshFeeds();
    }

    espn.onchange = function() {
        if (this.checked) addSelectedFeed('espn');
        else removeSelectedFeed('espn');
        refreshFeeds();
    }
}


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
setTimeout(refreshFeeds, 1000);

function updateFeed(newStoriesList) {
    storiesList = newStoriesList;
    getFeedTemplate(
        function(template) {
            var templateDiv = document.getElementById('templateDiv');
            templateDiv.innerHTML = '';
            storiesList.forEach(function(story) {
                var templateElement = document.createElement('html');
                templateElement.innerHTML = template;
                var templateDocument = document.createDocumentFragment();
                templateDocument.appendChild(templateElement);

                var titleElement = templateDocument.getElementById('story_title');
                var descriptionElement = templateDocument.getElementById('story_description');
                var publishedDateElement = templateDocument.getElementById('story_published_date');

                titleElement.innerHTML = '<a href="' + story.link + '">' + story.title + '</a>';
                descriptionElement.innerHTML = story.description;

                var feedFlares = descriptionElement.getElementsByClassName('feedflare');
                var feedFlaresArray = Array.prototype.slice.call(feedFlares);
                feedFlaresArray.forEach(function(feedFlare) {
                    feedFlare.innerHTML = '';
                });
                var imgTags = descriptionElement.getElementsByTagName('img');
                var imgTagsArray = Array.prototype.slice.call(imgTags);
                imgTagsArray.forEach(function(imgElement) {
                    if (imgElement.attributes.height.value === '1'|| imgElement.attributes.width.value === '1') {
                        imgElement.innerHTML = '';
                    } else {
                        imgElement.style.display = 'block';
                        imgElement.style.float = 'left';
                        imgElement.style.paddingRight = '5px';
                        imgElement.style.width = '25%';
                        imgElement.style.height = 'auto';
                    }
                })

                publishedDateElement.innerText = story.published_date;
                templateDiv.appendChild(templateElement);
            });
        }
    );
}

function comparePublishDates(storyA, storyB) {
    var storyADate = new Date(storyA.published_date);
    var storyBDate = new Date(storyB.published_date);
    if (storyADate > storyBDate) return -1;
    if (storyADate < storyBDate) return  1;
    return 0;
}

function refreshFeeds() {
    var username = getUsername();
    var userData = getUserData(username);
    feedData = [];
    var newStoriesList = [];
    userData.selected_feeds.forEach(
        function(feed) {
            getFeedContent(feed,
                function(feedData) {
                    feedData.forEach(function(feed) {
                        feed.stories.forEach(function(story) {
                            story.sourcelink = feed.link;
                            story.sourcetitle = feed.title;
                        });
                        newStoriesList = newStoriesList.concat(feed.stories);
                        newStoriesList = newStoriesList.sort(comparePublishDates);
                    })
                }
            );
        }
    );
    setTimeout(function() {
        updateFeed(newStoriesList);
    }, 10000);
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
