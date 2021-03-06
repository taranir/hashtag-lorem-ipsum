console.log("clarifai");

function ClarifaiClient() {
  var client = this;
  client.cService = new ClarifaiService();
  // Victor visited me at 2:29pm and all I got was this stupid comment

  // get the Clarifai tags associated with an image
  client.getTags = function(imgUrl) {
    return client.cService.getApiToken().then(function(token) {
      var accessToken = token;
      var tagsResult = client.cService.getTags(imgUrl, accessToken);
      return tagsResult;
    });
  }
}

function ClarifaiService() {
  var service = this;

  // get the API Token, required to authenticate every subsequent request
  service.getApiToken = function() {
    var data = {
      grant_type: "client_credentials",
      client_id: "mSW-BldBZRMsbfpJC-Hb-pzwjrSsOTPpMjng1iTK",
      client_secret: "_d-0hn98HW1QlWb65sBvTrE-rAbIDbYoOhvGrKwY"
    };

    // send the POST request for API token
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

  // send the GET request for the image tags to Clarifai API
  service.getTags = function(imgUrl, accessToken) {
    // construct the URL
    var url = "https://api.clarifai.com/v1/tag/?url=" + imgUrl;

    // send the GET request
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

          // strip out spaces because Instagram hates spaces
          var tags = _.map(data.results[0].result.tag.classes, function(tag) {
            return tag.replace(/\s+/g, '')
          });
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

