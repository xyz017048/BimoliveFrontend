'use strict';


angular.module('bimoliveApp')
/**
 * Controller for teacher view
 */
.controller('LectureDetailCtrl', ['$http', '$routeParams', 'MainService', '$location', '$window', '$scope', function ($http, $routeParams, MainService, $location, $window, $scope) {
    
    // if the user has not log in, redirect back and show the log in modal
    if (!MainService.getIsLogin()) {
        $location.url($window.history.back(1));
        $('#loginModal').modal('show'); 
    }
    
    var appScope = this;
    this.currentLecture = {};
    this.courseName = '';
    // this.isFinished = false;
   
    if(MainService.getCurrentUser().roleLevel === 2) // is teacher
    {
        $http( { 
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/singlelecture',
            headers: {
                'Content-Type': undefined
            },
            data: {
                idLecture: $routeParams.idLecture,
                idUser: MainService.getCurrentUser().idUser
            }
        } )
        
        .success(function(data, status) {
            appScope.currentLecture = data.lectureInfo;
            appScope.courseName = data.courseName;
            appScope.origLecture = JSON.parse(JSON.stringify(data.lectureInfo));
            // if (data.status === 'finish' || data.status === 'replay') {
            //     appScope.isFinished = true; 
            // }
        })
        
        .error(function(data, status) {
        });
    }
    
    this.startLecture = function () {
        if(appScope.origLecture.status === 'replay') {
            $location.url('/student/' + appScope.currentLecture.idLecture);
        } else { // is wait or live
            $http({
                method: 'POST',
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/startlecture',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    idUser: MainService.getCurrentUser().idUser,
                    idLecture: $routeParams.idLecture
                }
            })

            .success(function (data, status) {
                $location.url('/teacher/' + appScope.currentLecture.idLecture);
            })

            .error(function (data, status) {
                alert('Start Lecture Failed!');
            });
        }
    };
    
    this.uploadReplay = function (idUser, idLecture, url) {
        if (!url) {
            alert('Upload Lecture Failed!');
            return;
        }
        var imageurl = appScope.captureImage(url);
        $http({
            method: 'POST',
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/uploadlecture',
            headers: {
                'Content-Type': undefined
            },
            data: {
                idUser: idUser,
                idLecture: idLecture,
                url: url,
                image: imageurl
            }
        })
        .success(function (data, status) {
            alert('upload success');
        })
        .error(function (data, status) {
            alert('Upload Lecture Failed!');
        });
    };

    // use for capture image when upload
    this.captureImage = function (video_src) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var video = document.createElement('video');
        video.setAttribute('crossOrigin', 'anonymous');
        video.setAttribute('src', video_src);
        video.onloadeddata = function() {
            var w = video.videoWidth;
            var h = video.videoHeight;
            canvas.width  = w;
            canvas.height = h;
            context.drawImage(video, 0, 0,w,h);

            var dataURL = canvas.toDataURL();
            var blob = appScope.dataURItoBlob(dataURL);
            document.getElementById('course-img').src = dataURL;
            MainService.upload(blob, 'lecture', appScope.currentLecture.idCourse, appScope.currentLecture.idLecture);
        };
        video.load();
        return 'https://s3-us-west-2.amazonaws.com/bimolive-pictures/course_pics/' + appScope.currentLecture.idCourse + '/' + appScope.currentLecture.idLecture;
    };
    this.dataURItoBlob = function(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var bb = new Blob([ab], {type: 'image/png'});
        return bb;
    };
    this.wait = function (ms){
        var start = new Date().getTime();
        var end = start;
        while(end < start + ms) {
            end = new Date().getTime();
        }
    }
    this.updateData = function () {
        $http({
            method: 'POST',
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/updatelecture',
            headers: {
                'Content-Type': undefined
            },
            data: this.currentLecture
        })
        .success(function (data, status) {
            if (data.result) {
                appScope.origLecture = JSON.parse(JSON.stringify(appScope.currentLecture));
                // TODO wait for img tag. 
                // document.getElementById('profile-img').src = appScope.currentLecture.image;
            } else {
                console.log('success but got ' + data.result);
            }
        })
        .error(function (data, status) {
        });
    };
    
    this.resetData = function () {
        this.currentLecture = JSON.parse(JSON.stringify(this.origLecture));
        document.getElementById('profile-img').src = this.origLecture.image;
    };
    
    $('#lectureReplay').change(function (event) {
        var files = event.target.files;
        var profile_pic = files[0];
        MainService.upload(profile_pic, 'lectureReplay', appScope.currentLecture.idCourse, appScope.currentLecture.idLecture, appScope.uploadReplay);
    });
        
}]);