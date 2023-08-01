// Always go to new posts from the forums but not from the threads
var alllinks = document.getElementsByTagName("a");
if (document.location.href.indexOf("https://foros.3dgames.com.ar/forums/") != -1) {
	for (var i = 0; i < alllinks.length; i++) {
		if (alllinks[i].href.indexOf("https://foros.3dgames.com.ar/threads/") != -1) {
			alllinks[i].href = alllinks[i].href + "?goto=newpost"
		}
	}
}
