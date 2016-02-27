'use strict';


angular.module('bimoliveApp')
/**
 * Controller for teacher view
 */
.controller('CourseDetailCtrl', ['$http', '$routeParams', 'MainService', '$location', '$window', function ($http, $routeParams, MainService, $location, $window) {
    
    // if the user has not log in, redirect back and show the log in modal
    if (!MainService.getIsLogin()) {
        $location.url($window.history.back(1));
        $('#loginModal').modal('show'); 
    }
    
    this.idCourse = $routeParams.idCourse;
    
    function newLectureObject() {
        return {'topic': '',
        'intro': '',
        'level': '',
        'scheduleDate': '',
        'startTime': '',
        'endDate': ''};
    }
    
    this.init = function () {
        this.getCurrentCourse();
        this.newLectureForm = '';
        this.newLecture = newLectureObject();
    };
    
    var appScope = this;
    
    this.getCurrentCourse = function () {
        // currentCourse
        $http( { 
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/singlecourse',
            headers: {
                'Content-Type': undefined
            },
            data: { 
                idCourse: this.idCourse, 
                idUser: MainService.getCurrentUser().idUser
            }
        } )
        .success(function(data, status) {
            appScope.currentCourse = Object.create(data);
            appScope.defaultCourse = Object.create(data);
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
                idCourse: this.idCourse,
                idUser: MainService.getCurrentUser().idUser
            }
        } )
        .success(function(data, status) {
            appScope.lectureList = data;

        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
    };
    
    // FAKE, update course detail to server, !!!!! check role before updating to server !!!!!
    this.updateToServer = function () {
        alert('old: ' + this.defaultCourse.name + ' new: ' + this.currentCourse.name);
    };
    
    this.resetData = function () {
        this.currentCourse = Object.create(this.defaultCourse);
    };
    
    // FAKE, place holder for a function foring checking valivation
    this.checkNewLectureValid = function () {
        return true;
    };
    
    this.createNewLecture = function () {
        if (this.checkNewLectureValid()) {
            var appScope = this;
            $http({
                method: 'POST',
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/createlecture',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    "idCourse": this.idCourse,
                    "lectureNum": this.lectureList.length + 1,
                    "topic": this.newLecture.topic,
                    "intro": "",
                    "image": "https://s3-us-west-2.amazonaws.com/bimolive-pictures/course_pics/lecture_default_pic.png",
                    "scheduleDate": "2017-01-21",
                    "startTime": "11:11",
                    "endTime": "11:12"
                }
            })
            .success(function (data, status) {
                if (data.result) {
                    appScope.clearForm();
                } else {
                    console.log("success but got " + data.result);
                }
            })
            .error(function (data, status) {
                console.log(data);
                console.log(status);
                console.log('Request failed');
            });
        }
    };

    this.clearForm = function () {
        this.newLecture = newLectureObject();
        $('#addLectureModal').modal('hide');
        this.newLectureForm.$setPristine();
        this.getLectureList();
    };
    
}])

.factory('lectureDetail', function () {
    
});