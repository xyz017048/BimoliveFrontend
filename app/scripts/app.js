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
            templateUrl: 'views/mainViews/main.html'
        })
        .when('/about', {
            templateUrl: 'views/otherViews/about.html',
            controller: 'AboutCtrl',
            controllerAs: 'aboutCtrl'
        })
        .when('/profile', {
            templateUrl: 'views/profileViews/profile.html',
            controller: 'ProfileCtrl',
            controllerAs: 'profileCtrl'
        })
        .when('/teacher/:idLecture', {
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
        .when('/followedCourses', {
            templateUrl: 'views/studentViews/followedCoursesView.html',
            controller: 'FollowCtrl',
            controllerAs: 'followCtrl'
        })
        .when('/followedTeachers', {
            templateUrl: 'views/studentViews/followedTeachersView.html',
            controller: 'FollowCtrl',
            controllerAs: 'followCtrl'
        })
        .when('/allCourses', {
            templateUrl: 'views/studentViews/allCoursesView.html',
            controller: 'AllCtrl',
            controllerAs: 'allCtrl'
        })
        .when('/allLive', {
            templateUrl: 'views/studentViews/allLiveView.html',
            controller: 'AllCtrl',
            controllerAs: 'allCtrl'
        })
        .when('/allReplay', {
            templateUrl: 'views/studentViews/allReplayView.html',
            controller: 'AllCtrl',
            controllerAs: 'allCtrl'
        })
        .when('/courseInfo/:courseid', {
            templateUrl: 'views/studentViews/courseInfoView.html',
            controller: 'InfoCtrl',
            controllerAs: 'infoCtrl'
        })
        .when('/lectureInfo/:lectureid', {
            templateUrl: 'views/studentViews/lectureInfoView.html',
            controller: 'InfoCtrl',
            controllerAs: 'infoCtrl'
        })
        .when('/teacherInfo/:teacherid', {
            templateUrl: 'views/studentViews/teacherInfoView.html',
            controller: 'InfoCtrl',
            controllerAs: 'infoCtrl'
        })
        .when('/admin', {
            templateUrl: 'views/adminViews/adminView.html',
            controller: 'AdminCtrl',
            controllerAs: 'adminCtrl'
        })
        .when('/search', {
            templateUrl: 'views/otherViews/searchView.html',
            controller: 'SearchCtrl',
            controllerAs: 'searchCtrl'
        })
        .when('/search?type=:type&words=:words', {
            templateUrl: 'views/otherViews/searchView.html',
            controller: 'SearchCtrl',
            controllerAs: 'searchCtrl'
        })
        .when('/instruction', {
            templateUrl: 'views/otherViews/instruction.html',
            controller: 'AboutCtrl',
            controllerAs: 'aboutCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
     
})
.config(['$httpProvider', function ($httpProvider) {

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    
}]);