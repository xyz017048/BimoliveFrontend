'use strict';


angular.module('bimoliveApp')
/**
 * Controller for teacher view
 */
.controller('CourseDetailCtrl', ['$http', function ($http) {
    
    this.currentCourse = {
            'idCourse': '1234',
            'category': 'CS',
            'levelNumber': '4500',
            'name': 'Senior Porject',
            'image': 'images/thumbnail_pics/0.png',
            'startDate': '2013-03-05',
            'endDate': '2015-05-12'
        };

    
    function getLectureList () {
        return [{
            'idLecture': '14325',
            'lectureNum': '1',
            'topic': 'introduction to bluh bluh',
            'image': 'images/thumbnail_pics/0.png',
            'scheduleDate': '2013-03-05',
            'startTime': '10:00',
            'endTime': '21:00',
            'status': 'FIN'
            
        }, {
            'idLecture': '14326',
            'lectureNum': '2',
            'topic': 'bluh bluh',
            'image': 'images/thumbnail_pics/2.png',
            'scheduleDate': '2013-03-05',
            'startTime': '10:00',
            'endTime': '21:00',
            'status': 'LIVE'
        }];
    }
    
    this.lectureList = getLectureList();
    
    /**
     * 
     */
    this.createNewCourse = function () {
        if (this.checkNewCourseValid()) {
            // Assign app object in appScope
            
            var appScope = this;
            /*
            Get All my Courses:  
                Request: POST   /teacher/courses
                                {
                                    "idUser":           INT
                                }

                Response：      may be an empty list, order by "createDate" desc
                                [
                                    {
                                        "idCourse":     INT,
                                        "idUser":       INT,
                                        "category":     STRING,
                                        "levelNumber":  INT,
                                        "name":         STRING,
                                        "intro":        STRING,
                                        "image":        STRING,     (the image path/id of the course)
                                        "createDate":   STRING,
                                        "startDate":    STRING,     (format: "yyyy-MM-dd hh:mm:ss" Here time zone problem)
                                        "endDate":      STRING,     (format: "yyyy-MM-dd hh:mm:ss")
                                        "endFlag":      INT         (endFlag = 0, no endDate, make endDate same as startDate;
                                                                 endFlag = 1, real endDate)
                                    },
                                    ...
                                ]
             */
            // Serveice
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com//teacher/courses',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    idUser: MainCtrl.idUser,
                }
            } )
            
            .success(function(data, status) {
            })
            
            .error(function(data, status) {
            });
            
            this.clearForm();
        }
    };

}])

.factory('lectureDetail', function () {
    
});