// ==UserScript==
// @name         YouTube: Remove short/long videos
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove too short or too long videos from your YouTube's recommendation
// @author       Timothy (kuronek0zero)
// @namespace    https://github.com/kuronekozero/youtube-remove-short-long-videos/tree/main
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

   // You can enable both max and min duration filtering by uncommenting
   // minDuration and maxDuration. Or you can uncomment only one of this lines
   // to filter videos by only one variable.
   //
   // For now only minDuration filtering is enabled.

    var minDuration = "1:40"; // Minimum duration

    // Uncomment the next line to enable Max duration filtering
    // var maxDuration = "30:00"; // Maximum duration

    var timeToSeconds = function(time) {
        var parts = time.split(':').map(Number);
        if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else {
            return parts[0] * 60 + parts[1];
        }
    }


    var getVideoRows = function() {
        var contents = document.querySelector(
            'div#contents[class="style-scope ytd-rich-grid-renderer"]'
        );
        return contents.childNodes;
    }

    var processVideoRow = function(row) {
        var videos = row.querySelectorAll('ytd-rich-item-renderer');
        for (var i=0; i<videos.length; i++){
            var video = videos[i];
            var durationMatch = video.querySelector('span#text.style-scope.ytd-thumbnail-overlay-time-status-renderer');
            if (durationMatch) {
                var durationText = durationMatch.textContent.trim();
                var durationSeconds = timeToSeconds(durationText);
                if ((typeof minDuration !== 'undefined' && durationSeconds < timeToSeconds(minDuration)) ||
                    (typeof maxDuration !== 'undefined' && durationSeconds > timeToSeconds(maxDuration))) {
                    video.remove();
                }
            }
        }
    }

    var run = function() {
        var videoRows = getVideoRows();
        for (var i=0; i<videoRows.length; i++){
            processVideoRow(videoRows[i]);
        }
    }

    // without this line of code script may not work in firefox.
    setTimeout(run, 500);

    setInterval(run, 500);
})();
