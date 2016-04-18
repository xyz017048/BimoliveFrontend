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
        'scheduleDate': '',
        'startTime': '',
        'endTime': ''};
    }
    this.init = function () {
        this.getCurrentCourse();
        this.newLectureForm = '';
        this.newLecture = newLectureObject();
        this.newStartLecture = {'topic': '', 'intro': ''};
    };
    
    var appScope = this;
    this.newCourseForm = '';
    this.newStartLectureForm = '';    
    this.levels = [1 , 2, 3, 4, 5];
    this.isCourseNameValid = function () {
        if (this.currentCourse && (this.currentCourse.name.length <= 0 || this.currentCourse.name.length > 200)) {
            this.newCourseForm.newCourseName.$setValidity('name', false);
            return false;
        }
        else {
            return true;
        }
    };
    this.isCourseDescriptionValid = function() {
        if (this.currentCourse && (this.currentCourse.intro.length > 1000000)) {
            this.newCourseForm.intro.$setValidity('intro', false);
            return false;
        } else {
            return true;
        }
    }
    this.isStartDateValid = function () {
        if (this.currentCourse && (!this.currentCourse.startDate)) {
            this.startDateErrMsg = 'Start date is not valid.';
            return false; 
        }
        return true;
    };
    this.isEndDateValid = function () {
        if (this.currentCourse && (this.currentCourse.endDate)) {
            if (this.currentCourse.endDate < this.currentCourse.startDate) {
                this.endDateErrMsg = 'End date can not be earlier than start date.';
                return false;
            }   
        } else {
            this.endDateErrMsg = 'End date is not valid.';
            return false; 
        }
        return true;
    };
    // check if the form is valid
    this.checkNewCourseValid = function () {
        if (this.newCourseForm.$invalid || !this.isStartDateValid() || !this.isEndDateValid() || !this.isCourseNameValid() || !this.isCourseDescriptionValid()) {
            this.newCourseForm.newCourseName.$setDirty();
            this.newCourseForm.category.$setDirty();
            this.newCourseForm.level.$setDirty();
            this.newCourseForm.startDate.$setDirty();
            this.newCourseForm.endDate.$setDirty();
            return false;
        } else {
            return true;
        }
    };

    this.copyCourse = function (course) {
        var newCourse = JSON.parse(JSON.stringify(course));
        newCourse.startDate = new Date(course.startDate);
        newCourse.endDate = new Date(course.endDate);
        return newCourse;
    };
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
            appScope.currentCourse.startDate = new Date(data.startDate);
            appScope.currentCourse.endDate = new Date(data.endDate);
            appScope.origCourse = appScope.copyCourse(appScope.currentCourse);
            appScope.getLectureList();
            appScope.getCategories();
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

    this.getCategories = function () {
        //get all categories 
        appScope.categories = [];
        $http( { 
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/getcategory',
            headers: {
                'Content-Type': undefined
            }
        } )
        
        .success(function (data, status) {
            var length = data.length;
            for (var i = 0; i < length; i++) {
                var abbr = data[i].abbreviation.trim();
                var full = data[i].fullName.trim();
                appScope.categories.push(abbr + ' - ' + full);  
                if (appScope.currentCourse.category.trim() === abbr) {
                    appScope.currentCourse.category = abbr + ' - ' + full;
                    appScope.origCourse.category = abbr + ' - ' + full;
                }
            }
        })
        
        .error(function(data, status) {
            categories.push('Server error');    
        });
    };
    this.dateFormat = function(date) {
        
        var month = date.getMonth() + 1;
        
        month = month > 9 ? month : '0' + month;
        
        var day = date.getDate();
        
        day = day > 9 ? day : '0' + day;
        
        return date.getFullYear() + '-' + month + '-' + day + ' ' + '00:00:00';
    };
    this.updateData = function () {
        var appScopeCourse = this.currentCourse;
        var category = appScopeCourse.category.slice(0, appScopeCourse.category.indexOf(' '));
        if (this.checkNewCourseValid()) {
            $http({
                method: 'POST',
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/updatecourse',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    idCourse: appScopeCourse.idCourse,
                    idUser: appScopeCourse.idUser, 
                    category: category,
                    levelNumber: appScopeCourse.levelNumber,
                    name: appScopeCourse.name,
                    intro: appScopeCourse.intro,
                    startDate: appScope.dateFormat(appScopeCourse.startDate),
                    endDate: appScope.dateFormat(appScopeCourse.endDate),
                    permissionCode: appScopeCourse.permissionCode
                }
            })
            .success(function (data, status) {
                if (data.result) {
                    appScope.getCurrentCourse();
                } else {
                    console.log('success but got ' + data.result);
                }
            })
            .error(function (data, status) {
                alert('Server error, please try again.');    
            });
            this.clearCourseForm();
        }
    };
    /**
     * clears the form
     */
    this.clearCourseForm = function () {
        // clear the feilds
        this.currentCourse = appScope.copyCourse(appScope.origCourse);
        // hide the modal
        $('#courseSettingModal').modal('hide');
        // hide set the form to be pristine
        this.newCourseForm.$setPristine();
    };
    $('#courseSettingModal').on('hidden.bs.modal', function (e) {
        appScope.clearCourseForm();
    });
    this.resetData = function () {
        this.currentCourse = appScope.copyCourse(appScope.origCourse);
    };

    this.formatDateForDisplay = function (date) {
        if (date) {
            var month = date.getMonth() + 1;
            
            month = month > 9 ? month : '0' + month;
            
            var day = date.getDate();
            
            day = day > 9 ? day : '0' + day;
            return date.getFullYear() + '/' + month + '/' + day;
        }
    }    
    
    this.isLectureStartDateValid = function () {
        if (!this.newLecture.scheduleDate) {
            this.scheduleDateErrMsg = 'Schedule date is not valid.';
            return false; 
        } else if (this.newLecture.scheduleDate < this.currentCourse.startDate) {
            this.scheduleDateErrMsg = 'Schedule date can not be earlier than course start date ' + this.formatDateForDisplay(this.currentCourse.startDate);
            return false;             
        }
        return true;
    };
    this.checkNewLectureValid = function() {
        if (this.newLecture.$invalid || !this.isLectureStartDateValid()) {
            this.newLecture.topic.$setDirty();
            this.newCourseForm.scheduleDate.$setDirty();
            this.newCourseForm.startTime.$setDirty();
            this.newCourseForm.endTime.$setDirty();
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
                if (data.result && data.result !== -1) {
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
    this.getCurrentDate = function () {
        var date = new Date();
        return date;
    };
    this.getAnHourLater = function () {
        var date = new Date();
        if (date.getHours() === 23) {
            date.setMinutes(59);
        } else {
            date.setHours(date.getHours()+1);
            date.setMinutes(date.getMinutes());
        }
        return date;
    };
    this.isStartLectureValid = function () {
        if (!this.newStartLecture || this.newStartLecture.topic === '') {
            this.newStartLectureForm.topic.$setDirty();
            return false;
        } else {
            return true;
        }
    };
    this.createNewLectureAndStart = function() {
        if (this.isStartLectureValid()) {
            var month = this.getCurrentDate().getMonth() + 1;
            var date = this.getCurrentDate().getDate();
            var startHour = this.getCurrentDate().getHours();
            var startMin = this.getCurrentDate().getMinutes();
            var endHour = this.getAnHourLater().getHours();
            var endMin = this.getAnHourLater().getMinutes();
            var scheduleDate = this.getCurrentDate().getFullYear() +
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
                    "topic": this.newStartLecture.topic,
                    "intro": this.newStartLecture.intro,
                    "image": this.currentCourse.image,
                    "scheduleDate": scheduleDate,
                    "startTime": startTime,
                    "endTime": endTime
                }
            })
            .success(function (data, status) {
                if (data.result && data.result !== -1) {
                    var idLecture = data.result;
                    appScope.clearStartForm();
                    $('#addLectureAndStartModal').on('hidden.bs.modal', function (e) {
                        $http({
                            method: 'POST',
                            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/startlecture',
                            headers: {
                                'Content-Type': undefined
                            },
                            data: {
                                idUser: MainService.getCurrentUser().idUser,
                                idLecture: idLecture
                            }
                        })

                            .success(function (data, status) {
                                $location.url('/teacher/' + idLecture);
                            })

                            .error(function (data, status) {
                                alert('Start Lecture Failed!');
                            })
                    });
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
    this.clearStartForm = function () {
        this.newStartLecture = { 'topic': '', 'intro': '' };
        $('#addLectureAndStartModal').modal('hide');
        this.newStartLectureForm.$setPristine();
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
    /// lecture datePicker options  ///  
    this.popup1 = {
        opened: false
    };
    
    this.open1 = function() {
        this.popup1.opened = true;
    };
    
    this.minDate = this.origCourse ? this.origCourse.startDate : new Date();
    this.format = 'yyyy/MM/dd';
    this.maxDate = new Date(this.minDate.getFullYear() + 10, 5, 27);
    
    this.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    /////
    /**
     * course date picker function related
     */
    /////////// begin ///////////
    this.CoursePopup1 = {
        opened: false
    };
    this.popup2 = {
        opened: false
    };
    
    this.CourseOpen1 = function() {
        this.CoursePopup1.opened = true;
    };

    this.open2 = function() {
        this.popup2.opened = true;
    };
    
    this.today = new Date();
    
    /////////// end ///////////
}]);