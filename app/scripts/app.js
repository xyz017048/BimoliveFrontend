'use strict';

/**
 * @ngdoc overview
 * @name bimoliveApp
 * @description
 * # bimoliveApp
 *
 * Main module of the application.
 */
angular.module('bimoliveApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'
])
.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/mainViews/main.html',
            controller: 'MainCtrl',
            controllerAs: 'mainCtrl'
        })
        .when('/about', {
            templateUrl: 'views/otherViews/about.html',
            controller: 'AboutCtrl',
            controllerAs: 'aboutCtrl'
        })
        .when('/profile', {
            templateUrl: 'views/otherViews/profile.html',
            controller: 'ProfileCtrl',
            controllerAs: 'profileCtrl'
        })
        .when('/teacher', {
            templateUrl: 'views/teacherViews/teacherView.html',
            controller: 'TeacherCtrl',
            controllerAs: 'teacherCtrl'
        })
        .when('/mycourses', {
            templateUrl: 'views/teacherViews/mycoursesView.html',
            controller: 'CourseCtrl',
            controllerAs: 'courseCtrl'
        })
        .when('/coursedetail/:idCourse', {
            templateUrl: 'views/teacherViews/coursedetailView.html',
            controller: 'CourseDetailCtrl',
            controllerAs: 'courseDetailCtrl'
        })
        .when('/lecturedetail/:idLecture', {
            templateUrl: 'views/teacherViews/lecturedetailView.html',
            controller: 'LectureDetailCtrl',
            controllerAs: 'lectureDetailCtrl'
        })
        .when('/student/:id', {
            templateUrl: 'views/studentViews/studentView.html',
            controller: 'StudentCtrl',
            controllerAs: 'studentCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
     
})
.config(['$httpProvider', function ($httpProvider) {

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    
}]);