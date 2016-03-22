'use strict';


angular.module('bimoliveApp')
/**
 * Controller for admin view
 */
.controller('AdminCtrl', ['$http', '$routeParams', 'MainService', '$location', '$window', function ($http, $routeParams, MainService, $location, $window) {
    
    // if the user has not log in, redirect back and show the log in modal
    if (!MainService.getIsLogin()) {
        $location.url($window.history.back(1));
        $('#loginModal').modal('show'); 
    }

    var appScope = this;
    this.currentRequest = {};
    this.requests = [];

    // First time get all the questions from the database
    getRequests(-1);
    function getRequests(idUser) {
        
        $http( {
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/admin/teacherapplications',
            headers: {
                    'Content-Type': undefined
            },
            data: {
                idAdmin: MainService.getCurrentUser().idUser,
                idUser: idUser
            }
        } )
        .success(function(data, status) {
            appScope.requests = data;
        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
    }
     
    // Set selected question
    this.setCurrentRequest = function (request, index) {
        this.currentRequest = request;
        this.requestIndex = index;
        if (request.applyStatus === 'new') {
            // request.status = 'read'; // change the question's status to read once the teacher views it.   
            this.processRequest('read');
        }
    };

    this.processRequest = function (applyStatus) {
        $http( {
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/admin/applicationdecision',
            headers: {
                    'Content-Type': undefined
            },
            data: {
                idAdmin: MainService.getCurrentUser().idUser,
                idUser: this.currentRequest.idUser,
                applyStatus: applyStatus,
                email: this.currentRequest.email
            }
        } )
        .success(function(data, status) {
            if (data.result) {
                appScope.currentRequest.applyStatus = applyStatus;
            }
        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
    };

    this.declineRequest = function () {
        $http( {
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/admin/applicationdecision',
            headers: {
                    'Content-Type': undefined
            },
            data: {
                idAdmin: MainService.getCurrentUser().idUser,
                idUser: this.currentRequest.idUser,
                applyStatus: 'decline',
                email: this.currentRequest.email
            }
        } )
        .success(function(data, status) {
            if (data.result) {
                appScope.requests.splice(appScope.requestIndex, 1);
            }
        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
    };
}]);
