'use strict';


angular.module('bimoliveApp')
/**
 * Controller for student view
 */

.controller('StudentCtrl', ['$routeParams', '$http', 'MainService', function ($routeParams, $http, MainService) {

    var sectionId = $routeParams.id; //the current video id
    this.idLecture = sectionId;

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

    this.currentQuestion = '';
    var questions = [];
    this.questions = questions;
    getQuestions(sectionId, true);
    var i=0;
    setInterval( function() {
        getQuestions(sectionId, false);
        this.questions = questions;
    }, 1000 ); 

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
                roleLevel: 1,
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

    /**
     * send question to server
     */
    this.sendQuestion = function() {
        if (!MainService.getIsLogIn()) {
            alert('login please');
        } else if (this.currentQuestion.trim() !== '') {
            // Assign app object in appScope
            var appScope = this;
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
                    console.log("success but got " + data.result);
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                console.log('Request failed');
            });
        }
    };

    this.key = 'live0';
    
    // call the function that connect the server and get 
    // all video info and store in currentVideo
    this.currentVideo = getCurrentVideo(sectionId);
    
    this.streamVideo = function () {
        var live_url = 'rtmp://' + '52.34.242.6' + '/live' + '/' + this.key;
        var videoPlayer = jwplayer('videoPlayer');
        var video = document.getElementById('video');
        videoPlayer.setup({
            file: live_url,
            flashplayer: 'scripts/jwplayer/jwplayer.flash.swf',
            controlbar: "bottom",
            width: video.offsetWidth,
            height: video.offsetHeight,
            autostart: true,
            skin: {
                name: "seven"
            }
        });
    };
}]);
