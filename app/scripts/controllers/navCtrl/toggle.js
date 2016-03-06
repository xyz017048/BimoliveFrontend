/*global $:false */
'use strict';



angular.module('bimoliveApp')
/**
 * Controller for toggle navigation view
 */
.controller('ToggleCtrl', function () {
    // toggle menu function
    this.bodyEl = $('body');
    this.isOpen = 0;
    this.toggleNav = function (flag) {
        if (flag === 1 && this.isOpen === 0) {
            this.bodyEl.toggleClass('active-nav');
            this.isOpen = 1;
        }
        if (flag === 0 && this.isOpen === 1) {
            this.bodyEl.toggleClass('active-nav');
            this.isOpen = 0;
        }

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
