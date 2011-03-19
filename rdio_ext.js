(function($){
  var RDIO = RDIO || {};
  var globalTimer;
	RDIO = {
	  init: function(){
  		if($('#full_screen_back').length > 0){
  			RDIO.helpers.setDivHeight($('#full_screen_back'));
  			$('#full_screen_back').slideUp("fast");
  		}
  		else{
  		  $(document.body).append('<div id="full_screen_back"><div class="song_info_row"><div id="track_album"></div></div>' + 
  		  '<div class="song_info_row"><div id="track_artist"></div></div><div class="song_info_row"> <div id="track_name"></div></div></div>');
  		  $('#inner_container').css('position', 'relative').css('z-index', '9999');
  		}
  		
  		//Listen for resize to change height of overshadow.
  		$(window).resize(function() {
        RDIO.helpers.setDivHeight($('#full_screen_back'));
      });
      
      //Check for text changes
      setTimeout(RDIO.helpers.pollChange, 10e3);      
  		RDIO.bindEvents();
  		var testPerm = "YES";
		},/* End init */
		bindEvents: function bindEvents(){
		  /* bind a keypress */
      $(window).bind('keypress', function(event){
        $('#player_container').fadeIn("slow"); 
        if($('#full_screen_back:visible').length > 0){
          RDIO.helpers.playerFadeoutTimeOut();
        }
        /*Check for shift-8 (*) or shift-f combo */
  		  if (event.which === 42) {
  				if($('#full_screen_back').css("display") == "none"){
  				  $('#full_screen_back').css("top", $('body').scrollTop());
  					RDIO.helpers.setDivHeight($('#full_screen_back'));
  					$('#full_screen_back').slideDown("fast");
					
  					if($('#notification').length > 0)
  					  $('#notification').remove();			
  					/*call initAnims */
  					RDIO.helpers.setUpRDIOExt();
  				}
  				else{
  				  //Call exit functionality
  					RDIO.helpers.cleanUpTime();
  				}
  			}
  		});
  		$('#full_screen_back').click(function(){
  		  //call exit functionality
        RDIO.helpers.cleanUpTime();
  		});
		},
		liveEvents: function liveEvents(){
		},
		helpers: {
  		/*Set div passed in to max height of window */
  		setDivHeight: function(divH){
  			$('#'+divH.attr('id')).css("height", $(window).height());
  		},	
  		/*Setups up the scrolling animations */
  		setUpRDIOExt: function(){
  		  RDIO.helpers.songTextSetup();
  			$('.song_info_row div').each(function(){
  				var obj = $(this);
  				RDIO.helpers.animAddClass(obj);
  			});

  			$('body').css('overflow', 'hidden');
				globalTimer = setTimeout(function(){RDIO.helpers.playerFadeoutCheck();}, 4e3);

  		  $('body').bind('mousemove', function(){
  		    RDIO.helpers.playerFadeoutTimeOut();
  		  });
  		},
  		playerFadeoutTimeOut: function(){
  		  clearTimeout(globalTimer);
		    globalTimer = setTimeout(function(){RDIO.helpers.playerFadeoutCheck();}, 4e3);
		    if($('#player_container:animated').length == 0){
          $('#player_container').fadeIn("slow"); 
		    }
  		},
  		playerFadeoutCheck: function(){
  		  $('#player_container').fadeOut('slow');
  		  
  		  if($('body').css('overflow') !== 'hidden')
  		    $('body').css('overflow', 'hidden');
  		},
		  songTextSetup: function(){
		    RDIO.helpers.removeDivClasses();
		    $('#track_name').text($('#playerNowPlayingTitle a').text());
  		  $('#track_artist').text($('#playerNowPlayingArtist a').text());
  		  $('#track_album').text($('#playerNowPlayingAlbum a').text());
  		  $('.song_info_row div').each(function(){
  				var obj = $(this);
  				RDIO.helpers.animAddClass(obj);
  			});
		  },
  		animAddClass: function (obj){
  		  obj.attr('class', '');
  			var classes = ['vert_active3', 'vert_active2', 'vert_active', 'horiz_active', 'horiz_active2'];
  			var x = Math.floor(Math.random() * (classes.length));
        obj.addClass(classes[x]);
        //obj.css("left", Math.floor(Math.random() * $('body').width)).css("top", Math.floor(Math.random() * $('body').height));
  		},
  		pollChange: function(){
  		  var orig_text_setup = $('#playerNowPlayingTitle a').text();
        
        pollit = function(orig_text){
          var new_text = $('#playerNowPlayingTitle a').text();
    		  if(new_text.length > 0){
    		    if(orig_text !== new_text){
    		      RDIO.helpers.songTextSetup();
    		    }
    		  }
    		  setTimeout(function(){pollit($('#track_name').text())}, 5e3);
    		}
    		setTimeout(function(){pollit(orig_text_setup)}, 5e3);
  		},
  		updateChecks: function(){
  		  
  		},
  		cleanUpTime: function(){
  		  $('#full_screen_back').slideUp("fast");
  		  $(document.body).append("<div id='notification'>Shift-8 to bring that back</div>");
  		  $('#notification').delay(3000).fadeOut();
  		  $('body').css('overflow', 'auto');
  		  $('body').unbind('mousemove');
  		  clearTimeout(globalTimer);
  		  $('#player_container').fadeIn("slow");
  		  RDIO.helpers.removeDivClasses();
  		},
  		removeDivClasses: function(){
  		  $('.song_info_row div').each(function(){
	        $(this).removeAttr("class");
  		  });
  		}
    }
  };

  window.RDIO = RDIO;
  $(document).ready(RDIO.init);	
})(jQuery);