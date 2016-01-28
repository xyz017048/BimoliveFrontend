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
    
    
}]);