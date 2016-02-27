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
   
    if(MainService.getCurrentUser().roleLevel === 2)
    {
        $http( { 
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/singlelecture',
            headers: {
                'Content-Type': undefined
            },
            data: {
                idUser: MainService.getCurrentUser().idUser
            }
        } )
        
        .success(function(data, status) {
            appScope.currentLecture = data;
            if (data.status === 'finish' || data.status === 'replay') {
                appScope.isFinished = true; 
            }
        })
        
        .error(function(data, status) {
        });
    }
        
}]);