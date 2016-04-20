'use strict';



angular.module('bimoliveApp')
/**
 * Controller for main view
 */
.controller('MainCtrl', ['$http', 'MainService', '$location', function ($http, MainService, $location) {
    
    var appScope = this;
    this.init = function () {
        this.getLiveVideo();
        this.getReplayVideo();
        $("#cover-video-caption").css({'padding-top': $("#homepage-video").height()/2 + $("#homepage-video").height()*0.1 - $("#cover-video-caption").height(), 'padding-bottom': $("#homepage-video").height()/2});
    };
    $(window).resize(function() {
        $("#cover-video-caption").css({'padding-top': $("#homepage-video").height()/2 - $("#cover-video-caption").height(), 'padding-bottom': $("#homepage-video").height()/2});
    });
    this.scrollDown = function() {
        $('html, body').animate({
            scrollTop: $("#live-videos").offset().top
        }, 1000);
    };
    // getLiveLectures (videoInfo)
    this.getLiveVideo = function () {
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
    };
    
    this.getReplayVideo = function () {
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
    };
    
    // Log in variables
    this.email = '';
    this.password = '';
    this.idUser = 0;
    this.username = '';
    
    // a variable for html only changed when refresh
    this.isLogin = function() {
        return MainService.getIsLogin();
    };
    
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
    };
    
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
                    // appScope.isLogin = true;
                    MainService.setIsLogin(true);
                    appScope.currentUser = MainService.getCurrentUser();

                    
                    // appScope.checkIsLoggedIn();
                } else {
                    alert('Email or password is incorrect.');   
                }
            })
            
            .error(function(data, status) {
                console.log(data);
                console.log(status);
                console.log('Request failed');
                alert('Server error, please try again later.');
            });
            
            // Clear the textbox
            this.loginClear();   
        } 
    };
    
    /**
     * Set isLogin to false, reset the toggle bar
     */
    this.logout = function() {
        // this.isLogin = false;
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
            if (data.result) {
                appScope.emailCheck();
            } else {
                alert('Username has been used.');
            }
        })
        
        .error(function(data, status) {
            
        });
        
    };
    
    this.emailCheck = function() {
        
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
            if (data.result) {
                appScope.realSignUp();
            } else {
                alert('Email has been used.');
            }
        })
        
        .error(function(data, status) {
        });
        
    };
    
    this.realSignUp = function () {
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
                // appScope.isLogin = true;
                MainService.setIsLogin(true);
                // Inject into MainService
                MainService.setCurrentUser(data);
                appScope.currentUser = data;
                alert('Sign up successful.');
            } else {
                alert('Sign up failed! Please try again.');
            }
        })
        .error(function (data, status) {
            
        });
        
        this.signUpClear();
    };
    
    /**
     * Sign up 
     */
    this.signUp = function() {
        // If the signUpUsername, signUpEmail and signUpPassword is valid and defined
        if(this.checkIsSignUpValid()) {
            this.usernameCheck();
        } 
    };
    
    // This is fake! Place holder for function that gets view number from server
    this.getViewNumber = function (coruseId) {
        return 10;
    };
    
    this.signUpForm = '';
    this.loginForm = '';
    this.usernameErrMsg = 'Username is required.';
    this.emailErrMsg = 'Email is required.';
    this.passwordErrMsg = 'Password is required.';
    this.confirmPasswordErrMsg = 'Confirm password is required.';
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
    if (localStorage.getItem('user') !== null) {
        MainService.CurrentUser = JSON.parse(localStorage.getItem('user'));
    } else {
        MainService.CurrentUser = {};
        
    }
    MainService.isLogin = localStorage.getItem('isLogin');
    
    
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
            localStorage.setItem('user', JSON.stringify(user));
            // Default is 3 hours
            localStorage.setItem('expiration', new Date().getTime() + 3 * 60 * 60 * 1000);
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('expiration');
        }
        MainService.CurrentUser = user;
        
        /*
        if(localStorage.getItem('expiration')) {
            var expirationTimeOut = setInterval(function() {
                if(localStorage.getItem('expiration')) {
                    if(localStorage.getItem('expiration') < new Date().getTime()) {
                        console.log('login is expired');
                        if (localStorage.getItem('isLogin') !== null) {
                            localStorage.setItem('isLogin', false);
                        }
                        MainService.isLogin = false;
                        localStorage.removeItem('user');
                        localStorage.removeItem('expiration');
                        clearInterval(expirationTimeOut);
                        location.reload();
                    }
                }
            }, 1000);
        }
        */
    };
    
    // Is expired?
    MainService.getIsLogin = function() {
        if(localStorage.getItem('expiration')) {
            if(localStorage.getItem('expiration') < new Date().getTime()) {
                console.log('login is expired');
                MainService.setIsLogin(false);
                MainService.setCurrentUser(null);
            }
        }
        
        return MainService.isLogin;
    };
    
    MainService.setIsLogin = function(isLogin) {
        if (isLogin) {
            localStorage.setItem('isLogin', isLogin);
        } else {
            localStorage.removeItem('isLogin');
        }
        MainService.isLogin = isLogin;
    };

    MainService.showProgress = function(purpose) {
        if (purpose === 'resume') {
            $('#progress-resume').show();
            $('#progress-resume-text').show();
        } else if (purpose === 'resume-modal') {
            $('#progress-resume-modal').show();
            $('#progress-resume-modal-text').show();
        } else if (purpose !== 'lecture') {
            $('#progress').show();
            $('#progress-text').show();
        }
    };

    MainService.hideProgress = function(purpose) {
        if (purpose === 'resume') {
            $('#progress-resume').hide();
            $('#progress-resume-text').hide();
        } else if (purpose === 'resume-modal') {
            $('#progress-resume-modal').hide();
            $('#progress-resume-modal-text').hide();
        } else if (purpose !== 'lecture') {
            $('#progress').hide();
            $('#progress-text').hide();
        }
    };

    MainService.setProgress = function(purpose, percentage) {
        if (purpose === 'resume') {
            $('#progress-bar-resume').attr('style', 'width:' + percentage + '%');
            $('#progress-bar-resume').attr('aria-valuenow', percentage);
            $('#progress-resume-text').text(percentage + '%');
        } else if (purpose === 'resume-modal') {
            $('#progress-bar-resume-modal').attr('style', 'width:' + percentage + '%');
            $('#progress-bar-resume-modal').attr('aria-valuenow', percentage);
            $('#progress-resume-modal-text').text(percentage + '%');
        } else if (purpose !== 'lecture') {
            $('#progress-bar').attr('style', 'width:' + percentage + '%');
            $('#progress-bar').attr('aria-valuenow', percentage);
            $('#progress-text').text(percentage + '%');
        }
    };    
        
    /**
     * upload function, file is the file object
     * filePurpose is the purpose of this file, 
     * possible values: 'profile', 'resume', 'course', 'lecture', 'lectureReplay'
     * it will return a url of the uploaded file, it will return '' if anything goes wrong.
     * CallBackFunction is the function will be called during and after upload.
     */
    MainService.upload = function (file, filePurpose, courseId, lectureId, callBackFunction) {
        MainService.showProgress(filePurpose);
        AWS.config.update({ accessKeyId: 'AKIAIJG57SRTCKPYBGJA', secretAccessKey: '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' });
        AWS.config.region = 'us-west-2';
        var bucket = new AWS.S3({ params: { Bucket: 'bimolive-pictures' } });
        bucket.config.httpOptions.timeout = 60000 * 10;
        if (file) {
            var key = '';
            if (filePurpose === 'profile') {
                key = 'profile_pics/' + MainService.getCurrentUser().idUser;
            } else if (filePurpose === 'resume' || filePurpose === 'resume-modal') {
                key = 'resume/' + MainService.getCurrentUser().idUser;
            } else if (filePurpose === 'course') { 
                if (courseId) {
                    key = 'course_pics/' + courseId + '/' + 'course';
                } else {
                    MainService.hideProgress(filePurpose);
                    return '';
                }
            } else if (filePurpose === 'lectureReplay') {
                if (courseId) {
                    key = 'replayVideos/' + courseId + '/' + lectureId + '.mp4';
                } else {
                    MainService.hideProgress(filePurpose);
                    return '';
                }
            }else if (filePurpose === 'lecture') {
                if (courseId) {
                    key = 'course_pics/' + courseId + '/' + lectureId;
                } else {
                    MainService.hideProgress(filePurpose);
                    return '';
                }
            } else {
                alert('Upload Failed! Please try again.');
                MainService.hideProgress(filePurpose);
                return '';
            }
            
            var params = { Key: key, ContentType: file.type, Body: file, ServerSideEncryption: 'AES256', ACL: 'public-read'};
            bucket.putObject(params, function (err, data) {
                if(err) {
                    // There Was An Error With Your S3 Config
                    alert(err.message);
                    MainService.hideProgress(filePurpose);
                }
                else {
                    // Success!
                    MainService.hideProgress(filePurpose);
                    MainService.setProgress(filePurpose, 0);
                    if (callBackFunction) {
                        callBackFunction(MainService.getCurrentUser().idUser, lectureId, 'https://s3-us-west-2.amazonaws.com/bimolive-pictures/' + key);   
                    }
                    if (filePurpose === 'profile') {
                        document.getElementById('profile-img').src = 'https://s3-us-west-2.amazonaws.com/bimolive-pictures/' + key;                        
                    } else if (filePurpose === 'course') {
                        document.getElementById('course-img').src = 'https://s3-us-west-2.amazonaws.com/bimolive-pictures/' + key;                        
                    } else if (filePurpose === 'lecture') {
                        document.getElementById('course-img').src = 'https://s3-us-west-2.amazonaws.com/bimolive-pictures/' + key;                        
                    }
                }
            })
            .on('httpUploadProgress', function (progress) {
                if (progress) {
                    var percentage = Math.round(progress.loaded / progress.total * 100);
                    MainService.setProgress(filePurpose, percentage);
                }

            });
            return 'https://s3-us-west-2.amazonaws.com/bimolive-pictures/' + key;
        }
        else {
            // No File Selected
            MainService.hideProgress(filePurpose);
            alert('No File Has Been Selected.');
            return '';
        }
    };
    
    return MainService;
}]);
