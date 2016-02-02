'use strict';


angular.module('bimoliveApp')
/**
 * Controller for teacher view
 */
.controller('TeacherCtrl', function ($http) {

    function getSectionId() {
        return 1234;
    }

    /**
     * get question queue from server
     * @param  {[type]} sectionId [description]
     * @return {[type]}           [description]
     */
    function getQuestions(sectionId, isFirst) {
        var result = questions;
        var interval = 0;
        if (!isFirst) {
            interval = 1;
        }
        
        $http( { 
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/getquestions',
            headers: {
                    'Content-Type': undefined
            },
            data: {
                roleLevel: 2,
                idLecture: sectionId,
                interval: interval
            }
        } )
        .success(function(data, status) {
            for(var n in data) {
                result.push({ "content": data[n].content, "username": data[n].username});
            }
        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
        questions = result;
        return result;
    }
    
    this.setCurrentQuestion = function (question) {
        this.currentQuestion = question;
    };
    
    this.sectionId = getSectionId();

    var questions = [];
    this.questions = questions;
    getQuestions(6, true);
    var i=0;
    setInterval( function() {
        getQuestions(6, false);
        this.questions = questions;
    }, 1000 ); 

    // set current question to the first question in the question array
    this.currentQuestion = this.questions[0];
    
    // this is fake! place holder for the real function
    function getMycourses () {
        var array = [];
        for (var i = 0; i < 5; i++) {
            var video = { "name": "Course #" + i,
                "presenter": "Smith" + i,
                "id": i
            };
            array.push(video);
        }
        return array;
    }
    
    this.myCourses = getMycourses();
    
    // this is fake! Place holder for function that gets view number from server
    this.getViewNumber = function (coruseId) {
        return 10;
    };
});
