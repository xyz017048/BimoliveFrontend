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
    
    this.resetData = function () {
        this.user = JSON.parse(JSON.stringify(MainService.getCurrentUser())); // Reset the user object
        document.getElementById('profile-img').src = this.user.profile;
    };
    
    this.updateData = function () {
        $http({
            method: 'POST',
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/accountupdate',
            headers: {
                'Content-Type': undefined
            },
            data: this.user
        })
        .success(function (data, status) {
            if (data.result) {
                alert('Account Updated!');
                MainService.setCurrentUser(appScope.user);
                location.reload();
            } else {
                console.log('success but got ' + data.result);
            }
        })
        .error(function (data, status) {
        });
    };

    this.applicationValid = function() {
        if (!this.user.firstName || this.user.firstName === null || this.user.firstName === '') {
            alert('Please enter your first name');
            return false;
        } else if (!this.user.lastName || this.user.lastName === null || this.user.lastName === '') {
            alert('Please enter your last name');
            return false;
        } else if (!this.user.resume || this.user.resume === null || this.user.resume === '') {
            alert('Please select your resume');
            return false;
        } else {
            return true;
        }
    };

    this.teacherApply = function() {
        if (!this.applicationValid()) {
            return;
        }
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

    this.resetApplicationForm = function() {
        var originalUser = JSON.parse(JSON.stringify(MainService.getCurrentUser()));
        this.user.resume = originalUser.resume;
        this.user.introWords = originalUser.introWords;
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
        $('#view-resume').attr('href', appScope.user.resume);
    });

    $('#resume-modal').change(function (event) {
        var files = event.target.files;
        var resume = files[0];
        appScope.user.resume = MainService.upload(resume, 'resume-modal');
        $('#view-resume-modal').attr('href', appScope.user.resume);
    });
}]);