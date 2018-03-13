'use strict';
angular.module('login', [])
    .controller('loginCtrl', function ($scope, Auth, $state, $rootScope) {

        $scope.Credetials = {};
        $scope.remember = false;
        $scope.reset_password_view = false;
        $scope.fgt_pwd_clicked = false;

        $scope.LogME = function () {
            Auth.Login($scope.Credetials, $scope.remember, function (data) {
                if (data.status) {
                    if ($rootScope.user.isResetPwd) {
                        var index = $rootScope.user.name.indexOf(" ");
                        if (index != -1) {
                            alertify.success("Hi" + " " + $rootScope.user.name.substr(0, index) + " " + "Welcome to V5 Employer Portal");
                        }
                        else {
                            alertify.success("Hi" + " " + $rootScope.user.name + " " + "Welcome to V5 Employer Portal");
                        }
                        $state.go('app.home');
                    }
                    else {
                        $scope.reset_password_view = true;
                    }
                }
                else {
                    alertify.error(data.msg);
                }
            })
        };

        $scope.forgot_password = function () {
            Auth.ForgotPwd($scope.Credetials, function (data) {
                if (data.status) {
                    alertify.alert("A temporary password has been sent to your email" + " " + "<b>" + data.email + "</b>" + " " + "please check and login again.");
                    $scope.reset_password_view = false;
                    $scope.fgt_pwd_clicked = false;
                }
                else {
                    alertify.error(data.msg);
                }
            })
        };

        $scope.reset_password = function () {
            $scope.Credetials.username = $rootScope.user.loginid;
            Auth.ResetPassword($scope.Credetials, function (data) {
                if (data.status) {
                    alertify.alert("Password has been reset successfully.");
                    $scope.reset_password_view = false;
                    $scope.fgt_pwd_clicked = false;
                }
                else {
                    alertify.error(data.msg);
                }
            })
        }
    });
