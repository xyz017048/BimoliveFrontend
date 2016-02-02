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
    function getQuestions(sectionId) {
        var result = [];
        $http( { 
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/getquestions',
            headers: {
                    'Content-Type': undefined
            },
            data: {
                roleLevel: 2,
                idLecture: sectionId,
                interval: 0
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
        return result;
    }
    
    this.setCurrentQuestion = function (question) {
        this.currentQuestion = question;
    };
    
    this.sectionId = getSectionId();

    this.questions = getQuestions(this.sectionId);

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
