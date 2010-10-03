/*	
 * jQuery contentfader 1.0
 * http://www.kopfpit.de/wordpress/goodies/jquery-plugin-contentfader/
 * Copyright (c) 2010 Clemens Tietze
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */

(function($) {
	$.fn.contentfader = function(params) {
		$.extend(true, {}, $.fn.contentfader.defaults, params);
		var params = $.extend(true, {}, $.fn.contentfader.defaults, params);

		var availableGroups = new Array();
		var processedGroups = new Array();

		var GROUP_ID = 'group_id_';

		var count     = 0;
		var left      = 0;
		var actGroup  = 1;
		var lastGroup = 0;
		var nextGroup = 0;

		var ul = $(this);
		var li = $("li", ul);
		
		// initial rearrange
		$.each(li, function(i, val) {
			if (i % 3 == 0) {
				left   = 0;
				count += 1;
				$(ul).append('<li><ul id="' + GROUP_ID + count + '"></ul></li>');
				elUlAct = $('#' + GROUP_ID + count);

				if (count == 1) {
					processedGroups.push(count);
				}
				if (count > 1) {
					elUlAct.hide();
					availableGroups.push(count);
				}
			}
			else {
				left += params.itemWidth;
			}

			elUlAct.parent().css({position: 'absolute', width: '100%', top: 0, left: 0});
			elUlAct.append($(val));
            $(val).css({width: params.itemWidth});
		});

		$(ul).bind("play", function() {
			swapFade = setInterval(function() {
				lastGroup = actGroup;
				nextGroup = getNextGroup();
				fadeOut(lastGroup);

				var timeout  = (params.crossfade) ? 0 : params.speed;
				window.setTimeout("fadeIn(" + nextGroup + ")", timeout);
			}, params.interval);
		});

		$(ul).bind("pause", function() {
			clearTimeout(swapFade);
		})

		$(ul).hover(
			function() { $( ul ).trigger("pause"); },
			function() { $( ul ).trigger("play"); }
		);

		fadeIn = function(nextGroup) {
			$('#' + GROUP_ID + nextGroup).animate({opacity: "show"}
				, params.speed, params.easing, function(){} );
			actGroup = nextGroup;
		};

		fadeOut = function(actGroup) {
			$('#' + GROUP_ID + actGroup).animate({opacity: "hide"}
				, params.speed, params.easing, function(){});
		};

		getNextGroup = function() {
			var index = -1;
			var len   = availableGroups.length;

			// reset fader to start again
			if(len == 0) {
				availableGroups = processedGroups.slice(0, processedGroups.length);
				processedGroups = new Array();

				// remove last groupId, cause its already visible
				var pos = getItemRow(availableGroups, lastGroup);

				availableGroups.splice(pos, 1);
				processedGroups.push(lastGroup);
				len = availableGroups.length;
			}

			var rand = Math.floor(Math.random() * len);
			var next = availableGroups.splice(rand, 1);
			processedGroups.push(next);

			return next;
		}

		getItemRow = function (haystack, needle) {
			var pos = -1
			for (i=0; i<haystack.length; i++) {
				if (haystack[i] == needle) {
					pos = i;
					break;
				}
			}
			return pos;
		}

		jQuery(ul).trigger("play");
	}

	$.fn.contentfader.defaults = {
		items: 3 // max items to show
		,itemWidth: 320
		,crossfade: true // true | false
		,easing: 'swing' // swing | linear
		,speed: 3000 // in milliseconds
		,interval: 8000 // in milliseconds
	}
})(jQuery);
