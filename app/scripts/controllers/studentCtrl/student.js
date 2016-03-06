'use strict';


angular.module('bimoliveApp')
/**
 * Controller for student view
 */

.controller('StudentCtrl', ['$routeParams', '$http', 'MainService', '$location', '$window', function ($routeParams, $http, MainService, $location, $window) {

    // if the user has not log in, redirect back and show the log in modal
    if (!MainService.getIsLogin()) {
        $location.url($window.history.back(1));
        $('#loginModal').modal('show'); 
    }
    
    this.idLecture = $routeParams.id;
    this.currentLecture = {};
    this.isLive = false;

    var appScope = this;
    var user = MainService.getCurrentUser();
    
    this.getLecture = function () {
        $http({
            method: 'POST',
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/singlelecture',
            headers: {
                'Content-Type': undefined
            },
            data: {
                idUser: user.idUser,
                idLecture: $routeParams.id
            }
        })
        .success(function (data, status) {
            appScope.currentLecture = data;
            appScope.isLive = (data.lectureInfo.status === 'live');
            // get question after get lecture
            getQuestions(appScope.lastId);
            if (appScope.isPermitted) {
                // appScope.streamVideo();
                appScope.getAllAnwseredQuestions();
            }
        })
        .error(function (data, status) {
        });
    };
    
    this.getLecture();
    
    this.sentQuestions = [];
    // Display sent questions
    // sentQuestions();
    /**
     * What questions that student has sent to the teacher
     */
    function sentQuestionsfunction() {
        $http({
            method: 'POST',
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/questions',
            headers: {
                'Content-Type': undefined
            },
            data: {
                idUser: user.idUser,
                idLecture: $routeParams.id
            }
        })
        .success(function (data, status) {
            appScope.sentQuestions = data;
        })
        .error(function (data, status) {
        });
    }

    appScope.questions = [];
    var lastId = -1;
    /**
     * get Question with last idQuestion
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
                if (data[q].idQuestion !== 0) {
                    appScope.questions.push(data[q]);
                }
                if (q === data.length - 1 + "") {
                    lastId = data[q].idQuestion;
                    appScope.currentLecture.lectureInfo.status = data[q].lectureStatus;
                }
            }
            if (appScope.currentLecture.lectureInfo.status === 'live') {
                setTimeout(function () {
                    getQuestions(lastId);
                }, 5000);
            } else if (appScope.currentLecture.lectureInfo.status === 'finish') { // it is not 'live' change video
                // appScope.streamVideo();
                alert('Lecture Finished');
                $location.url($window.history.back(1));
            }
        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
    }

    /**
     * send question to server
     */
    this.sendQuestion = function() {
        if (!MainService.getIsLogin()) {
            alert('Plese Login');
        } else if (this.currentQuestion.trim() !== '') {
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
                    // Display sent questions
                    sentQuestionsfunction();
                } else {
                    console.log('success but got ' + data.result);
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                console.log('Request failed');
            });
        }
    };
    
    var videoPlayer;
    var chaptersFile;
    this.streamVideo = function () {
        
        // var myBlob = new Blob([
        //         'WEBVTT\n\n'+
        //         'Chapter 1\n'+
        //         '00:00:00.000 --> 00:01:42.000\n'+
        //         'Opening credits\n\n'+

        //         'Chapter 2\n'+
        //         '00:01:42.000 --> 00:04:44.000\n'+
        //         'A dangerous quest\n\n'+

        //         'Chapter 3\n'+
        //         '00:04:44.000 --> 00:05:50.000\n'+
        //         'The attack\n\n'+

        //         'Chapter 4\n'+
        //         '00:05:50.000 --> 00:08:24.000\n'+
        //         'In pursuit\n\n'+

        //         'Chapter 5\n'+
        //         '00:08:24.000 --> 00:10:13.000\n'+
        //         'Cave Fight\n\n'+

        //         'Chapter 6\n'+
        //         '00:10:13.000 --> 00:12:24.000\n'+
        //         'Eye to eye\n\n'+

        //         'Chapter 7\n'+
        //         '00:12:24.000 --> 00:14:48.000\n'+
        //         'Ending Credits'
        // ], {type : "text/vtt"});
        
        // var chaptersFile = window.URL.createObjectURL(myBlob); 
        
        var live_url = '';
        if (this.currentLecture.lectureInfo.status === 'live') {
            live_url = 'rtmp://' + '52.33.149.173' + '/live' + '/' + this.currentLecture.lectureInfo.url;
        } else if (this.currentLecture.lectureInfo.status === 'replay') {
            live_url = this.currentLecture.lectureInfo.url;
            // live_url = 'https://content.jwplatform.com/videos/q1fx20VZ-kNspJqnJ.mp4';
        } else if (this.currentLecture.lectureInfo.status === 'finish') {
            alert('finish');
        }
        videoPlayer = jwplayer('videoPlayer');
        var video = document.getElementById('video');
        
        if(this.currentLecture.lectureInfo.status === 'replay') {
            videoPlayer.setup({
                file: live_url,
                flashplayer: 'scripts/jwplayer/jwplayer.flash.swf',
                controlbar: 'bottom',
                width: video.offsetWidth,
                height: video.offsetHeight,
                autostart: true,
                skin: {
                    name: 'seven'
                },
                tracks: [{
                    file: appScope.chaptersFile,
                    kind: 'chapters'
                }]
            });
        } else if(this.currentLecture.lectureInfo.status === 'live') {
            videoPlayer.setup({
                file: live_url,
                flashplayer: 'scripts/jwplayer/jwplayer.flash.swf',
                controlbar: 'bottom',
                width: video.offsetWidth,
                height: video.offsetHeight,
                autostart: true,
                skin: {
                    name: 'seven'
                }
            });
        }
        
        videoPlayer.on('ready', function(e) {
            if(!appScope.isLive) {
                // replayVideo();
                // appScope.getAllAnwseredQuestions();
            }
        });
        
        videoPlayer.on('time', function(e) {
        
            var modifiers = document.getElementById('questions').getElementsByTagName('button');
            for(var i = 0, len = modifiers.length-1; i < len; ++i) {
                
                // Special case
                if(timeTag[len][0] < e.position && e.position < e.duration) {
                    modifiers[len-1].classList.remove('list-group-item-info');
                    modifiers[len].classList.add('list-group-item-info');
                    continue;
                } else {
                    modifiers[len].classList.remove('list-group-item-info');
                }
                
                if(timeTag[i][0] < e.position && e.position < timeTag[i+1][0]) {
                    modifiers[i].classList.add('list-group-item-info');
                } else {
                    modifiers[i].classList.remove('list-group-item-info');  
                }
            }
            
            // console.log(timeTag[len-1][0]);
            // console.log(timeTag[len][0]);
            // console.log(e.position);
        });
        
    };

    /**
     * student follow course at lecture page
     * @return {[type]} [description]
     */
    this.followCourse = function() {
        if (!MainService.getIsLogin()) {
            alert('Plese Login');
        } else if (appScope.currentLecture.followCourse !== 1) {
            var user = MainService.getCurrentUser();
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/followcourse',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    idUser: user.idUser,
                    idCourse: -1,
                    idLecture: appScope.idLecture
                }
            } )
            .success(function(data, status) {
                if(data.result) {
                    appScope.currentLecture.followCourse = 1;
                } else {
                    console.log('success but got ' + data.result);
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                console.log('Request failed');
            });
        }
    }

    /**
     * student unfollow course at lecture page
     * @return {[type]} [description]
     */
    this.unfollowCourse = function() {
        if (!MainService.getIsLogin()) {
            alert('Plese Login');
        } else if (appScope.currentLecture.followCourse !== 0) {
            var user = MainService.getCurrentUser();
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/unfollowcourse',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    idUser: user.idUser,
                    idCourse: -1,
                    idLecture: appScope.idLecture
                }
            } )
            .success(function(data, status) {
                if(data.result) {
                    appScope.currentLecture.followCourse = 0;
                } else {
                    console.log('success but got ' + data.result);
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                console.log('Request failed');
            });
        }
    }

    /**
     * student follow teacher at lecture page
     * @return {[type]} [description]
     */
    this.followTeacher = function() {
        if (!MainService.getIsLogin()) {
            alert('Plese Login');
        } else if (appScope.currentLecture.followTeacher !== 1) {
            var user = MainService.getCurrentUser();
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/followteacher',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    idUser: user.idUser,
                    idCourse: -1,
                    idLecture: appScope.idLecture,
                    idTeacher: -1
                }
            } )
            .success(function(data, status) {
                if(data.result) {
                    appScope.currentLecture.followTeacher = 1;
                } else {
                    console.log('success but got ' + data.result);
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                console.log('Request failed');
            });
        }
    }

    /**
     * student follow teacher at lecture page
     * @return {[type]} [description]
     */
    this.unfollowTeacher = function() {
        if (!MainService.getIsLogin()) {
            alert('Plese Login');
        } else if (appScope.currentLecture.followTeacher !== 0) {
            var user = MainService.getCurrentUser();
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/student/unfollowteacher',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    idUser: user.idUser,
                    idCourse: -1,
                    idLecture: appScope.idLecture,
                    idTeacher: -1
                }
            } )
            .success(function(data, status) {
                if(data.result) {
                    appScope.currentLecture.followTeacher = 0;
                } else {
                    console.log('success but got ' + data.result);
                }
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                console.log('Request failed');
            });
        }
    }
    /**
     * Modal Use functions
     */
    this.showPermissionModal = function () {
        $(document).on('keydown', function (e) {
            if (e.which === 8 && !$(e.target).is('input, textarea')) {
                e.preventDefault();
            }
        });  
        
        if (this.getPermission()) {
            this.permissioncode = '';
            this.showLoader = false;
            this.isPermitted = true;
            this.notPermitted = false;   
            
        } else {
            this.permissioncode = '';
            this.showLoader = false;
            this.isPermitted = false;
            this.notPermitted = false;
        }
    };
    
    this.submitPermission = function () {
        this.showLoader = true;
        // check with server, if permission code is right, do this
        if (this.checkPermission()) {
            this.permissioncode = '';
            this.isPermitted = true;
            this.setPermission();
            $('#permissioncodeModal').modal('hide');   
            $('#permissioncodeModal').on('hidden.bs.modal', function (e) {
                appScope.getLecture();
            });
            
        } else {
            this.notPermitted = true;
        }
        this.showLoader = false;
    };
    
    // FAKE !!! return true if permission is good, false if permission denied
    this.checkPermission = function () {
        if (this.permissioncode === '1') {
            return true;
        } else {
            return false;   
        }
    };
    
    // redirect to the page before 
    this.redirectBack = function () {
        $('#permissioncodeModal').on('hidden.bs.modal', function (e) {
            $location.url($window.history.back(1));
        });
    };
    
    this.permittedLectures = [];
    if (sessionStorage.getItem('permittedLectures') !== null) {
        this.permittedLectures = JSON.parse(sessionStorage.getItem('permittedLectures'));
    } 
    
    this.setPermission = function () {
        this.permittedLectures.push(this.idLecture);
        sessionStorage.setItem('permittedLectures', JSON.stringify(this.permittedLectures));
    };
    
    this.getPermission = function () {
        if (this.permittedLectures.indexOf(this.idLecture) === -1) {
            return false;
        } else {
            return true;
        }
    };
    
    // show the modal
    setTimeout(function () {
        if (!appScope.getPermission()) {
            $('#permissioncodeModal').modal({ keyboard: false, backdrop: 'static' });
            $('#permissioncodeModal').modal('show');   
        } else {
            appScope.getLecture();
        }
    }, 100);
    
    
    ///////////////////
    var questionPanel;
    var timeTag;
    
    /**
     * Replay video
     */
    this.replayVideo = function() {
        
        // Retreive the questionPanal Div element
        questionPanel = document.getElementById('questionPanel');
        
        // Create a timeTag array, tending to get data from db
        // Funtion needed
        // timeTag = [
        //     [0, 'Opening credits', 'blah'],
        //     [102, 'A dangerous quest'],
        //     [284, 'The attack'],
        //     [350, 'In pursuit'],
        //     [504, 'Cave Fight'],
        //     [613, 'Eye to Eye'],
        //     [744, 'Ending Credits']
        // ];
        
        // Create a question ul
        var ulElement = document.createElement('ul');
        ulElement.classList.add('list-group');
        ulElement.setAttribute('style', 'overflow-y: auto; height: 440px; bottom: 0;');
        ulElement.setAttribute('id', 'questions');
        
        // Appending list elements and adding click event at the same time
        for (var i = 0, trackLength = timeTag.length; i < trackLength; i++) {

            var aElement = document.createElement('button');
            aElement.classList.add('list-group-item');
            // Set timeTag value
            aElement.setAttribute('data-start', timeTag[i][0]);
            // Bind click event
            aElement.addEventListener("click", seek);
            
            var h4Element = document.createElement('h4');
            h4Element.classList.add('list-group-item-heading');
            h4Element.innerHTML = timeTag[i][1];
            
            var pElement = document.createElement('p');
            pElement.classList.add('list-group-item-text');
            pElement.innerHTML = 'blah';
            
            ulElement.appendChild(aElement);
            aElement.appendChild(h4Element);
            aElement.appendChild(pElement);
        }
        questionPanel.appendChild(ulElement);
        
        console.log(i);
    };

    function seek() {
        if(videoPlayer) {
            videoPlayer.seek(this.getAttribute('data-start'));
            videoPlayer.play(true);
        }
    }
    
    /**
     * yyyy-MM-dd hh:mm:ss to seconds
     * var birthday = new Date(1995, 11, 17, 3, 24, 0);
     */
    this.realTime2Seconds = function (realTime) {
        if(realTime) {
            // console.log(realTime.substring(0, 4));
            // console.log(realTime.substring(5, 7));
            // console.log(realTime.substring(8, 10));
            // console.log(realTime.substring(11, 13));
            // console.log(realTime.substring(14, 16));
            // console.log(realTime.substring(17, 19));
            
            var date = new Date(realTime.substring(0, 4), realTime.substring(5, 7), 
            realTime.substring(8, 10), realTime.substring(11, 13), realTime.substring(14, 16), realTime.substring(17, 19));
            
            return date.getTime() / 1000;
        }
        
        return 0;
    };
    
    /**
     * Convert seconds to vtt time format
     */
    this.seconds2vttTimeFormat = function(totalSeconds) {
        console.log(totalSeconds);
        var tmp = totalSeconds;
        var hours = Math.floor(tmp/3600);
        tmp %= 3600;
        var minutes = Math.floor(tmp/60);
        tmp %= 60;
        var seconds = Math.floor(tmp);
        
        console.log(hours);
        console.log(minutes);
        console.log(seconds);
        
        hours = hours > 9 ? hours : '0' + hours;
        minutes = minutes > 9 ? minutes : '0' + minutes;
        seconds = seconds > 9 ? seconds : '0' + seconds;
        
        console.log(hours + ':' + minutes + ':' + seconds + '.000');
        
        return hours + ':' + minutes + ':' + seconds + '.000';
    };
    
    /**
     * Create vtt file
     */
    this.createvttFile = function(data) {
        
        var content = '';
        if(data.length > 0) {
            content += 'WEBVTT\n\n';
                    //   'Chapter 1\n' +
                    //   '00:00:00.000 --> ' + this.seconds2vttTimeFormat(appScope.realTime2Seconds(data[0].changeTime) - appScope.realTime2Seconds(appScope.currentLecture.lectureInfo.realStart)) + '\n' +
                    //   data[0].content + '\n\n';
                      
            for(var i = 0, len = data.length; i < len; ++i) {
                var index = i + 1;
                if(i < len - 1) {
                    content += ('Chapter ' + index + '\n' + 
                    this.seconds2vttTimeFormat(appScope.realTime2Seconds(data[i].changeTime) - appScope.realTime2Seconds(appScope.currentLecture.lectureInfo.realStart)) + ' --> ' + 
                    this.seconds2vttTimeFormat(appScope.realTime2Seconds(data[i+1].changeTime) - appScope.realTime2Seconds(appScope.currentLecture.lectureInfo.realStart)) + '\n' +
                    data[i].content + '\n\n');
                } else {
                    // last one
                    content += ('Chapter ' + index + '\n' + 
                    this.seconds2vttTimeFormat(appScope.realTime2Seconds(data[i].changeTime) - appScope.realTime2Seconds(appScope.currentLecture.lectureInfo.realStart)) + ' --> ' + 
                    this.seconds2vttTimeFormat(appScope.realTime2Seconds(data[i].changeTime) - appScope.realTime2Seconds(appScope.currentLecture.lectureInfo.realStart) + 5) + '\n' +
                    data[i].content);
                }
            }
        }
        
        var myBlob = new Blob([content], {type : "text/vtt"});
        
        this.chaptersFile = window.URL.createObjectURL(myBlob);
    };
    
    // timeTag
    /**
     * Get all anwsered questions
     */
    this.getAllAnwseredQuestions = function() {
        if (!MainService.getIsLogin()) {
            alert('Plese Login');
        } else {
            // Reset array to empty
            timeTag = [];
            var user = MainService.getCurrentUser();
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/getquestions',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    "roleLevel": user.roleLevel,
                    "idLecture": appScope.idLecture,
                    "idQuestion": -1
                }
            } )
            .success(function(data, status) {
                for(var i = 0, len = data.length; i < len; ++i) {
                    if(data[i].status === 'answer') {
                        var question = [appScope.realTime2Seconds(data[i].changeTime) - appScope.realTime2Seconds(appScope.currentLecture.lectureInfo.realStart),
                        data[i].content, data[i].content];
                        timeTag.push(question);
                    }
                }
                // console.log(data);
                // console.log(appScope.realTime2Seconds(data[0].changeTime));
                // console.log(appScope.currentLecture.lectureInfo.realStart);
                appScope.createvttFile(data);
                appScope.replayVideo();
                appScope.streamVideo();
            })
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                console.log('Request failed');
            });
        }
    }
    
}]);
