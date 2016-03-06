'use strict';



angular.module('bimoliveApp')
/**
 * Controller for profile view
 */
.controller('ProfileCtrl', ['MainService', '$http', '$location', '$window', function (MainService, $http, $location, $window) {
    
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
        document.getElementById('profile-img').src = this.user.profile;
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
                if (appScope.user.applyStatus === '') {
                    appScope.user.applyStatus = 'new';
                }
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
        
        // read the image and display it on page
        var reader = new FileReader();
        reader.onload = function(event) {
            var dataUri = event.target.result,
                img     = document.getElementById('profile-img');
            img.src = dataUri;
        };
        reader.onerror = function(event) {
            console.error('File could not be read! Code ' + event.target.error.code);
        };
        reader.readAsDataURL(profile_pic);
    });
    
    $('#resume').change(function (event) {
        var files = event.target.files;
        var resume = files[0];
        appScope.user.resume = MainService.upload(resume, 'resume');
    });
    
}]);