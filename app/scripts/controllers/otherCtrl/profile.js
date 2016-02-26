'use strict';



angular.module('bimoliveApp')
/**
 * Controller for profile view
 */
.controller('ProfileCtrl', ['MainService', '$http', function (MainService, $http) {
    
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
            if(data.result) {
            	alert('Apply success! Waiting for approve');
            } else {
                console.log('success but got ' + data.result);
            }
	    })
	    .error(function (data, status) {
	    });
    };
}]);