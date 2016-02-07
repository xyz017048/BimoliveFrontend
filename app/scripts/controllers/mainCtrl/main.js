'use strict';



angular.module('bimoliveApp')
/**
 * Controller for main view
 */
.controller('MainCtrl', ['$http', 'MainService', '$location', function ($http, MainService, $location) {
    
    var appScope = this;
    // getLiveLectures (videoInfo)
    $http( { 
        method: 'POST', 
        url: 'http://bimolive.us-west-2.elasticbeanstalk.com/livevideos',
        headers: {
            'Content-Type': undefined
        }
    } )
    .success(function(data, status) {
        // put video to UI
        appScope.liveVideos = data;
    })
    .error(function(data, status) {
        console.log(data);
        console.log(status);
        console.log('Request failed');
    });
    
    $http( { 
        method: 'POST', 
        url: 'http://bimolive.us-west-2.elasticbeanstalk.com/replayvideos',
        headers: {
            'Content-Type': undefined
        }
    } )
    .success(function(data, status) {
        // put video to UI
        appScope.replayVideos = data;
    })
    .error(function(data, status) {
        console.log(data);
        console.log(status);
        console.log('Request failed');
    });
    
    // Log in variables
    this.email = '';
    this.password = '';
    this.idUser = 0;
    this.username = '';
    
    // a variable for html only changed when refresh
    this.isLogin = MainService.getIsLogin();
    
    // Sign up variables
    this.signUpUsername = '';
    this.signUpEmail = '';
    this.signUpPassword = '';
    this.confirmPassword = '';
    
    //  I'm not sure what this part will do... Xueyang
    //  /**
    //  * Check the login status
    //  */
    // this.checkIsLogin = function() {
    //     return MainService.getIsLogin();
    // };
    
    /**
     * Clear Login
     */
    this.loginClear = function () {
        // clear the textbox
        this.email = '';
        this.password = '';
        this.idUser = 0;
        this.username = '';
        // hide the modal
        $('#loginModal').modal('hide');
        // hide set the form to be pristine
        this.loginForm.$setPristine();
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
    
    this.checkIsLoginValid = function () {
        this.loginForm.email.$setDirty();
        this.loginForm.password.$setDirty();
        if (!this.email || !this.password) {
            return false;
        } else {
            return true;
        }
    }
    
    /**
     * Validate the email and password
     */
    this.login = function() {
        // If the email is valid and defined and password is defined
        if(this.checkIsLoginValid()) {
            
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
                    
                    // Inject into MainService
                    MainService.setCurrentUser(data);
                    appScope.isLogin = true;
                    MainService.setIsLogin(true);
                    appScope.currentUser = MainService.getCurrentUser();

                    
                    // appScope.checkIsLoggedIn();
                } else {
                    alert('email or password is incorrect');   
                }
            })
            
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                console.log('Request failed');
            });
            
            // Clear the textbox
            this.loginClear();   
        } 
    };
    
    /**
     * Set isLogin to false, reset the toggle bar
     */
    this.logout = function() {
        this.isLogin = false;
        MainService.setIsLogin(false);
        this.currentUser = {};
        MainService.setCurrentUser(null);
        $location.url('/');
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
    
    this.usernameCheck = function() {
        
        var result = 0;
        
        // Serveice
        $http( { 
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/usernameCheck',
            headers: {
                'Content-Type': undefined
            },
            data: { username: this.signUpUsername }
        } )
        
        .success(function(data, status) {
            result = data.result;
        })
        
        .error(function(data, status) {
            
        });
        
        return function() { return result; };
    };
    
    this.emailCheck = function() {
        
        var result = 0;
        
        // Serveice
        $http( { 
            method: 'POST', 
            url: 'http://bimolive.us-west-2.elasticbeanstalk.com/emailCheck',
            headers: {
                'Content-Type': undefined
            },
            data: { email: this.signUpEmail }
        } )
        
        .success(function(data, status) {
            result = data.result;
        })
        
        .error(function(data, status) {
        });
        
        return function() { return result; };
    };
    
    /**
     * Sign up 
     */
    this.signUp = function() {
        // If the signUpUsername, signUpEmail and signUpPassword is valid and defined
        if(this.checkIsSignUpValid()) {
            
            // Assign app object in appScope
            var appScope = this;
            
            if ( this.usernameCheck() ) {
                
                if( this.emailCheck() ) {
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
                            appScope.isLogin = true;
                            MainService.setIsLogin(true);
                        }
                    })
                    
                    .error(function(data, status) {
                    });
                    
                    this.signUpClear();    
                } else {
                    alert( 'Email has been registered' );
                }
            } else {
                alert( 'Username is used' );
            }
        } 
    };
    
    // This is fake! Place holder for function that gets view number from server
    this.getViewNumber = function (coruseId) {
        return 10;
    };
    
    this.signUpForm = '';
    this.loginForm = '';
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

    this.currentUser = MainService.getCurrentUser();
}])

.factory('MainService', ['$http', function($http) { 
    
    var MainService = {};
    
    // Variables
    if (sessionStorage.getItem('user')===null) {
        MainService.CurrentUser = {};
    } else {
        MainService.CurrentUser = JSON.parse(sessionStorage.getItem('user'));
    }
    MainService.isLogin = sessionStorage.getItem('isLogin');
    
    
    // Getter and Setter
    MainService.getCurrentUser = function () {
        if (MainService.isLogin) {
            return MainService.CurrentUser;
        } else {
            return false;
        }
    };
    
    MainService.setCurrentUser = function(user) {
        if (user!==null) {
            sessionStorage.setItem('user', JSON.stringify(user));
        } else {
            sessionStorage.removeItem('user');
        }
        MainService.CurrentUser = user;
    };
    
    MainService.getIsLogin = function() {
        return MainService.isLogin;
    };
    
    MainService.setIsLogin = function(isLogin) {
        if (isLogin) {
            sessionStorage.setItem('isLogin', isLogin);
        } else {
            sessionStorage.removeItem('isLogin');
        }
        MainService.isLogin = isLogin;
    };
    
    return MainService;
}]);
