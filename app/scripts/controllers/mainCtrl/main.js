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
    this.isLogIn = false;
    
    /**
     * Check the login status
     */
    this.isLogin = function() {
        if(this.isLogIn === true) {
            alert('You are logined');
        }
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
                    appScope.isLogIn = true;
                    appScope.isLogin();
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
    };
    
    /**
     * Set isLogIn to false, reset the toggle bar
     */
    this.logout = function() {
        this.isLogIn = false;
    };
    
    this.videoInfo = getVideos();
    
});
