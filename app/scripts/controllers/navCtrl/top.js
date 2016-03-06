'use strict';



angular.module('bimoliveApp')
/**
 * Controller for toggle navigation view
 */
.controller('TopCtrl', function ($location) {
    this.currentQ = '';

    this.search = function () {
        $location.url('/search/type=all&q=' + this.currentQ);
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