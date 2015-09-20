(function() {
  function Instagram() {
    var serv = this;
    serv.client_id = "762fb6b552d640ca94a68c9d57dd436b";
    serv.baseTagRequestUrl = "https://api.instagram.com/v1/tags/";


    // ajax get that returns promise
    serv.ajaxGet = function(url) {
      var promise = new Promise(function(resolve, reject) {
          $.ajax({
            method: "GET",
            crossDomain: true,
            dataType: 'jsonp',
            url: url,
            success: function(data) {
              resolve(data.data);
            },
            error: function(error) {
              reject(error);
            }
          })
        });
      return promise;
    };

    // returns a promise
    serv.getTagsFromClarifai = function(clarifaiTag) {
      var url = serv.baseTagRequestUrl + "search?q=" + clarifaiTag + "&client_id=" + serv.client_id;
      return serv.ajaxGet(url);
    };

    serv.getPhotosFromTag = function(instagramTags) {
      var url = serv.baseTagRequestUrl + instagramTag["name"] + "/media/recent?client_id=" + serv.client_id;
      return serv.ajaxGet(url);
    };

    serv.getTagsFromPhoto = function(instagramPhoto) {
      if (instagramPhoto["type"] == "image") {
        return instagramPhoto["tags"];
      }
      return [];
    };
  }
  
  var tagsList = [];
  var clarifaiList = ["snow", "apple"];

  var i = new Instagram();
  var url = i.baseTagRequestUrl + "search?q=" + "snow" + "&client_id=" + i.client_id;
  i.ajaxGet(url);

  var that = this;

  for (var j = 0; j < clarifaiList.length; j++) {
    var clarifaiTag = clarifaiList[j];
    i.getTagsFromClarifai(clarifaiTag)
    .then(function(tags) {
      
    })
    .catch(function(error) {
      console.log(error);
    });
  }
  
})();