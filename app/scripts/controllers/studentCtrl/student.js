'use strict';


angular.module('bimoliveApp')
/**
 * Controller for student view
 */

.controller('StudentCtrl', ['$routeParams', '$http', 'MainService', '$location', '$window', function ($routeParams, $http, MainService, $location, $window) {

    this.idLecture = $routeParams.id;
    this.currentLecture = {};

    var appScope = this;
    var user = MainService.getCurrentUser();
    

    $http({
        method: 'POST',
        url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/singlelecture',
        headers: {
            'Content-Type': undefined
        },
        data: {
            idUser: user.idUser,
            idLecture: $routeParams.id
        }
    })
    .success(function (data, status) {
        appScope.currentLecture = data;
    })
    .error(function (data, status) {
    });
    
    this.sentQuestions = [];
    /**
     * What questions that student has sent to the teacher
     */
    function sentQuestions() {
        $http({
            method: 'POST',
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/questions',
            headers: {
                'Content-Type': undefined
            },
            data: {
                idUser: user.idUser,
                idLecture: $routeParams.id
            }
        })
        .success(function (data, status) {
            appScope.sentQuestions = data;
        })
        .error(function (data, status) {
        });
    }

    /**
     * get Question with last idQuestion
     * @param  {[type]} idQuestion [description]
     * @return {[type]}            [description]
     */
    function getQuestions(idQuestion) {
        $http( { 
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/getquestions',
            headers: {
                    'Content-Type': undefined
            },
            data: {
                roleLevel: 1,
                idLecture: $routeParams.id,
                idQuestion: idQuestion
            }
        } )
        .success(function(data, status) {
            for (var q in data) {
                if (data[q].lectureStatus !== 'finish') {
                    appScope.questions.push(data[q]);
                    lastId = data[q].idQuestion;
                } else {
                    appScope.streamVideo();
                }
            }
            setTimeout(function () {
                getQuestions(lastId)
            }, 5000);
        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
    }

    this.questions = [];
    var lastId = -1;
    getQuestions(lastId);

    /**
     * send question to server
     */
    this.sendQuestion = function() {
        followCourse();
        followTeacher();
        unfollowTeacher();
        unfollowCourse();
        unfollowCourse();
        if (!MainService.getIsLogin()) {
            alert('Plese Login');
        } else if (this.currentQuestion.trim() !== '') {
            var user = MainService.getCurrentUser();
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/sendquestion',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    idUser: user.idUser,
                    username: user.username,
                    idLecture: this.idLecture,
                    content: this.currentQuestion.trim()
                }
            } )
            .success(function(data, status) {
                if(data.result) {
                    appScope.currentQuestion = '';
                } else {
                    console.log('success but got ' + data.result);
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                console.log('Request failed');
            });
            
            
            // Display sent questions
            sentQuestions();
        }
    };
    
    this.streamVideo = function () {
        var live_url = '';
        if (this.currentLecture.lectureModel.status === 'live') {
            live_url = 'rtmp://' + '52.36.183.186' + '/live' + '/' + this.currentLecture.lectureModel.url;
        } else if (this.currentLecture.lectureModel.status === 'replay') {
            live_url = this.currentLecture.lectureModel.url;
        } else if (this.currentLecture.lectureModel.status === 'finish') {
            alert('finish');
        }
        var videoPlayer = jwplayer('videoPlayer');
        var video = document.getElementById('video');
        videoPlayer.setup({
            file: live_url,
            flashplayer: 'scripts/jwplayer/jwplayer.flash.swf',
            controlbar: 'bottom',
            width: video.offsetWidth,
            height: video.offsetHeight,
            autostart: true,
            skin: {
                name: 'seven'
            }
        });
        
        // videoPlayer.onError(function(e) {
        //     alert('error: ' + e); 
        // });
        
        // videoPlayer.onComplete(function() {
        //     alert('complete');
        // });
        
        // videoPlayer.onPause(function() {
        //     alert('pause');
        // });
        
        // videoPlayer.on('error', function() {
        //     alert('error2');
        // });
        
        // videoPlayer.on('complete', function() {
        //     alert('complete2');
        // });
        
        // videoPlayer.on('pause', function() {
        //     alert('pause2');
        // });
        
    };

    /**
     * student follow course at lecture page
     * @return {[type]} [description]
     */
    function followCourse() {
        if (!MainService.getIsLogin()) {
            alert('Plese Login');
        } else if (appScope.currentLecture.followCourse !== 1) {
            var user = MainService.getCurrentUser();
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/followcourse',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    idUser: user.idUser,
                    idCourse: -1,
                    idLecture: appScope.idLecture
                }
            } )
            .success(function(data, status) {
                if(data.result) {
                    appScope.currentLecture.followCourse = 1;
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
    function unfollowCourse() {
        if (!MainService.getIsLogin()) {
            alert('Plese Login');
        } else if (appScope.currentLecture.followCourse !== 0) {
            var user = MainService.getCurrentUser();
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/unfollowcourse',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    idUser: user.idUser,
                    idCourse: -1,
                    idLecture: appScope.idLecture
                }
            } )
            .success(function(data, status) {
                if(data.result) {
                    appScope.currentLecture.followCourse = 0;
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
    function followTeacher() {
        if (!MainService.getIsLogin()) {
            alert('Plese Login');
        } else if (appScope.currentLecture.followTeacher !== 1) {
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
                    idLecture: appScope.idLecture,
                    idTeacher: -1
                }
            } )
            .success(function(data, status) {
                if(data.result) {
                    appScope.currentLecture.followTeacher = 1;
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
    function unfollowTeacher() {
        if (!MainService.getIsLogin()) {
            alert('Plese Login');
        } else if (appScope.currentLecture.followTeacher !== 0) {
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
                    idLecture: appScope.idLecture,
                    idTeacher: -1
                }
            } )
            .success(function(data, status) {
                if(data.result) {
                    appScope.currentLecture.followTeacher = 0;
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
     * Modal Use functions
     */
    this.showPermissionModal = function () {
        $(window).load(function () {
            $('#permissioncodeModal').modal({ keyboard: false, backdrop: 'static' });
            $('#permissioncodeModal').modal('show');
        });
        
        $(document).on('keydown', function (e) {
            if (e.which === 8 && !$(e.target).is('input, textarea')) {
                e.preventDefault();
            }
        });
        
    };
    this.permissioncode = '';
    this.showLoader = false;
    this.isPermitted = false;
    this.notPermitted = false;
    
    this.submitPermission = function () {
        this.showLoader = true;
        // check with server, if permission code is right, do this
        if (this.checkPermission()) {
            this.permissioncode = '';
            this.isPermitted = true;
            $('#permissioncodeModal').modal('hide');   
        } else {
            this.notPermitted = true;
        }
        this.showLoader = false;
    };
    
    // FAKE !!! return true if permission is good, false if permission denied
    this.checkPermission = function () {
        if (this.permissioncode === '1') {
            return true;
        } else {
            return false;   
        }
    };
    
    // redirect to the page before 
    this.redirectBack = function () {
        $('#permissioncodeModal').on('hidden.bs.modal', function (e) {
            $location.url($window.history.back(1));
        });
    };
    
    $('#permissioncodeModal').modal({ keyboard: false, backdrop: 'static' });
            $('#permissioncodeModal').modal('show');
    
}]);
