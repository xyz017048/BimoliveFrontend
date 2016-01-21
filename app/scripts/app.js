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
    'ngTouch'
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
        .when('/teacher', {
            templateUrl: 'views/teacherViews/teacherView.html',
            controller: 'TeacherCtrl',
            controllerAs: 'teacherCtrl'
        })
        .when('/student/:id', {
            templateUrl: 'views/studentViews/studentView.html',
            controller: 'StudentCtrl',
            controllerAs: 'studentCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});
