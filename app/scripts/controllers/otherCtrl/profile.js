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
    this.cropper = '';
    this.isCropped = false;
    this.init = function() {
        this.showLoader = false;
        this.user = JSON.parse(JSON.stringify(MainService.getCurrentUser())); // Copy the user object from main service
        if (this.user.applyStatus !== '' && this.user.applyStatus !== 'approve') {
            // TODO: need a way to get apply status
        }
    }

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
                MainService.setCurrentUser(appScope.user);
                // location.reload();
            } else {
                console.log('success but got ' + data.result);
            }
        })
        .error(function (data, status) {
        });
    };

    this.regenerateKey = function() {
        $http({
            method: 'POST',
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/generatekey',
            headers: {
                'Content-Type': undefined
            },
            data: {
                idUser: this.user.idUser,
            }
        })
        .success(function (data, status) {
            appScope.user.keyString = data.keyString;
            MainService.setCurrentUser(appScope.user);
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
        } else if (!this.user.company || this.user.company === null || this.user.company === '') {
            alert('Please enter your company\'s name');
            return false;
        } else if (!this.user.jobTitle || this.user.jobTitle === null || this.user.jobTitle === '') {
            alert('Please enter your job');
            return false;
        } else if (!this.user.introWords || this.user.introWords === null || this.user.introWords === '') {
            alert('Please enter your introduction');
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
                appScope.user.applyStatus = 'new';
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
        // appScope.user.profile = MainService.upload(profile_pic, 'profile');
        
        // read the image and display it on page
        var reader = new FileReader();
        reader.onload = function(event) {
            var dataUri = event.target.result,
                img     = document.getElementById('crop-image');
            img.src = dataUri;
            $('#cropModal').modal('show');
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

    this.crop = function () {
        var canvas = appScope.cropper.getCroppedCanvas();
        var src = canvas.toDataURL();
        appScope.croppedBlob = appScope.dataURItoBlob(src);
        appScope.cropper.destroy();        
        appScope.isCropped = true;
        document.getElementById('crop-image').src = src;
        document.getElementById('profile-img').src = src;        
        // $('#cropModal').modal('hide');
    };

    this.uploadCoursePic = function () {
        appScope.user.profile = MainService.upload(appScope.croppedBlob, 'profile');
        $('#cropModal').modal('hide');        
        appScope.updateData();
        appScope.isCropped = false;
    };
    $('#cropModal').on('shown.bs.modal', function (e) {
        var img = document.getElementById('crop-image');
        if (appScope.cropper !== '') {
            appScope.cropper.destroy();
        }
        appScope.cropper = new Cropper(img, {
            aspectRatio: 1 / 1
        });
    })
    $('#cropModal').on('hidden.bs.modal', function (e) {
        if (appScope.cropper !== '') {
            appScope.cropper.destroy();
        }
    })
    this.dataURItoBlob = function(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var bb = new Blob([ab], {type: 'image/png'});
        return bb;
    };
}]);