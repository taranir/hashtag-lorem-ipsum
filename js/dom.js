console.log("dom!");
var instaClient = new InstagramClient();
var clClient = new ClarifaiClient();
injectButton();

$(document).ready(function() {
  $('body').on('click', function() {
    setTimeout(function() {
      if (!buttonExists()) {
        injectButton();
      }
    }, 500);
  });
});

function buttonExists() {
  var buttonArray = $(".-cx-PRIVATE-PostInfo__commentCreator").next(".hashtag-button");
  return buttonArray.length > 0;
}

var dumbTags = {
  "nobody": true,
  "men": true,
  "people": true,
  "group": true,
  "one": true,
  "two": true,
  "three": true,
  "four": true,
  "five": true,
  "page": true,
  "dark": true,
  "stilllife": true,
  "women": true,
  "adult": true,
  "business": true,
  "set": true,
  "portrait": true,
  "facialexpression": true,
  "building": true,
  "young": true,
  "mammal": true,
  "affection": true,
  "contemporary": true,
  "isolated": true,
  "work": true,
  "background": true
};


function filterClarifaiTags(tags) {
  return _.filter(tags, function(tag) {
    if (dumbTags[tag]) {
      return false;
    } else {
      return true;
    }
  });
}

function injectButton() {
  var hashtagButton = $("<div/>");
  hashtagButton
    .addClass("hashtag-button")
    .css("background-image", "url(" + chrome.extension.getURL("icon.png") + ")")
    .attr("title", "Generate hashtags!");

  hashtagButton.on('click', function(e) {
    var commentBox = $(e.target).parent()
      .find(".-cx-PRIVATE-PostInfo__commentCreatorInput");
    var imageLink = instaClient.getImageLink($(e.target));
    var imageURLPromise = instaClient.getImageURL(imageLink)
      .then(function(imageURL) {
        var tagsPromise = clClient.getTags(imageURL);
        tagsPromise.then(function(tags) {
          var cTags = tags.tags;
          if (cTags.length > 5) {
            cTags = filterClarifaiTags(cTags);
            cTags = _.slice(cTags, 0, 6);
          }
          instaClient.getHashtags(cTags).then(function(result) {
            commentBox.val(result);
          });
        });
      });
    
  });
  $(".-cx-PRIVATE-PostInfo__commentCreator").after(hashtagButton);
}
