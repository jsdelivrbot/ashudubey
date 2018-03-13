/**
 * Created by SanJeev on 23-06-2017.
 */

'use strict';
angular.module('toolbar', [])
    .controller('toolbarCtrl', ['$scope', '$rootScope', '$state','$location', function ($scope, $rootScope, $state,$location) {

        if($rootScope.user){
            var user_name = $rootScope.user.name.match(/\b(\w)/g);
            $scope.user_initials = user_name.join(' ');
        }

        $scope.ChangeRoute = function (path) {
            $state.go('app.' + path);
        };

        $scope.OnLogIN = function(){
            $state.go('login')
        };

        $scope.LogOut = function () {
            localStorage.clear();
            $rootScope.user = null;
            $state.go('login')
        };
    }]);
