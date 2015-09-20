function InstagramClient() {
  var serv = this;
  serv.clientID = "762fb6b552d640ca94a68c9d57dd436b";
  serv.baseTagRequestURL = "https://api.instagram.com/v1/tags/";


  // ajax get that returns promise
  serv.ajaxGet = function(url) {
    return $.ajax(url, {
          success: function(data, status, jqXHR) {
            console.log(data.data);
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

