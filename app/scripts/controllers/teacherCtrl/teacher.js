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
    this.sectionId = $routeParams.idLecture;

   /**
    * [getQuestions description]
    * @param  {[type]} idQuestion [description]
    * @return {[type]}            [description]
    */
    function getQuestions(lastId) {
        
        $http( {
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/getquestions',
            headers: {
                    'Content-Type': undefined
            },
            data: {
                roleLevel: 2,
                idLecture: $routeParams.idLecture,
                idQuestion: lastId
            }
        } )
        .success(function(data, status) {
            for (var q in data) {
                if (data[q].idQuestion !== 0) {
                    appScope.questions.push(data[q]);
                }
                if (q === data.length - 1 + "") {
                    lastId = data[q].idQuestion;
                    appScope.currentLecture.status = data[q].lectureStatus;
                }
            }
            if (appScope.currentLecture.status === 'live') {
                setTimeout(function () {
                    getQuestions(lastId);
                }, 3000);
            } else if (appScope.currentLecture.status === 'finish') { // it is not 'live' change video
                // appScope.streamVideo();
                appScope.redirectPage();
            }
        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
    }

    this.questions = [];
    var lastId = -1;
    // First time get all the questions from the database
    getQuestions(lastId);
    
    // Continue getting questions from database
    // setInterval( function() {
    //     getQuestions(2);
    // }, 2000 );
    
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
    
    this.currentLecture = {};
    this.isFinished = false;
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
                idLecture: $routeParams.idLecture
            }
        })

        .success(function (data, status) {
            appScope.currentLecture.status = 'finish';
            appScope.isFinished = true;
            $('#redirectModal').modal('show');
        })

        .error(function (data, status) {
        });
    };
    
    // init
    this.lectureFinish = function() {
        if(MainService.getCurrentUser().roleLevel === 2)
        {
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/singlelecture',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    idLecture: $routeParams.idLecture,
                    idUser: MainService.getCurrentUser().idUser
                }
            } )
            
            .success(function(data, status) {
                appScope.currentLecture = data;
                if (data.status === 'replay') {
                    appScope.isFinished = true;
                }
            })
            
            .error(function (data, status) {
                alert('Err:' + data);    
            });
        }
    };
    
    this.lectureFinish();
    
    this.redirectPage = function () {
        $('#redirectModal').on('hidden.bs.modal', function (e) {
            $location.url('/mycourses');
        });
    };
}]);
