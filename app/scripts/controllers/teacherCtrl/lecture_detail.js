'use strict';


angular.module('bimoliveApp')
/**
 * Controller for teacher view
 */
.controller('LectureDetailCtrl', ['$http', function ($http) {

    this.currentLecture = {
            'idLecture': '14325',
            'lectureNum': '1',
            'topic': 'introduction to bluh bluh',
            'image': 'images/thumbnail_pics/0.png',
            'scheduleDate': '2013-03-05',
            'startTime': '10:00',
            'endTime': '21:00',
            'status': 'FIN'
            
        };
}]);