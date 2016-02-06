'use strict';


angular.module('bimoliveApp')
/**
 * Controller for teacher view
 */
.controller('CourseDetailCtrl', ['$http', '$routeParams', 'MainService', function ($http, $routeParams, MainService) {
    
    this.idCourse = $routeParams.idCourse;

    var appScope = this;

    // currentCourse
    $http( { 
        method: 'POST', 
        url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/singlecourse',
        headers: {
            'Content-Type': undefined
        },
        data: { idCourse: this.idCourse }
    } )
    .success(function(data, status) {
        appScope.currentCourse = data;
    })
    .error(function(data, status) {
        console.log(data);
        console.log(status);
        console.log('Request failed');
    });

    
    // lectureList
    $http( { 
        method: 'POST', 
        url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/lectures',
        headers: {
            'Content-Type': undefined
        },
        data: { idCourse: this.idCourse }
    } )
    .success(function(data, status) {
        appScope.lectureList = data;

    })
    .error(function(data, status) {
        console.log(data);
        console.log(status);
        console.log('Request failed');
    });
    
    this.createNewLecture = function () {
        // if (this.checkNewLectureValid()) {
            var appScope = this;
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/createlecture',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    "idCourse": this.idCourse,
                    "lectureNum": this.lectureList.length + 1,
                    "topic": this.newLecture.name,
                    "intro": "",
                    "image": "",
                    "scheduleDate": "2017-01-21",
                    "startTime": "11:11",
                    "endTime": "11:12"
                }
            } )
            .success(function(data, status) {
                if(data.result) {
                    appScope.clearForm();
                } else {
                    console.log("success but got " + data.result);
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                console.log('Request failed');
            });
        // }
    }

    this.clearForm = function() {
        this.newLecture.name = '';
    }
}])

.factory('lectureDetail', function () {
    
});