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
    this.user = Object.create(MainService.getCurrentUser()); // Copy the user object from main service 
    
    this.updateToServer = function () {
        alert(this.user.email + ' ' +
                this.user.username + ' ');
    };
    
    this.resetData = function () {
        this.user = Object.create(MainService.getCurrentUser()); // Reset the user object
    };

    this.teacherApply = function () {
    	$http({
	        method: 'POST',
	        url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacherapply',
	        headers: {
	            'Content-Type': undefined
	        },
	        data: JSON.stringify(this.user.__proto__)
	    })
        .success(function (data, status) {
            $('#applyToTeachModal').modal('hide'); 
            if (data.result) {
            	alert('Apply success! Waiting for approve');
            } else {
                console.log('success but got ' + data.result);
            }
	    })
	    .error(function (data, status) {
	    });
    };
    
    
    $("#file").change(function (event) {
        var files = event.target.files;
        this.file = files[0];
        
        AWS.config.update({ accessKeyId: 'AKIAIJG57SRTCKPYBGJA', secretAccessKey: '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' });
        AWS.config.region = 'us-west-2';
        var bucket = new AWS.S3({ params: { Bucket: 'bimolive-pictures' } });
        if(this.file) {
            var params = { Key: this.file.name, ContentType: this.file.type, Body: this.file, ServerSideEncryption: 'AES256', ACL: 'public-read'};
        
            bucket.putObject(params, function(err, data) {
            if(err) {
                // There Was An Error With Your S3 Config
                alert(err.message);
                return false;
            }
            else {
                // Success!
                alert('Upload Done');
            }
            })
            .on('httpUploadProgress',function(progress) {
                // Log Progress Information
                console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
                });
        }
        else {
            // No File Selected
            alert('No File Selected');
        }
    });
    
}]);