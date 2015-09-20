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
  "page": true,
  "dark": true,
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
    console.log("clicked");
    var commentBox = $(e.target).parent()
      .find(".-cx-PRIVATE-PostInfo__commentCreatorInput");
    var imageLink = instaClient.getImageLink($(e.target));
    var imageURLPromise = instaClient.getImageURL(imageLink)
      .then(function(imageURL) {
        var tagsPromise = clClient.getTags(imageURL);
        tagsPromise.then(function(tags) {
          var cTags = tags.tags;
          console.log("tags", cTags);
          if (cTags.length > 5) {
            cTags = filterClarifaiTags(cTags);
            cTags = _.slice(cTags, 0, 6);
          }
          console.log("sliced tags", cTags);
          instaClient.getHashtags(cTags).then(function(result) {
            console.log("hashtag result", result);
            commentBox.val(result);
          });
        });
      });
    
  });
  $(".-cx-PRIVATE-PostInfo__commentCreator").after(hashtagButton);
}
