'use strict';


angular.module('bimoliveApp')
/**
 * Controller for teacher view
 */
.controller('TeacherCtrl', ['$http', '$routeParams', 'MainService', function ($http, $routeParams, MainService) {
    
    var appScope = this;
    this.sectionId = $routeParams.idLecture;
    this.questions = [];
    
    /*
    "idQuestion":	INT,
    "username": 	STRING,
    "content" : 	STRING,
                            "status":       STRING,
    "sendTime":	STRING (format: yyyy-MM-dd hh:mm:ss)
    */
    function getQuestions(NotFirst) {
        
        $http( {
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/getquestions',
            headers: {
                    'Content-Type': undefined
            },
            data: {
                roleLevel: 2,
                idLecture: $routeParams.idLecture,
                interval: NotFirst
            }
        } )
        
        .success(function(data, status) {
            if(data) {
                var length = data.length;
                for (var i = 0; i < length; i++) {
                    appScope.questions.push(data[i]);
                }
            }
        })
        
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
    }
    
    // First time get all the questions from the database
    getQuestions(0);
    
    // Continue getting questions from database
    setInterval( function() {
        getQuestions(1);
    }, 1000 );
     
    // Set selected question
    this.setCurrentQuestion = function (question) {
        this.currentQuestion = question;
    };
    
}]);
