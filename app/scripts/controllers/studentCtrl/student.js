'use strict';


angular.module('bimoliveApp')
/**
 * Controller for student view
 */

.controller('StudentCtrl', ['$routeParams', '$http', 'MainService', function ($routeParams, $http, MainService) {

    this.idLecture = $routeParams.id;
    this.currentLecture = {};

    var appScope = this;

    $http({
        method: 'POST',
        url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/singlelecture',
        headers: {
            'Content-Type': undefined
        },
        data: {
            idLecture: $routeParams.id
        }
    })
    .success(function (data, status) {
        appScope.currentLecture = data;
        appScope.streamVideo();
    })
    .error(function (data, status) {
    });

    /**
     * [getQuestions description]
     * @param  {[type]} idQuestion [description]
     * @return {[type]}            [description]
     */
    function getQuestions(idQuestion) {
        $http( { 
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/getquestions',
            headers: {
                    'Content-Type': undefined
            },
            data: {
                roleLevel: 1,
                idLecture: $routeParams.id,
                idQuestion: idQuestion
            }
        } )
        .success(function(data, status) {
            for (var q in data) {
                appScope.questions.push(data[q]);
                lastId = data[q].idQuestion;
            }
            setTimeout(function () {
                getQuestions(lastId)
            }, 1000);
        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
    }

    this.questions = [];
    var lastId = -1;
    getQuestions(lastId);

    /**
     * send question to server
     */
    this.sendQuestion = function() {
        if (!MainService.getIsLogin()) {
            alert('Plese Login');
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
    
    this.streamVideo = function () {
        var live_url = '';
        if (this.currentLecture.lectureModel.status === 'live') {
            live_url = 'rtmp://' + '52.36.183.186' + '/live' + '/' + this.currentLecture.lectureModel.url;
        } else if (this.currentLecture.lectureModel.status === 'replay') {
            live_url = this.currentLecture.lectureModel.url;
        }
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
        
        videoPlayer.onError(function(e) {
            alert('error: ' + e); 
        });
        
        videoPlayer.onComplete(function() {
            alert('complete');
        });
        
        videoPlayer.onPause(function() {
            alert('pause');
        });
        
        videoPlayer.on('error', function() {
            alert('error2');
        });
        
        videoPlayer.on('complete', function() {
            alert('complete2');
        });
        
        videoPlayer.on('pause', function() {
            alert('pause2');
        });
        
    };
}]);
