'use strict';


angular.module('bimoliveApp')
/**
 * Controller for teacher view
 */
.controller('FollowCtrl', ['$http', 'MainService', '$location', '$window', function ($http, MainService, $location, $window) {
    
    // if the user has not log in, redirect back and show the log in modal
    if (!MainService.getIsLogin()) {
        $location.url($window.history.back(1));
        $('#loginModal').modal('show'); 
    }
    
    var appScope = this;
    this.followedCourses = [];
    
    this.getFollowedCourses = function () {
        $http({
            method: 'POST',
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/followedcourses',
            headers: {
                'Content-Type': undefined
            },
            data: {
                idUser: MainService.getCurrentUser().idUser
            }
        })

        .success(function (data, status) {
            if (data.length > 0) {
                appScope.followedCourses = data;
            }
        })

        .error(function (data, status) {
        });
    };
        
}]);