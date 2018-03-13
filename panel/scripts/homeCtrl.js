/**
 * Created by SanJeev on 23-06-2017.
 */

var app = angular.module('home', []);

app.controller('homeCtrl', function ($scope, $http, $rootScope, Auth, CommonData, $timeout) {
    $scope.isLogined = Auth.IsLogin();

});





app.directive("limitTo", [function () {
    return {
        restrict: "A",
        link: function (scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function (e) {
                if (this.value.length === limit) e.preventDefault();
            });
        }
    }
}]);

