'use strict';



angular.module('bimoliveApp')
/**
 * Controller for about view
 */
.controller('SearchCtrl', function ($routeParams, $http) {
    this.type = $routeParams.type;
    if (this.type === '') {
    	this.type = 'all';
    }
    this.words = $routeParams.words;
    this.courses = [];
    this.lectures = [];
    this.teachers = [];

    var appScope = this;

    function search(type, words) {
        if(words !== '')
        {
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/search',
                headers: {
                    'Content-Type': undefined
                },
                data: {
	                type: type,
	                words: words
                }
            } )
            .success(function (data, status) {
            	appScope.courses = data.courses;
            	appScope.lectures = data.lectures;
            	appScope.teachers = data.teachers;
            })
            .error(function(data, status) {
            });
        }
    }
    
    search(this.type, this.words);
});
