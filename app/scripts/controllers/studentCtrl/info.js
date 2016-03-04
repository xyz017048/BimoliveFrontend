'use strict';


angular.module('bimoliveApp')
/**
 * Controller for teacher view
 */
.controller('InfoCtrl', ['$routeParams', '$http', 'MainService', '$location', '$window', function ($routeParams, $http, MainService, $location, $window) {
    
    // if the user has not log in, redirect back and show the log in modal
    if (!MainService.getIsLogin()) {
        $location.url($window.history.back(1));
        $('#loginModal').modal('show'); 
    }
        
    var appScope = this;
    this.course = {};
    this.course.lectureList = [];
    this.getCourse = function () {
        $http( { 
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/singlecourse',
            headers: {
                'Content-Type': undefined
            },
            data: { 
                idCourse: $routeParams.courseid, 
                idUser: MainService.getCurrentUser().idUser
            }
        } )
        .success(function(data, status) {
            appScope.course = Object.create(data);
            appScope.getLectureList();
        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
    };
   
    this.getLectureList = function () {
        $http( { 
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/lectures',
            headers: {
                'Content-Type': undefined
            },
            data: { 
                idCourse: $routeParams.courseid
            }
        } )
        .success(function(data, status) {
            appScope.course.lectureList = data;

        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
    };
    
    this.teacher = {};
    this.getTeacher = function () {
        $http( { 
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/followedcourses',
            headers: {
                'Content-Type': undefined
            },
            data: { 
                idCourse: $routeParams.teacherid
            }
        } )
        .success(function(data, status) {
            appScope.teacher = Object.create(data);
        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
    };
    
}]);