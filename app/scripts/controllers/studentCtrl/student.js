'use strict';


angular.module('bimoliveApp')
/**
 * Controller for student view
 */
.controller('StudentCtrl', function ($routeParams) {
    // this is fake! Place holder for the real function that
    // gets the video info from server
    function getCurrentVideo (sectionId) {
        var video = { "name": "video #" + sectionId,
                "presenter": "Smith" + sectionId,
                "id": sectionId,
                "viewNumber": 100
        };
        return video;
    }
    
    function getQuestions(sectionId) {
        return [{ "content": "What is the broadcast showing, right now? I can't see anything. Is there any one can help me?", "username": "Doe" },
            { "content": "What is the broadcast 2", "username": "Smith" },
            { "content": "What is the broadcast showing,3", "username": "Jones" }];
    }
    
    // this is fake! Place holder for the real function that
    // sends the question to server
    this.sendQuestion = function () {
        if (this.currentQuestion !== '') {
            alert(this.currentQuestion);
            this.currentQuestion = '';   
        }
    };
    
    var videoId = $routeParams.id; //the current video id

    // call the function that connect the server and get 
    // all video info and store in currentVideo
    this.currentVideo = getCurrentVideo(videoId);
    
    this.currentQuestion = '';
    
    this.questions = getQuestions();
});
