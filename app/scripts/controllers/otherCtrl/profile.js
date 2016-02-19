'use strict';



angular.module('bimoliveApp')
/**
 * Controller for profile view
 */
.controller('ProfileCtrl', ['MainService', function (MainService) {
    
    this.user = Object.create(MainService.getCurrentUser()); // Copy the user object from main service 
    
    this.updateToServer = function () {
        alert(this.user.email + ' ' +
                this.user.username + ' ');
    };
    
    this.resetData = function () {
        this.user = '';  
        this.user = Object.create(MainService.getCurrentUser()); // Reset the user object
    };
}]);