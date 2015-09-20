console.log("dom!");
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
    $(e.target).parent()
      .find(".-cx-PRIVATE-PostInfo__commentCreatorInput")
      .val(getHashtags());
  });
  $(".-cx-PRIVATE-PostInfo__commentCreator").after(hashtagButton);
}

function getHashtags() {
  var tags = ["snow", "skating"];
  var instaClient = new InstagramClient();
  var allHashtagsPromise = getAllHashtags(tags, instaClient);
  allHashtagsPromise.then(function(allHashtags) {
    var mostCommonHashtags = getMostCommonHashtags(allHashtags);
    var result = _.difference(mostCommonHashtags, tags);
    return result;
  })
}

function getAllHashtags(tags, instaClient) {
  var photosPromises = [];
  for (var i = 0; i < tags.length; i++) {
    var promise = instaClient.getPhotosFromTag(tags[i]);
    photosPromises.push(promise);
  }
  var photosPromise = new Promise(
    function(resolve, reject) {
      Promise.all(photosPromises).then(function(photoData) {
        var photos = photoData.reduce(function(prev, curr, index, array) {
          return prev.concat(curr.data);
        }, []);
        var hashtagsPromise = getHashtagsFromPhotos(photos, instaClient);
        resolve(hashtagsPromise);
      }).catch(function(err) {
        console.log(err);
        reject(err);
      });
    });
  return photosPromise;

}

function getHashtagsFromPhotos(photos, instaClient) {
  var promises = [];
  for (var j = 0; j < photos.length; j++) {
    var photo = photos[j];
    var promise = instaClient.getTagsFromPhoto(photo);
    promises.push(promise);
  }
  var hashtagsPromise = new Promise(
    function(resolve, reject) {
      Promise.all(promises).then(function(hashtagData) {
        var hashtags = hashtagData.reduce(function(prev, curr, index, array) {
          curr = _.filter(curr, hashtagFilter);
          return prev.concat(curr);
        }, []);
        resolve(hashtags);
      }).catch(function(err) {
        console.log(err);
        reject(err);
      });
    });
  return hashtagsPromise;
}

// filter out hashtags we don't want (ie too short)
function hashtagFilter(hashtag) {
  return hashtag.length > 2;
}

function getMostCommonHashtags(hashtags) {
  var frequencyTable = _.countBy(hashtags, function(hashtag) {
    return hashtag;
  });
  var sortedHashtags = _.sortBy(Object.keys(frequencyTable), function(hashtag) {
    return frequencyTable[hashtag];
  })
  var mostCommonHashtags = _.slice(sortedHashtags, -30);
  return mostCommonHashtags;
}