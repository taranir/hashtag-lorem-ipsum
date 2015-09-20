function InstagramClient() {
  var client = this;
  client.instaService = new InstagramService();


  client.getHashtags = function(tags) {
    var allHashtagsPromise = client.getAllHashtags(tags);
    var hashtagResultPromise = new Promise(
      function(resolve, reject) {
        allHashtagsPromise.then(function(allHashtags) {
          var mostCommonHashtags = client.getMostCommonHashtags(allHashtags);
          var result = _.difference(mostCommonHashtags, tags);
          result.reverse();
          result = _.slice(result, -30);
          result = client.processHashtagList(result);
          resolve(result);
        });
      });
    return hashtagResultPromise;

  }

  client.processHashtagList = function(list) {
    var result = "#" + list[0];
    for (var i = 1; i < list.length; i++) {
      result = result + " #" + list[i];
    }
    return result;
  }

  client.getAllHashtags = function(tags) {
    var photosPromises = [];
    for (var i = 0; i < tags.length; i++) {
      var promise = client.instaService.getPhotosFromTag(tags[i]);
      photosPromises.push(promise);
    }
    var photosPromise = new Promise(
      function(resolve, reject) {
        Promise.all(photosPromises).then(function(photoData) {
          var photos = photoData.reduce(function(prev, curr, index, array) {
            return prev.concat(curr.data);
          }, []);
          var hashtagsPromise = client.getHashtagsFromPhotos(photos);
          resolve(hashtagsPromise);
        }).catch(function(err) {
          console.log(err);
          reject(err);
        });
      });
    return photosPromise;

  }

  client.getHashtagsFromPhotos = function(photos) {
    var promises = [];
    for (var j = 0; j < photos.length; j++) {
      var photo = photos[j];
      var promise = client.instaService.getTagsFromPhoto(photo);
      promises.push(promise);
    }
    var hashtagsPromise = new Promise(
      function(resolve, reject) {
        Promise.all(promises).then(function(hashtagData) {
          var hashtags = hashtagData.reduce(function(prev, curr, index, array) {
            curr = _.filter(curr, client.hashtagFilter);
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
  client.hashtagFilter = function(hashtag) {
    return hashtag.length > 2;
  }

  client.getMostCommonHashtags = function(hashtags) {
    var frequencyTable = _.countBy(hashtags, function(hashtag) {
      return hashtag;
    });
    var sortedHashtags = _.sortBy(Object.keys(frequencyTable), function(hashtag) {
      return frequencyTable[hashtag];
    })
    var mostCommonHashtags = _.slice(sortedHashtags, -100);
    return mostCommonHashtags;
  }
}

function InstagramService() {
  var serv = this;
  serv.clientID = "762fb6b552d640ca94a68c9d57dd436b";
  serv.baseTagRequestURL = "https://api.instagram.com/v1/tags/";


  // ajax get that returns promise
  serv.ajaxGet = function(url) {
    return $.ajax(url, {
          success: function(data, status, jqXHR) {
            //console.log(data.data);
          },
          error: function(jqXHR, status, error) {
            console.log(error);
          }
        });
  };

  // // returns a promise
  // serv.getHashtagsFromTag = function(clarifaiTag) {
  //   var url = serv.baseTagRequestURL + "search?q=" + clarifaiTag + "&client_id=" + serv.clientID;
  //   return serv.ajaxGet(url);
  // };

  serv.getPhotosFromTag = function(tag) {
    var url = serv.baseTagRequestURL + tag + "/media/recent?client_id=" + serv.clientID;
    return serv.ajaxGet(url);
  };

  serv.getTagsFromPhoto = function(instagramPhoto) {
    if (instagramPhoto["type"] == "image") {
      return instagramPhoto["tags"];
    }
    return [];
  };
}