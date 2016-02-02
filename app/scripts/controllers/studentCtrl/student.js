'use strict';


angular.module('bimoliveApp')
/**
 * Controller for student view
 */
.controller('StudentCtrl',['$controller', '$routeParams', '$http', function ($controller, $routeParams, $http) {
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
        var result = [];
        $http( { 
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/getquestions',
            headers: {
                    'Content-Type': undefined
            },
            data: {
                roleLevel: 1,
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

    /**
     * send question to server
     * @param  {[type]} idUser    [description]
     * @param  {[type]} username  [description]
     * @param  {[type]} sectionId [description]
     * @return {[type]}           [description]
     */
    // function sendQuestion (idUser, username, sectionId) {
    this.sendQuestion = function() {
        console.log('send ' + this.idUser 
                + ' ' + this.username + ' ' 
                 + this.idLecture + ' '
                 + this.currentQuestion);

        if (this.currentQuestion.trim() !== '') {
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/sendquestion',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    idUser: this.idUser,
                    username: this.username,
                    idLecture: this.idLecture,
                    content: this.currentQuestion.trim()
                }
            } )
            .success(function(data, status) {
                if(data.result) {
                    this.currentQuestion = '';
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
    
    var sectionId = $routeParams.id; //the current video id
    this.key = 'live0';
    this.idUser = '1';
    this.username = 'xueyangh';
    this.idLecture = sectionId;
    
    this.currentQuestion = '';
    
    // call the function that connect the server and get 
    // all video info and store in currentVideo
    this.currentVideo = getCurrentVideo(sectionId);
    
    this.questions = getQuestions(sectionId);

    // this.sendQuestion.value('idUser', '1').value('username', username);
    // this.sendQuestion = this.sendQuestion(idUser, username, sectionId);
    
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
            skin : {
            name: "seven"
            }
        });
    }
}]);
