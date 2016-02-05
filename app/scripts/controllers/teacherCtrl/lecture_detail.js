'use strict';


angular.module('bimoliveApp')
/**
 * Controller for teacher view
 */
.controller('LectureDetailCtrl', ['$http', 'course', function ($http, course) {

    this.currentLecture = course.currentCourse;
}]);