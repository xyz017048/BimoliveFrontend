'use strict';



angular.module('bimoliveApp')
/**
 * Controller for main view
 */
.controller('MainCtrl', function () {
    
    // this is fake! place holder for the real function
    function getVideos () {
        var array = [];
        for (var i = 0; i < 11; i++) {
            var video = { "name": "video #" + i,
                "presenter": "Smith" + i,
                "id": i
            };
            array.push(video);
        }
        return array;
    }
    
    this.videoInfo = getVideos();
});
