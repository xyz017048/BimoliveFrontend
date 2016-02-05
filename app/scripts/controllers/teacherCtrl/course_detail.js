'use strict';


angular.module('bimoliveApp')
/**
 * Controller for teacher view
 */
.controller('CourseDetailCtrl', ['$http', '$routeParams', 'MainService', function ($http, $routeParams, MainService) {
    
    // var courseId = $routeParams.idCourse;
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
                    idUser: MainService.idUser,
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