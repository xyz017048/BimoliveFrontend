'use strict';



angular.module('bimoliveApp')
/**
 * Controller for main view
 */
.controller('MainCtrl', function ($http) {
    
    // this is fake! place holder for the real function
    function getVideos () {
        var array = [];
        for (var i = 0; i < 11; i++) {
            var video = { "name": "video #" + i,
                "presenter": "Smith" + i,
                "id": i
            };
            array.push(video);
        }
        return array;
    }
    
    this.email = '';
    this.password = '';
    this.idUser = 0;
    this.username = '';
    this.isLoggedIn = false;
    
    /**
     * Check the login status
     */
    this.checkIsLoggedIn = function() {
        if(this.isLoggedIn === true) {
            alert('You are logged in!');
        }
    };
    
    this.clear = function () {
        // clear the textbox
        this.email = '';
        this.password = '';
        this.idUser = 0;
        this.username = '';
    };
    
    /**
     * Validate the email and password
     */
    this.login = function() {
        // If the email is valid and defined and password is defined
        if(this.email && this.password) {
            
            // Assign app object in appScope
            var appScope = this;
            
            // Serveice
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/login',
                 headers: {
                    'Content-Type': undefined
                },
                data: { email: this.email, password: this.password }
            } )
            
            .success(function(data, status) {
                if(data.result) {
                    appScope.email = data.email;
                    appScope.idUser = data.idUser;
                    appScope.username = data.username;
                    appScope.isLoggedIn = true;
                    appScope.checkIsLoggedIn();
                }

            })
            
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                console.log('Request failed');
            });
                
        } else {
            alert('error');
        }
        // clear the textbox
        this.clear();
    };
    
    /**
     * Set isLogIn to false, reset the toggle bar
     */
    this.logout = function() {
        this.isLoggedIn = false;
    };
    
    this.videoInfo = getVideos();
    
    // this is fake! Place holder for function that gets view number from server
    this.getViewNumber = function (coruseId) {
        return 10;
    };
    
});
