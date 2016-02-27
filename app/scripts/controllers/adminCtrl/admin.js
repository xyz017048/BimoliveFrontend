'use strict';


angular.module('bimoliveApp')
/**
 * Controller for admin view
 */
.controller('AdminCtrl', ['$http', '$routeParams', 'MainService', '$location', function ($http, $routeParams, MainService, $location) {
    
    var appScope = this;

    function getRequests(lastId) {
        
        $http( {
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/getrequests',
            headers: {
                    'Content-Type': undefined
            },
            data: {
                idUser: MainService.getCurrentUser().idUser,
                idRequest: lastId
            }
        } )
        .success(function(data, status) {
            for (var q in data) {
                appScope.requests.push(data[q]);
                lastId = data[q].idRequest;
            }
            setTimeout(function () {
                getRequests(lastId);
            }, 1000);
        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
    }

    this.requests = [];
    appScope.requests.push({name: 'xueyangh', content: 'aaa'});
    appScope.requests.push({name: 'xueyangh', content: 'aaa'});
    var lastId = -1;
    // First time get all the questions from the database
    getRequests(lastId);
     
    // Set selected question
    this.setCurrentRequest = function (request, index) {
        this.currentRequest = request;
        this.requestIndex = index;
        if (request.status === 'new') {
            // request.status = 'read'; // change the question's status to read once the teacher views it.   
            this.processRequest('read');
        }
    };

    this.processRequest = function (status) {
        $http( {
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/processrequest',
            headers: {
                    'Content-Type': undefined
            },
            data: {
                idUser: MainService.getCurrentUser().idUser,
                idRequest: this.currentRequest.idRequest,
                status:  status 
            }
        } )
        .success(function(data, status) {
            appScope.currentRequest.status = status;
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
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/processrequest',
            headers: {
                    'Content-Type': undefined
            },
            data: {
                idUser: MainService.getCurrentUser().idUser,
                idRequest: this.currentRequest.idRequest,
                status:  'decline'  
            }
        } )
        .success(function(data, status) {
            appScope.requests.splice(appScope.requestIndex, 1);
        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
    };

    this.approveRequest = this.processRequest('approve');      

    this.currentLecture = {};
   
    if(MainService.getCurrentUser().roleLevel === 0)
    {
        $http( { 
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/admin',
            headers: {
                'Content-Type': undefined
            },
            data: {
                idUser: MainService.getCurrentUser().idUser
            }
        } )
        .success(function(data, status) {
            appScope.currentRequest = data;
        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
    }
}]);
