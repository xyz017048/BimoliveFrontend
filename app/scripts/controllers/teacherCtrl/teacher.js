'use strict';


angular.module('bimoliveApp')
/**
 * Controller for teacher view
 */
.controller('TeacherCtrl', function () {

    function getSectionId() {
        return 1234;
    }
    
    // this is fake! Place holder for the real function that
    // gets the questions from server
    function getQuestions(sectionId) {
        return [{ "content": "What is the broadcast showing, right now? I can't see anything. Is there any one can help me?", "username": "Doe" },
            { "content": "What is the broadcast 2", "username": "Smith" },
            { "content": "What is the broadcast showing,3", "username": "Jones" }];
    }
    
    this.setCurrentQuestion = function (question) {
        this.currentQuestion = question;
    };
    
    this.sectionId = getSectionId();

    this.questions = getQuestions(this.sectionId);

    // set current question to the first question in the question array
    this.currentQuestion = this.questions[0];
    
});
