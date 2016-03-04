'use strict';


angular.module('bimoliveApp')
/**
 * Controller for teacher view
 */
.controller('AllCtrl', ['$http', 'MainService', '$location', '$window', function ($http, MainService, $location, $window) {
    
    // if the user has not log in, redirect back and show the log in modal
    if (!MainService.getIsLogin()) {
        $location.url($window.history.back(1));
        $('#loginModal').modal('show'); 
    }
        
    var appScope = this;
    
    this.liveVideos = [];
    // getLiveLectures (videoInfo)
    this.getLiveVideos = function () {
        $http( { 
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/livevideos',
            headers: {
                'Content-Type': undefined
            }
        } )
        .success(function(data, status) {
            // put video to UI
            appScope.liveVideos = data;
        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
    };
    
    this.replayVideos = [];
    this.getReplayVideos = function () {
        $http( { 
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/replayvideos',
            headers: {
                'Content-Type': undefined
            }
        } )
        .success(function(data, status) {
            // put video to UI
            appScope.replayVideos = data;
        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
    };
}]);