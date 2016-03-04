'use strict';


angular.module('bimoliveApp')
/**
 * Controller for courseInfo, LectureInfo, and teacherInfo pages
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
            appScope.course = data;
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
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/teacherinfo',
            headers: {
                'Content-Type': undefined
            },
            data: { 
                idTeacher: $routeParams.teacherid,
                idUser: MainService.getCurrentUser().idUser
            }
        } )
        .success(function (data, status) {
            appScope.teacher = data;
        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
    };
    
    this.lecture = {};
    this.getLecture = function () {
        $http( { 
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/singlelecture',
            headers: {
                'Content-Type': undefined
            },
            data: { 
                idLecture: $routeParams.lectureid,
                idUser: MainService.getCurrentUser().idUser
            }
        } )
        .success(function(data, status) {
            appScope.lecture = data;
        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
    };
    
    /**
     * student follow course at lecture page
     * @return {[type]} [description]
     */
    this.followCourse = function() {
        if (!MainService.getIsLogin()) {
            alert('Plese Login');
        } else if (appScope.course.followCourse !== 1) {
            var user = MainService.getCurrentUser();
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/followcourse',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    idUser: user.idUser,
                    idCourse: appScope.course.courseInfo.idCourse,
                    idLecture: -1
                }
            } )
            .success(function(data, status) {
                if(data.result) {
                    appScope.course.followCourse = 1;
                } else {
                    console.log('success but got ' + data.result);
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                console.log('Request failed');
            });
        }
    }

    /**
     * student unfollow course at lecture page
     * @return {[type]} [description]
     */
    this.unfollowCourse = function() {
        if (!MainService.getIsLogin()) {
            alert('Plese Login');
        } else if (appScope.course.followCourse !== 0) {
            var user = MainService.getCurrentUser();
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/unfollowcourse',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    idUser: user.idUser,
                    idCourse: appScope.course.courseInfo.idCourse,
                    idLecture: -1
                }
            } )
            .success(function(data, status) {
                if(data.result) {
                    appScope.course.followCourse = 0;
                } else {
                    console.log('success but got ' + data.result);
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                console.log('Request failed');
            });
        }
    } 

    /**
     * student follow teacher at lecture page
     * @return {[type]} [description]
     */
    this.followTeacher = function() {
        if (!MainService.getIsLogin()) {
            alert('Plese Login');
        } else if (appScope.teacher.followTeacher !== 1) {
            var user = MainService.getCurrentUser();
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/followteacher',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    idUser: user.idUser,
                    idCourse: -1,
                    idLecture: -1,
                    idTeacher: appScope.teacher.teacherInfo.idUser
                }
            } )
            .success(function(data, status) {
                if(data.result) {
                    appScope.teacher.followTeacher = 1;
                } else {
                    console.log('success but got ' + data.result);
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                console.log('Request failed');
            });
        }
    }

    /**
     * student follow teacher at lecture page
     * @return {[type]} [description]
     */
    this.unfollowTeacher = function() {
        if (!MainService.getIsLogin()) {
            alert('Plese Login');
        } else if (appScope.teacher.followTeacher !== 0) {
            var user = MainService.getCurrentUser();
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/unfollowteacher',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    idUser: user.idUser,
                    idCourse: -1,
                    idLecture: -1,
                    idTeacher: appScope.teacher.teacherInfo.idUser
                }
            } )
            .success(function(data, status) {
                if(data.result) {
                    appScope.teacher.followTeacher = 0;
                } else {
                    console.log('success but got ' + data.result);
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                console.log('Request failed');
            });
        }
    }
}]);