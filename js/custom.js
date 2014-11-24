$(window).load(function () {
	$("#content").load("ajax-pages/welcome.html");
	$("#welcomeNo").on("click", function() {
		$("#content").load("ajax-pages/thank-you.html");
	});
});