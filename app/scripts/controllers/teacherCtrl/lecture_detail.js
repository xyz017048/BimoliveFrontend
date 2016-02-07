'use strict';


angular.module('bimoliveApp')
/**
 * Controller for teacher view
 */
.controller('LectureDetailCtrl', ['$http', '$routeParams', 'MainService', function ($http, $routeParams, MainService) {
    
    var appScope = this;
    this.currentLecture = {};
   
    if(MainService.getCurrentUser().roleLevel === 2)
    {
        $http( { 
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/singlelecture',
            headers: {
                'Content-Type': undefined
            },
            data: {
                idLecture: $routeParams.idLecture,
                idUser: MainService.getCurrentUser().idUser
            }
        } )
        
        .success(function(data, status) {
            appScope.currentLecture = data;
        })
        
        .error(function(data, status) {
        });
    }
        
}]);