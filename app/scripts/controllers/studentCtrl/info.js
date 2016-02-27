'use strict';


angular.module('bimoliveApp')
/**
 * Controller for teacher view
 */
.controller('InfoCtrl', ['$http', 'MainService', '$location', '$window', function ($http, MainService, $location, $window) {
    
    // if the user has not log in, redirect back and show the log in modal
    if (!MainService.getIsLogin()) {
        $location.url($window.history.back(1));
        $('#loginModal').modal('show'); 
    }
        
}]);