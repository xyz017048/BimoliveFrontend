'use strict';


angular.module('bimoliveApp')
/**
 * Controller for teacher view
 */
.controller('CourseCtrl', ['$controller', function ($controller) {
    // fetch teacher controller
    var TeacherCtrl = $controller('TeacherCtrl');

    // fetch mycourses from teacher controller
    this.myCourses = TeacherCtrl.myCourses;
    // link function to teache controller
    this.viewNumber = TeacherCtrl.getViewNumber();
    
    // initialize form
    this.newCourseForm = '';
    
    // initialize course
    function createNewCourse() {
        return {'name': '',
        'category': '',
        'level': '',
        'startDate': '',
        'endDate': ''};    
    }
    
    this.newCourse = createNewCourse();
    
    // FAKE !
    function getCategories() {
        return ['CS', 'ECE', 'CE'];
    }
    
    // FAKE !
    function getLevels() {
        return ['1', '2', '3', '4', '5'];
    }
    
    // FAKE ! We may or may not need this
    this.checkNewCourseValid = function () {
        if (this.newCourseForm.$invalid || !this.isStartDateValid || !this.isStartDateValid) {
            this.newCourseForm.newCourseName.$setDirty();
            this.newCourseForm.category.$setDirty();
            this.newCourseForm.level.$setDirty();
            this.newCourseForm.startDate.$setDirty();
            this.newCourseForm.endDate.$setDirty();
            return false;   
        } else {
            return true;
        }
    }
   
    this.categories = getCategories();
    this.levels = getLevels();
    
    // FAKE ! Real one should send the course info to server and create a new course
    this.createNewCourse = function () {
        if (this.checkNewCourseValid()) {
            alert('name: ' + this.newCourse.name + '\n' +
                ' category: ' + this.newCourse.category + '\n' +
                ' level: ' + this.newCourse.level + '\n' +
                ' Start Date: ' + this.newCourse.startDate + '\n' +
                ' End Date: ' + this.newCourse.endDate);   
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