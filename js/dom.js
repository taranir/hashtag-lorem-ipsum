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

function injectButton() {
  var hashtagList = ["dog", "cute", "adorbs", "cutenessoverload"];
  var hashtagButton = $("<div/>");
  hashtagButton
    .addClass("hashtag-button")
    .css("background-image", "url(" + chrome.extension.getURL("icon.png") + ")")
    .attr("title", "Generate hashtags!");

  hashtagButton.on('click', function(e) {
    console.log("clicked");
    var commentBox = $(e.target).parent()
      .find(".-cx-PRIVATE-PostInfo__commentCreatorInput");
    var imageLink = instaClient.getImageLink(e.target);
    var imageURLPromise = instaClient.getImageURL(imageLink)
      .then(function(imageURL) {
        var tagsPromise = clClient.getTags(imageURL);
        tagsPromise.then(function(tags) {
          console.log("tags", tags.tags);
          instaClient.getHashtags(tags.tags).then(function(result) {
            console.log("hashtag result", result);
            commentBox.val(result);
          });
        });
      });
    
  });
  $(".-cx-PRIVATE-PostInfo__commentCreator").after(hashtagButton);
}
