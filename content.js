// Always go to new posts from the forums but not from the threads
let alllinks = document.getElementsByTagName("a");
if (document.location.href.indexOf("https://foros.3dgames.com.ar/forums/") != -1) {
	for (let i = 0; i < alllinks.length; i++) {
		if (alllinks[i].href.indexOf("https://foros.3dgames.com.ar/threads/") != -1) {
			alllinks[i].href = alllinks[i].href + "?goto=newpost"
		}
	}
} else {
	// add search to threads only
	let injsearch = document.getElementById('postlist');
	if (injsearch != null) {
		// find the thread id and the security token
		const form = document.querySelector('form[name="quick_reply"]');
		const tokenval = form.elements['securitytoken'].value;
		const threadidval = form.elements['t'].value;
    //console.log("quick reply values: " + tokenval + threadidval);
		injsearch.insertAdjacentHTML('beforebegin', '<div id="inj_search" class="inj_search"><form action="search.php" method="post"><ul><input type="text" name="query" class="searchbox" placeholder="Buscar en thread..."><input type="submit" class="button" value="Búsqueda"></ul><input type="hidden" name="s" value=""><input type="hidden" name="do" value="process"><input type="hidden" name="search_type" value="1"><input type="hidden" name="contenttype" value="vBForum_Post"><input type="hidden" name="securitytoken" value="' + tokenval + '"><input type="hidden" name="searchthreadid" value="' +  threadidval + '"></form></div>');
	}
	// fix suscribe button in threads only
	let getSubsB = document.getElementsByClassName('ui-btn ui-btn-up-c ui-btn-inline ui-btn-icon-notext ui-corner-right ui-controlgroup-last');
  let lowerSubsB = getSubsB[1];
  if (lowerSubsB != null) {
		lowerSubsB.setAttribute('class', 'newreplylink ui-btn ui-btn-up-d ui-btn-inline ui-btn-icon-right ui-corner-right');
	}
	// fix un-suscribe button in threads only
	var getUnSubsB = document.getElementsByClassName('ui-btn ui-btn-up-e ui-btn-inline ui-btn-icon-notext ui-corner-right ui-controlgroup-last');
  var lowerUnSubsB = getUnSubsB[1];
  if (lowerUnSubsB != null) {
		lowerUnSubsB.setAttribute('class', 'newreplylink ui-btn ui-btn-up-d ui-btn-inline ui-btn-icon-right ui-corner-right');
	}
}

// add notifications and messages next to username
document.getElementById("header-right").innerHTML = document.getElementById("header-right").innerHTML + '<a href="https://profiles.3dgames.com.ar/user/notifications" rel="external"><img src="https://profiles.3dgames.com.ar/assets/userbar/radar.png"></a> <br> <a href="https://profiles.3dgames.com.ar/user/Inbox/messages" rel="external"><img src="https://profiles.3dgames.com.ar/assets/userbar/messages.png"></a>';
