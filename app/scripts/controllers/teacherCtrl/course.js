'use strict';


angular.module('bimoliveApp')
/**
 * Controller for teacher view
 */
.controller('CourseCtrl', ['$controller', function ($controller) {
    // fetch teacher controller
    var TeacherCtrl = $controller('TeacherCtrl');

    this.myCourses = TeacherCtrl.myCourses;
    this.viewNumber = TeacherCtrl.getViewNumber();
    this.newCourseForm = '';
    function createNewCourse() {
        return {'name': '',
        'category': '',
        'level': '',
        'startDate': '',
        'endDate': ''};    
    }
    
    this.newCourse = createNewCourse();
    
    function getCategories() {
        return ['CS', 'ECE', 'CE'];
    }
    
    function getLevels() {
        return ['1', '2', '3', '4', '5'];
    }
    
    function checkNewCourseValid() {
        return true;
    }
    
    this.categories = getCategories();
    this.levels = getLevels();
    
    this.createNewCourse = function () {
        if (checkNewCourseValid()) {
            alert('name: '+ this.newCourse.name + ' category: ' + this.newCourse.category + ' level: ' + this.newCourse.level);   
            this.clearForm();
        }
    };
    
    this.clearForm = function () {
        // clear the feilds
        this.newCourse = createNewCourse();
        // hide the modal
        $('#addCourseModal').modal('hide');
        // hide set the form to be pristine
        this.newCourseForm.$setPristine();
    };
    
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

    this.setStartDate = function(year, month, day) {
        this.newCourseForm.startDate = new Date(year, month, day);
    };
    
    this.today = new Date();
    
    this.maxDate = new Date(2020, 5, 22);
    
    this.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
}]);