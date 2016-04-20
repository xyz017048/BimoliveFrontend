'use strict';


angular.module('bimoliveApp')
/**
 * Controller for teacher view
 */
.controller('TeacherCtrl', ['$http', '$routeParams', 'MainService', '$location', '$window', function ($http, $routeParams, MainService, $location, $window) {
    
    // if the user has not log in, redirect back and show the log in modal
    if (!MainService.getIsLogin()) {
        $location.url($window.history.back(1));
        $('#loginModal').modal('show'); 
    }
    
    var appScope = this;

    // init
    this.init = function() {
        this.idLecture = $routeParams.idLecture;
        this.lastId = -1;
        this.questions = [];
        this.courseName = '';
        this.currentLecture = {};
        this.isFinished = false;

        if(MainService.getCurrentUser().roleLevel === 2) // is teacher, then get lecture
        {
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/singlelecture',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    idLecture: appScope.idLecture,
                    idUser: MainService.getCurrentUser().idUser
                }
            } )
            
            .success(function(data, status) {
                appScope.courseName = data.courseName;
                appScope.currentLecture = data.lectureInfo;
                appScope.getQuestions(appScope.lastId);
                if (appScope.currentLecture.status === 'replay') {
                    appScope.isFinished = true;
                }
            })
            
            .error(function (data, status) {
                alert('Err:' + data);    
            });
        }
    };

   /**
    * [getQuestions description]
    * @param  {[type]} idQuestion [description]
    * @return {[type]}            [description]
    */      
    this.getQuestions = function(lastId) {
        
        $http( {
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/getquestions',
            headers: {
                    'Content-Type': undefined
            },
            data: {
                roleLevel: 2,
                idLecture: appScope.idLecture,
                idQuestion: lastId
            }
        } )
        .success(function(data, status) {
            for (var q in data) {
                if (data[q].idQuestion !== 0 && data[q].status !== 'flag') {
                    appScope.questions.push(data[q]);
                }
                if (q === data.length - 1 + "") {
                    appScope.lastId = data[q].idQuestion;
                    appScope.currentLecture.status = data[q].lectureStatus;
                }
            }
            if (appScope.currentLecture.status === 'live') {
                setTimeout(function () {
                    appScope.getQuestions(appScope.lastId);
                }, 3000);
            } else if (appScope.currentLecture.status === 'finish') { // it is not 'live' change video
                // appScope.streamVideo();
                // appScope.redirectPage();
            }
        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
    }
    
    /**
     * Answer questions
     */
    this.answerQuestion = function (questionStatus) {
        $http( {
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/questionaction',
            headers: {
                    'Content-Type': undefined
            },
            data: {
                idQuestion: this.currentQuestion.idQuestion,
                status:  questionStatus
            }
        } )
        
        .success(function(data, status) {
            appScope.currentQuestion.status = questionStatus;
        })
        
        .error(function(data, status) {
        });
    };
     
    // Set selected question
    this.setCurrentQuestion = function (question, index) {
        this.currentQuestion = question;
        this.questionIndex = index;
        if (question.status !== 'answer') {
            question.status = 'read';
            this.answerQuestion('read');
        }
    };
    
    /**
     * 
     */    
    this.removeQuestion = function () {
        $http( {
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/questionaction',
            headers: {
                    'Content-Type': undefined
            },
            data: {
                idQuestion: this.currentQuestion.idQuestion,
                status:  'delete'  
            }
        } )
        
        .success(function(data, status) {
            appScope.questions.splice(appScope.questionIndex, 1);
        })
        
        .error(function(data, status) {
        });
    };
    this.flag = '';
    this.addFlag = function () {
        var content = this.flag;
        this.flag = '';
        $http( {
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/questionanswer',
            headers: {
                    'Content-Type': undefined
            },
            data: {
                "idUser": MainService.getCurrentUser().idUser,
                "username": MainService.getCurrentUser().username,
                "idLecture": appScope.idLecture,
                "content": content
            }
        } )
        
        .success(function (data, status) {
            this.flag = '';
            if(!data.result) {
                alert('Server error, please try again!');
            } else {
                // TODO: flag[] should add one question
                // or question[] should add one
            }
        })
        
        .error(function(data, status) {
        });
    }

    /**
     * End lecture
     * Change the status of the lecture
     */
    this.endLecture = function () {
        $http({
            method: 'POST',
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/endlecture',
            headers: {
                'Content-Type': undefined
            },
            data: {
                idUser: MainService.getCurrentUser().idUser,
                idLecture: appScope.idLecture
            }
        })

        .success(function (data, status) {
            appScope.currentLecture.status = 'finish';
            appScope.isFinished = true;
            // $('#redirectModal').modal('show');
            // alert('Lecture finished');
            $location.url('/lecturedetail/' + appScope.idLecture);
        })

        .error(function (data, status) {
        });
    };
    
    // this.lectureFinish();
    
    // this.redirectPage = function () {
    //     $('#redirectModal').on('hidden.bs.modal', function (e) {
    //         $location.url('/mycourses');
    //     });
    // };
    $('#redirectModal').on('hidden.bs.modal', function (e) {
        $location.url('/mycourses');
    });
}]);
