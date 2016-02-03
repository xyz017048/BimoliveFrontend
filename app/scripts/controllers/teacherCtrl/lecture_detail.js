'use strict';


angular.module('bimoliveApp')
/**
 * Controller for teacher view
 */
.controller('LectureDetailCtrl', ['$http', 'course', function ($http, course) {

    function getMycourses () {
        var array = [];
        for (var i = 0; i < 2; i++) {
            var video = { "name": "Course #" + i,
                "presenter": "Smith" + i,
                "id": i
            };
            array.push(video);
        }
        return array;
    }
    
    this.lectureList = getMycourses();
}]);