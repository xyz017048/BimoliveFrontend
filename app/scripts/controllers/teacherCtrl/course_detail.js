'use strict';


angular.module('bimoliveApp')
/**
 * Controller for teacher view
 */
.controller('CourseDetailCtrl', ['$http', 'course', function ($http, course) {
    
    this.currentCourse = course.currentCourse;
    
    
    function getMycourses () {
        var array = [];
        for (var i = 0; i < 10; i++) {
            var video = { "name": "Course #" + i,
                "presenter": "Smith" + i,
                "id": i
            };
            array.push(video);
        }
        return array;
    }
    
    this.lectureList = getMycourses();
    
    
    this.allCourses = {};
    /**
     * 
     */
    this.getAllCourses = function () {
       
            
    };

}]);