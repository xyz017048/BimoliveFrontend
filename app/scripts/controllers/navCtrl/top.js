'use strict';



angular.module('bimoliveApp')
/**
 * Controller for toggle navigation view
 */
.controller('TopCtrl', function ($location) {
    this.words = '';

    this.search = function () {
        $location.url('/search?type=all&words=' + this.words);
    };
})
/**
 * Directive for top navigation
 */
.directive('topNav', function () {
    return {
        restrict: 'E',
        templateUrl: 'views/navViews/topNav.html',
        controller: 'TopCtrl',
        controllerAs: 'topCtrl'
    };
})