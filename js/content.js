// Always go to new posts from the forums but not from the threads
let alllinks = document.getElementsByTagName("a");
if (document.location.href.indexOf("https://foros.3dgames.com.ar/forums/") != -1) {
	for (let i = 0; i < alllinks.length; i++) {
		if (alllinks[i].href.indexOf("https://foros.3dgames.com.ar/threads/") != -1) {
			alllinks[i].href = alllinks[i].href + "?goto=newpost"
		}
	}
	// try to retrieve "temas patrocinados"

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
if (document.getElementById("header-right").innerHTML) {
	document.getElementById("header-right").innerHTML = document.getElementById("header-right").innerHTML + '<div id="activity"><a href="https://profiles.3dgames.com.ar/user/notifications" rel="external"><img src="https://profiles.3dgames.com.ar/assets/userbar/radar.png"></a></div><div id="pms"><a href="https://profiles.3dgames.com.ar/user/Inbox/messages" rel="external"><img src="https://profiles.3dgames.com.ar/assets/userbar/messages.png"></a></div>';
}

// add activity and pms count if available
function getNotificationsCount() {
	let token = getToken()
	let notifURL = "https://foros.3dgames.com.ar/papi/notifications/get_count?_=" + token;
	//console.log("Notification URL: ", notifURL);

	fetch(notifURL).then(response => {
		if (response.ok) {
			response.text().then(data => {
				let activitycount = data.match(/new_activity_count = (.*)/);
				let pmcount = data.match(/last_pm_id = (.*)/);
				//console.log(data);
				// activity
				if (activitycount != null && activitycount[1] != null) {
					//console.log("activitycount: ", activitycount[1]);
					//return activitycount[1];
					document.getElementById("activity").innerHTML = '<span class="notify-activity">' + activitycount[1] + '</span>' + document.getElementById("activity").innerHTML;
				}
				// pms
				if (pmcount[1] != null && pmcount[1] != 0) {
					//console.log("pmcount: ", pmcount[1]);
					//return activitycount[1];
					document.getElementById("pms").innerHTML = '<span class="notify-pms">1</span>' + document.getElementById("pms").innerHTML;
				}
			})
		}
	});
}

getNotificationsCount();

function getToken() {
	let headhtml = document.getElementsByTagName('head')[0].innerHTML;
	let sectoken = headhtml.match(/SECURITYTOKEN = "(.*)"/);
	//console.log("sectoken: ", sectoken);
	if (sectoken != null) {
		console.log("SECURITYTOKEN: ", sectoken[1]);
		return sectoken[1];
	}
}


document.addEventListener('readystatechange', event => {
// Wait until we can read the html we want, should be complete insted of interactive but *it works tm*
	if (event.target.readyState === 'complete') {
	
	}
});


/*
<li class="threadbit dot hot new ui-li-has-icon ui-btn ui-btn-up-d ui-btn-icon-right ui-li ui-li-has-alt ui-li-has-count" id="thread_title_804812" data-theme="d">
<div class="ui-btn-inner ui-li ui-li-has-alt" aria-hidden="true">
	<div class="ui-btn-text">
		<div class="ui-li-icon threadstatus"></div>
		<h3 class="ui-li-heading">
		<a href="threads/804812-el-dolar-blue-da-otro-salto-a-8-05-pesos-9-05-10-05-11-05-12-05-2000?goto=newpost" id="thread_title_804812" class="title unread ui-link-inherit">
			texto test thread patrocinado
		</a>
			<img src="" alt="">	
		</h3>
		<p class="ui-li-desc">Ultimo Mensaje Por <a class="username online popupctrl ui-link" href="members/793821-newsman" title=""><strong>PATROCINADO</strong></a> 00-00-00 <span class="time">00:00 PM</span></p>
		<span class="ui-li-count ui-btn-up-c ui-btn-corner-all">0</span>
	</div>
	<span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span>
</div>
</li>
*/


//li class="threadbit
//class="threadinfo"


/*
https://codepen.io/sosuke/pen/Pjoqqp
#ce7e00
filter: invert(44%) sepia(100%) saturate(423%) hue-rotate(358deg) brightness(98%) contrast(110%);
*/

/* after every div class="postrow"
<div class="me-gusta-wrapper ">
        <div class="me-gusta">
              
<div id="dbtech_thanks_actions_25026638" class="like">
<div style="display:inline-block; background:url(/images/megusta_off.png) no-repeat scroll left center transparent !important; width:19px; height:19px; margin:0; padding:0 5px 0 0px; vertical-align:middle;" title=""></div>
<span class="likes">2</span>
</div>

<ul class="liked_by" id="dbtech_thanks_entries_25026638"><li class="bold">Me gusta</li>

<li>Aldo_73</li><li>Sgt Saunders</li>
</ul>

              
                <div class="text" data-contenttype="post" data-button="likes" data-postid="25026638"><a href="javascript://" name="dbtech_thanks_button" data-postid="25026638" data-button="likes" title=""> Me gusta</a></div>
              
        </div>
      </div>
*/
