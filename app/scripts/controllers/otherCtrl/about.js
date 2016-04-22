'use strict';



angular.module('bimoliveApp')
/**
 * Controller for about view
 */
.controller('AboutCtrl', function () {
    this.scrollRegister = function() {
        $('html, body').animate({
            scrollTop: $("#register").offset().top-10
        }, 1000);
    };
    this.scrollWatchLive = function() {
        $('html, body').animate({
            scrollTop: $("#watchLive").offset().top-10
        }, 1000);
    };
    this.scrollWatchReplay = function() {
        $('html, body').animate({
            scrollTop: $("#watchReplay").offset().top-10
        }, 1000);
    };
    this.scrollFollow = function() {
        $('html, body').animate({
            scrollTop: $("#follow").offset().top-10
        }, 1000);
    };
    this.scrollSearch = function() {
        $('html, body').animate({
            scrollTop: $("#search").offset().top-10
        }, 1000);
    };
    this.scrollApply = function() {
        $('html, body').animate({
            scrollTop: $("#apply").offset().top-10
        }, 1000);
    };
    this.scrollOBSW = function() {
        $('html, body').animate({
            scrollTop: $("#OBSW").offset().top-10
        }, 1000);
    };
    this.scrollOBSM = function() {
        $('html, body').animate({
            scrollTop: $("#OBSM").offset().top-10
        }, 1000);
    };
    this.scrollCreate = function() {
        $('html, body').animate({
            scrollTop: $("#create").offset().top-10
        }, 1000);
    };
    this.scrollStart = function() {
        $('html, body').animate({
            scrollTop: $("#start").offset().top-10
        }, 1000);
    };
    this.scrollUpload = function() {
        $('html, body').animate({
            scrollTop: $("#upload").offset().top-10
        }, 1000);
    };
});
