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
    this.isFinished = false;
   
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
            appScope.origLecture = JSON.parse(JSON.stringify(data));
            if (data.status === 'finish' || data.status === 'replay') {
                appScope.isFinished = true; 
            }
        })
        
        .error(function(data, status) {
        });
    }
    
    this.startLecture = function () {
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
    };
    
    this.uploadReplay = function (idUser, idLecture, url) {
        if (!url) {
            alert('Upload Lecture Failed!');
            return;
        }
        // appScope.captureImage(url);
        $http({
            method: 'POST',
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/uploadlecture',
            headers: {
                'Content-Type': undefined
            },
            data: {
                idUser: idUser,
                idLecture: idLecture,
                url: url
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
    // this.captureImage = function (video_src) {
    //     var video = document.createElement('video');
    //     video.setAttribute('src', video_src);
    //     var w = video.videoWidth;
    //     var h = video.videoHeight;
    //     var canvas = document.createElement('canvas');
    //     // canvas.width  = w;
    //     // canvas.height = h;
    //     var context = canvas.getContext('2d');
    //     context.drawImage(video, 0, 0, w, h);

    //     var dataURL = canvas.toDataURL();
    //     var img = document.createElement('img');
    //     img.setAttribute('src', dataURL);
    //     img.getAttribute('src');

    //     var downloadImage = function(data, filename) {
    //         var a = document.createElement('a');
    //         a.href = data;
    //         a.download = filename;
    //         document.body.appendChild(a);
    //         a.click();
    //     };
    //     download: function(config) {
    //       var dataURL = this.canvas.toDataURL('image/png'),
    //           anchor = document.createElement('a'),
    //           fileName, evtObj;

    //       if (!config) {
    //         config = {};
    //       }

    //       fileName = config.fileName || 'canvas.png',
    //       dataURL = dataURL.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');

    //       // set a attributes
    //       anchor.setAttribute('href', dataURL);
    //       anchor.setAttribute('target', '_blank');
    //       anchor.setAttribute('download', fileName);

    //       // simulate click
    //       if (document.createEvent) {
    //         evtObj = document.createEvent('MouseEvents');
    //         evtObj.initEvent('click', true, true);
    //         anchor.dispatchEvent(evtObj);
    //       }
    //       else if (anchor.click) {
    //         anchor.click();
    //       }
    //     }
    // };
    
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