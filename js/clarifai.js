console.log("clarifai");

function ClarifaiClient() {
  var client = this;
  client.cService = new ClarifaiService();
  // Victor visited me at 2:29pm and all I got was this stupid comment

  client.getTags = function() {
    return client.cService.getApiToken().then(function(token) {
      var accessToken = token;
      var imgUrl = "http://www.clarifai.com/img/metro-north.jpg";
      var tagsResult = client.cService.getTags(imgUrl, accessToken);
      return tagsResult;
    });
  }
}

function ClarifaiService() {
  var service = this;

  service.getApiToken = function() {
    var data = {
      grant_type: "client_credentials",
      client_id: "mSW-BldBZRMsbfpJC-Hb-pzwjrSsOTPpMjng1iTK",
      client_secret: "_d-0hn98HW1QlWb65sBvTrE-rAbIDbYoOhvGrKwY"
    };

    var tokenPromise = new Promise(function(resolve, reject) {
      $.ajax({
        method: "POST",
        url: "https://api.clarifai.com/v1/token/",
        data: data,
        success: function(data) {
          resolve(data.access_token);
        },
        error: function(err) {
          reject(JSON.parse(err.responseText).error);
        }
      });
    });
    return tokenPromise;
  }

  service.getTags = function(imgUrl, accessToken) {
    var url = "https://api.clarifai.com/v1/tag/?url=" + imgUrl;
    var tagsPromise = new Promise(function(resolve, reject) {
      $.ajax({
        method: "GET",
        url: url,
        headers: {
          Authorization: "Bearer " + accessToken
        },
        success: function(data) {
          if (data.status_code !== "OK") {
            reject("uh oh, something's wrong with Clarifai :( check back in a hour or so");
            return;
          }
          var tags = data.results[0].result.tag.classes;
          var probs = data.results[0].result.tag.probs;

          resolve({
            tags: tags,
            probs: probs
          });

        },
        error: function(err) {
          if (err.status === 400) {
            reject(JSON.parse(err.responseText).status_msg);
            return;
          }
          reject("Invalid URL");
        }
      });
    });
    return tagsPromise;
  }
}

