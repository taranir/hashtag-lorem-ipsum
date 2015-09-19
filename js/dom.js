console.log("dom!");

(function() {
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
			.val("stuff");
	});

	$(".-cx-PRIVATE-PostInfo__likeButton").after(hashtagButton);
})();