'use strict';


angular.module('bimoliveApp')
/**
 * Controller for teacher view
 */
.controller('CourseCtrl', ['$http', 'MainService', '$location', '$window', function ($http, MainService, $location, $window) {
    
    // if the user has not log in, redirect back and show the log in modal
    if (!MainService.getIsLogin()) {
        $location.url($window.history.back(1));
        $('#loginModal').modal('show'); 
    }
    
    this.myCourses = [];
    var appScope = this;
    
    this.getCourseList = function () {
        
        if(MainService.getCurrentUser().roleLevel === 2)
        {
            appScope.myCourses = [];
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/courses',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    idUser: MainService.getCurrentUser().idUser
                }
            } )
            
            .success(function (data, status) {
                // appScope.myCourses = [];
                var length = data.length;
                for (var i = 0; i < length; i++) {
                    appScope.myCourses.push(data[i]);
                }
            })
            
            .error(function(data, status) {
            });

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
                    appScope.categories.push(data[i].abbreviation + ' - ' + data[i].fullName);
                }
            })
            
            .error(function(data, status) {
                categories.push('Server error');    
            });
        }
        
    }
    
    // this is fake! Place holder for function that gets view number from server
    this.getViewNumber = function (coruseId) {
        return 10;
    };
    
    //this.currentCourse = 'ss';
    //this.setCurrentCourse = function (CurrentCourse) {
    //    course.setCurrentCourse(CurrentCourse);
    // };
     
    // fetch mycourses from teacher controller

    // link function to teache controller
    this.viewNumber = this.getViewNumber();
    
    // initialize form
    this.newCourseForm = '';
    
    // initialize course
    function createNewCourse() {
        return {'name': '',
        'category': '',
        'level': '',
        'startDate': '',
        'endDate': '',
        'intro': '',
        'image': '',
        'permissionCode': ''};    
    }
    
    this.newCourse = createNewCourse();
    
    
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

    this.levels = ['1', '2', '3', '4', '5'];
    
    this.dateFormat = function(date) {
        
        var month = date.getMonth() + 1;
        
        month = month > 9 ? month : '0' + month;
        
        var day = date.getDate();
        
        day = day > 9 ? day : '0' + day;
        
        return date.getFullYear() + '-' + month + '-' + day + ' ' + '00:00:00';
               // date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
    };

    this.isCourseNameValid = function() {
        if (this.newCourse.name.length <= 0 || this.newCourse.name.length > 200) {
            this.newCourseForm.newCourseName.$setValidity('name', false);
            return false;
        }
        else {
            return true;
        }
    }

    this.isCourseDescriptionValid = function() {
        if (this.newCourse.intro.length > 1000000) {
            this.newCourseForm.intro.$setValidity('intro', false);
            return false;
        } else {
            return true;
        }
    }    
    this.formatDateForDisplay = function(date) {
        return date.slice(0, date.indexOf(' '));
    }

    /**
     * 
     */
    this.addCourseToServer = function () {
        
        var appScopeCourse = this.newCourse;
        var category = appScopeCourse.category.slice(0, appScopeCourse.category.indexOf(' '));
        if (this.checkNewCourseValid()) {
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/teacher/createcourse',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    idUser: MainService.getCurrentUser().idUser, 
                    category: category,
                    levelNumber: appScopeCourse.level,
                    name: appScopeCourse.name,
                    intro: appScopeCourse.intro,
                    image: 'https://s3-us-west-2.amazonaws.com/bimolive-pictures/course_pics/'+ category +'.png',
                    startDate: appScope.dateFormat(appScopeCourse.startDate),
                    endDate: appScope.dateFormat(appScopeCourse.endDate),
                    endFlag: 1,
                    permissionCode: appScopeCourse.permissionCode
                }
            } )
            
            .success(function(data, status) {
                // yyyy-MM-dd hh:mm:ss
                /*
                alert(MainService.getCurrentUser().idUser + '-' +
                      appScopeCourse.category + '-' +
                      appScopeCourse.level + '-' +
                      appScopeCourse.name + '-' +
                      appScope.dateFormat(appScopeCourse.startDate) + '-' + 
                      appScope.dateFormat(appScopeCourse.endDate)
                    );
                alert(data.result);
                // */
                if (!data.result) {
                    alert('Server error, please try again!');
                }
                appScope.getCourseList();
            })
            
            .error(function(data, status) {
            });
            
            this.clearForm();
        }
    };
    
    /**
     * clears the form
     */
    this.clearForm = function () {
        // clear the feilds
        this.newCourse = createNewCourse();
        // hide the modal
        $('#addCourseModal').modal('hide');
        // hide set the form to be pristine
        this.newCourseForm.$setPristine();
    };
    
    this.startDateErrMsg = '';
    this.isStartDateValid = function () {
        if (!this.newCourse.startDate) {
            this.startDateErrMsg = 'Start date is not valid.';
            return false; 
        }
        return true;
    };
    
    this.endDateErrMsg = '';
    this.isEndDateValid = function () {
        if (this.newCourse.endDate) {
            if (this.newCourse.endDate < this.newCourse.startDate) {
                this.endDateErrMsg = 'End date can not be earlier than start date.';
                return false;
            }   
        } else {
            this.endDateErrMsg = 'End date is not valid.';
            return false; 
        }
        return true;
    };
    /**
     * date picker function related
     */
    /////////// begin ///////////
    this.popup1 = {
        opened: false
    };
    this.popup2 = {
        opened: false
    };
    
    this.open1 = function() {
        this.popup1.opened = true;
    };

    this.open2 = function() {
        this.popup2.opened = true;
    };
    
    this.today = new Date();
    this.format = 'yyyy/MM/dd';
    this.maxDate = new Date(this.today.getFullYear() + 10, 5, 27);
    
    this.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    /////////// end ///////////
    
}]);