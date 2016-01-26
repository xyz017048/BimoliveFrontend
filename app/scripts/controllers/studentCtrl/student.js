'use strict';


angular.module('bimoliveApp')
/**
 * Controller for student view
 */
.controller('StudentCtrl', function ($routeParams, $http) {
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
    
    /**
     * get question queue from server
     * @param  {[type]} sectionId [description]
     * @return {[type]}           [description]
     */
    function getQuestions(sectionId) {
        var result = [{ "content": "What is the broadcast showing, right now? I can't see anything. Is there any one can help me?", "username": "Doe" },
            { "content": "What is the broadcast 2", "username": "Smith" },
            { "content": "What is the broadcast showing,3", "username": "Jones" }];
        /*
        $routeParams( { 
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/getQuestion',
             headers: {
                    'Content-Type': undefined
            },
            data: {
                idLecture: sectionId
            }
        } )
        .success(function(data, status) {
            if(data.result == 1) {
                result = data.result;
            } else {
                console.log(data);
                console.log(status);
                console.log('Request failed');
            }
        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
        */
        return result;
    }
    
    /**
     * send question to server
     * @param  {[type]} idUser    [description]
     * @param  {[type]} username  [description]
     * @param  {[type]} sectionId [description]
     * @return {[type]}           [description]
     */
    this.sendQuestion = function (idUser, username, sectionId) {
        if (this.currentQuestion.trim() !== '') {
            alert('send ' + idUser 
                + ' ' + username + ' ' 
                 + sectionId + ' ' 
                 + this.currentQuestion);
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/sendQuestion',
                 headers: {
                    'Content-Type': undefined
                },
                data: {
                    idUser: idUser,
                    username: username,
                    idLecture: sectionId,
                    content: this.currentQuestion.trim()
                }
            } )
            .success(function(data, status) {
                if(data.result === 1) {
                    this.currentQuestion = '';
                } else {
                    console.log(data);
                    console.log(status);
                    console.log('Request failed');
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                console.log('Request failed');
            });
        } else {
            alert(this.currentQuestion + 'it is empty after trim');
        }
    };
    
    var videoId = $routeParams.id; //the current video id

    // call the function that connect the server and get 
    // all video info and store in currentVideo
    this.currentVideo = getCurrentVideo(videoId);
    
    this.currentQuestion = '';
    
    this.questions = getQuestions();
});
