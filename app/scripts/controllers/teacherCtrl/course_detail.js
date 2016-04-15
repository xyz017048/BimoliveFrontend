'use strict';


angular.module('bimoliveApp')
/**
 * Controller for teacher view
 */
.controller('CourseDetailCtrl', ['$http', '$routeParams', 'MainService', '$location', '$window', function ($http, $routeParams, MainService, $location, $window) {
    
    // if the user has not log in, redirect back and show the log in modal
    if (!MainService.getIsLogin()) {
        $location.url($window.history.back(1));
        $('#loginModal').modal('show'); 
    }
    
    this.idCourse = $routeParams.idCourse;
    this.cropper = '';
    this.isCropped = false;
    function newLectureObject() {
        return {'topic': '',
        'intro': '',
        'level': '',
        'scheduleDate': '',
        'startTime': '',
        'endTime': ''};
    }
    
    this.init = function () {
        this.getCurrentCourse();
        this.newLectureForm = '';
        this.newLecture = newLectureObject();
    };
    
    var appScope = this;
    
    this.getCurrentCourse = function () {
        // currentCourse
        $http( { 
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/singlecourse',
            headers: {
                'Content-Type': undefined
            },
            data: { 
                idCourse: this.idCourse, 
                idUser: MainService.getCurrentUser().idUser
            }
        } )
        .success(function(data, status) {
            appScope.currentCourse = data;
            appScope.origCourse = JSON.parse(JSON.stringify(data));
            appScope.getLectureList();
        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
    };

    this.getLectureList = function () {
        $http( { 
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/lectures',
            headers: {
                'Content-Type': undefined
            },
            data: { 
                idCourse: this.idCourse,
                idUser: MainService.getCurrentUser().idUser
            }
        } )
        .success(function(data, status) {
            appScope.lectureList = data;

        })
        .error(function(data, status) {
            console.log(data);
            console.log(status);
            console.log('Request failed');
        });
    };
    
    this.updateData = function () {
        $http({
            method: 'POST',
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/updatecourse',
            headers: {
                'Content-Type': undefined
            },
            data: this.currentCourse
        })
        .success(function (data, status) {
            if (data.result) {
                appScope.origCourse = JSON.parse(JSON.stringify(appScope.currentCourse));
            } else {
                console.log('success but got ' + data.result);
            }
        })
        .error(function (data, status) {
        });
    };
    
    this.resetData = function () {
        this.currentCourse = JSON.parse(JSON.stringify(this.origCourse));
    };

    this.formatDateForDisplay = function(date) {
        return date.slice(0, date.indexOf(' '));
    }    
    
    // FAKE, place holder for a function foring checking valivation
    this.checkNewLectureValid = function() {
        if (this.newLecture.topic === '') {
            alert('Please enter a topic');
            return false;
        } else if (this.newLecture.scheduleDate === '') {
            alert('Please select a schedule date');
        } else if (this.newLecture.startTime === '') {
            alert('Please select a start time');
            return false;
        } else if (this.newLecture.endTime === '') {
            alert('Please select a end time');
            return false;
        } else {
            return true;
        }

    };

    this.createNewLecture = function() {
        if (this.checkNewLectureValid()) {
            var month = this.newLecture.scheduleDate.getMonth() + 1;
            var date = this.newLecture.scheduleDate.getDate();
            var startHour = this.newLecture.startTime.getHours();
            var startMin = this.newLecture.startTime.getMinutes();
            var endHour = this.newLecture.endTime.getHours();
            var endMin = this.newLecture.endTime.getMinutes();
            var scheduleDate = this.newLecture.scheduleDate.getFullYear() +
                '-' + (month < 10 ? ('0' + month) : month) +
                '-' + (date < 10 ? ('0' + date) : date);
            var startTime = (startHour < 10 ? ('0' + startHour) : startHour) +
                ':' + (startMin < 10 ? ('0' + startMin) : startMin);
            var endTime = (endHour < 10 ? ('0' + endHour) : endHour) +
                ':' + (endMin < 10 ? ('0' + endMin) : endMin);
            $http({
                method: 'POST',
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/createlecture',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    "idCourse": this.idCourse,
                    "lectureNum": this.lectureList.length + 1,
                    "topic": this.newLecture.topic,
                    "intro": this.newLecture.intro,
                    "image": this.currentCourse.image,
                    "scheduleDate": scheduleDate,
                    "startTime": startTime,
                    "endTime": endTime
                }
            })
            .success(function (data, status) {
                if (data.result) {
                    appScope.clearForm();
                } else {
                    console.log("success but got " + data.result);
                }
            })
            .error(function (data, status) {
                console.log(data);
                console.log(status);
                console.log('Request failed');
            });
        }
    };

    this.clearForm = function () {
        this.newLecture = newLectureObject();
        $('#addLectureModal').modal('hide');
        this.newLectureForm.$setPristine();
        this.getLectureList();
    };
    
    $('#course_pic').change(function (event) {
        var files = event.target.files;
        var file = files[0];
        // read the image and display it on page
        var reader = new FileReader();
        reader.onload = function(event) {
            var dataUri = event.target.result,
                img     = document.getElementById('crop-image');
            img.src = dataUri;
            $('#cropModal').modal('show');       
        };
        reader.onerror = function(event) {
            console.error('File could not be read! Code ' + event.target.error.code);
        };
        reader.readAsDataURL(file);
    });
    
    this.crop = function () {
        var canvas = appScope.cropper.getCroppedCanvas();
        var src = canvas.toDataURL();
        appScope.croppedBlob = appScope.dataURItoBlob(src);
        appScope.cropper.destroy();        
        appScope.isCropped = true;
        document.getElementById('crop-image').src = src;
        document.getElementById('course-img').src = src;        
        // $('#cropModal').modal('hide');
    };
    
    this.uploadCoursePic = function () {
        appScope.currentCourse.image = MainService.upload(appScope.croppedBlob, 'course', appScope.currentCourse.idCourse);
        $('#cropModal').modal('hide');        
        appScope.updateData();
        appScope.isCropped = false;
    };
    $('#cropModal').on('shown.bs.modal', function (e) {
        var img = document.getElementById('crop-image');
        if (appScope.cropper !== '') {
            appScope.cropper.destroy();
        }
        appScope.cropper = new Cropper(img, {
            aspectRatio: 16 / 10
        });
    })
    $('#cropModal').on('hidden.bs.modal', function (e) {
        if (appScope.cropper !== '') {
            appScope.cropper.destroy();
        }
    })
    
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
    /// datePicker options  ///  
    this.popup1 = {
        opened: false
    };
    
    this.open1 = function() {
        this.popup1.opened = true;
    };
    
    this.minDate = new Date();
    this.format = 'yyyy/MM/dd';
    this.maxDate = new Date(this.minDate.getFullYear() + 10, 5, 27);
    
    this.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    this.isscheduleDateValid = function() {
        return true;
    };
    /////
}]);