/*global $:false */
'use strict';



angular.module('bimoliveApp')
/**
 * Controller for toggle navigation view
 */
.controller('ToggleCtrl', function () {
    // toggle menu function
    var bodyEl = $('body'),
        navToggleBtn = bodyEl.find('.nav-toggle-btn');

    navToggleBtn.on('click', function (e) {
        bodyEl.toggleClass('active-nav');
        e.preventDefault();
    });
})
/**
 * Directive for top navigation
 */
.directive('topNav', function () {
    return {
        restrict: 'E',
        templateUrl: 'views/navViews/topNav.html'
    };
})
/**
 * Directive for toggle navigation
 */
.directive('toggleNav', function () {
    return {
        restrict: 'E',
        templateUrl: 'views/navViews/toggleNav.html',
        controller: 'ToggleCtrl',
        controllerAs: 'toggleCtrl'
    };
});
