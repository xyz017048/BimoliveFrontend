'use strict';



angular.module('bimoliveApp')
/**
 * Controller for profile view
 */
.controller('ProfileCtrl', ['MainService', '$http', '$location', '$window', '$scope', function (MainService, $http, $location, $window, $scope) {
    
    // if the user has not log in, redirect back and show the log in modal
    if (!MainService.getIsLogin()) {
        $location.url($window.history.back(1));
        $('#loginModal').modal('show'); 
    }
    
    var appScope = this;
    this.showLoader = false;
    this.user = JSON.parse(JSON.stringify(MainService.getCurrentUser())); // Copy the user object from main service 
    
    this.updateToServer = function () {
        alert(this.user.email + ' ' +
                this.user.username + ' ');
    };
    
    this.resetData = function () {
        this.user = JSON.parse(JSON.stringify(MainService.getCurrentUser())); // Reset the user object
    };

    this.teacherApply = function () {
    	$http({
	        method: 'POST',
	        url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacherapply',
	        headers: {
	            'Content-Type': undefined
	        },
	        data: this.user
	    })
        .success(function (data, status) {
            $('#applyToTeachModal').modal('hide'); 
            if (data.result) {
                alert('Apply success! Waiting for approve');
                MainService.setCurrentUser(appScope.user);
            } else {
                console.log('success but got ' + data.result);
            }
	    })
	    .error(function (data, status) {
	    });
    };
    
    $('#profile').change(function (event) {
        var files = event.target.files;
        var profile_pic = files[0];
        appScope.user.profile = MainService.upload(profile_pic, 'profile');
        $scope.$apply();
    });
    
    $('#resume').change(function (event) {
        var files = event.target.files;
        var resume = files[0];
        appScope.user.resume = MainService.upload(resume, 'resume');
    });
    
}]);