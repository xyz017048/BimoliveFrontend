'use strict';



angular.module('bimoliveApp')
/**
 * Controller for main view
 */
.controller('MainCtrl', function ($http) {
    
    // This is fake! place holder for the real function
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
    
    // Log in variables
    this.email = '';
    this.password = '';
    this.idUser = 0;
    this.username = '';
    
    // 
    this.isLoggedIn = false;
    
    // Sign up variables
    this.signUpUsername = '';
    this.signUpEmail = '';
    this.signUpPassword = '';
    this.confirmPassword = '';
    
    /**
     * Check the login status
     */
    this.checkIsLoggedIn = function() {
        if(this.isLoggedIn === true) {
            alert('You are logged in!');
        }
    };
    
    /**
     * Clear Login
     */
    this.logInClear = function () {
        // clear the textbox
        this.email = '';
        this.password = '';
        this.idUser = 0;
        this.username = '';
    };
    
    /**
     * Sign Up
     */
    this.signUpClear = function() {
        this.signUpUsername = '';
        this.signUpEmail = '';
        this.signUpPassword = '';
        this.confirmPassword = '';
        // hide the modal
        $('#signUpModal').modal('hide');
        // hide set the form to be pristine
        this.signUpForm.$setPristine();
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
        // Clear the textbox
        this.logInClear();
    };
    
    /**
     * Set isLogIn to false, reset the toggle bar
     */
    this.logout = function() {
        this.isLoggedIn = false;
    };
    
    this.checkIsSignUpValid = function () {
        
        this.signUpForm.username.$setDirty();
        this.signUpForm.email.$setDirty();
        this.signUpForm.password.$setDirty();
        this.signUpForm.confirmPassword.$setDirty();
            
        if (!this.checkUsernameValid() ||
            !this.checkEmailValid() ||
            !this.checkPasswordValid() ||
            !this.checkConfirmPasswordValid()) {
            return false;
        } else {
            return true;
        }
    };
    
    /**
     * Sign up 
     */
    this.signUp = function() {
        // If the signUpUsername, signUpEmail and signUpPassword is valid and defined
        if(this.checkIsSignUpValid()) {
            
            // Assign app object in appScope
            var appScope = this;
            
            // Serveice
            $http( { 
                method: 'POST', 
                url: 'http://bimolive.us-west-2.elasticbeanstalk.com/register',
                 headers: {
                    'Content-Type': undefined
                },
                data: { email: this.signUpEmail, username: this.signUpUsername, password: this.signUpPassword }
            } )
            
            .success(function(data, status) {
                if(data.result) {
                    appScope.isLoggedIn = true;
                    appScope.checkIsLoggedIn();
                }
            })
            
            .error(function(data, status) {
                });
            
            this.signUpClear();
        } else {
            // Remain error message
        }
    };
    
    this.videoInfo = getVideos();
    
    // This is fake! Place holder for function that gets view number from server
    this.getViewNumber = function (coruseId) {
        return 10;
    };
    
    this.signUpForm = '';
    
    this.usernameErrMsg = 'Username is required.';
    this.emailErrMsg = 'Email is required';
    this.passwordErrMsg = 'Password is required';
    this.confirmPasswordErrMsg = 'Confirm password is required';
    // This is FAKE! It's for checking if the user name is taken with the server
    function isUserNameTaken() {
        return false;
    }
    
    // This is FAKE! It's for checking if the email is already used
    function isEmailTaken() {
        return false;
    }
    
    // Check if use name is valid
    this.checkUsernameValid = function () {
        if (this.signUpForm.username.$invalid && !this.signUpForm.username.$pristine) {
            this.usernameErrMsg = 'Username is required.';
            return false;
        } else {
            if (isUserNameTaken()) {
                this.usernameErrMsg = 'Username is taken.';
                return false;
            } else {
                if (this.signUpUsername.indexOf(' ') >= 0) {
                    this.usernameErrMsg = 'Username can not have white spaces.';
                    return false;
                } 
            }
        }
        return true;
    };
    
    // Check if email is valid
    this.checkEmailValid = function () {
        if (this.signUpForm.email.$invalid && !this.signUpForm.email.$pristine) {
            this.emailErrMsg = 'Email is not valid.';
            return false;
        } else {
            if (isEmailTaken()) {
                this.emailErrMsg = 'Email is taken.';
                return false; 
            }
        }
        return true;
    };
    
    // Check if password is valid
    this.checkPasswordValid = function () {
        if (this.signUpForm.password.$invalid && !this.signUpForm.password.$pristine) {
            this.passwordErrMsg = 'Password is required.';
            return false;
        } 
        return true;
    };
    
    // Check if confirm password is valid
    this.checkConfirmPasswordValid = function () {
        if (!this.signUpForm.confirmPassword.$pristine) {
            if (!this.confirmPassword || this.signUpForm.confirmPassword.$invalid) {
                this.confirmPasswordErrMsg = 'Confirm password is required.';
                return false;
            } else if (this.signUpPassword !== this.confirmPassword) {
                this.confirmPasswordErrMsg = 'Two passwords should be the same.';
                return false;
            }   
        }
        return true;
    };
});
