/**
 * Created by Ashu on 3/6/2018.
 */

var app = angular.module('app.userType', []);

app.controller('userCtrl', function ($scope, CommonData, apiSrv, Auth, $mdDialog) {

    $scope.isLogined = Auth.IsLogin();
    $scope.Loader = false;

    $scope.ticket_report = {
        SDate: new Date(),
        EDate: new Date()
    };

    $scope.view_data = [];

    $scope.view_user_type = (function () {
        $scope.Loader = true;
        CommonData.view_user_type(function (err, data) {
            $scope.Loader = false;
            if (!err) {
                $scope.view_data = data;
            }
            else {
                alertify.alert(err.msg)

            }
        })
    }());

    $scope.update_user_type = function (item) {
        CommonData.update_user_type(item._id, item.name, function (err, data) {
            $scope.Loader = false;
            console.log(data)
            if (!err) {

                alertify.alert('updated successfully');

            }
        })
    };

    $scope.showAdvanced = function (ev) {
        $mdDialog.show({
            controller: 'userCtrl',
            templateUrl: 'templates/new_user.html',
            targetEvent: ev,
            escapeToClose: false,
            preserveScope:true,
            scope: $scope,
            clickOutsideToClose: false
        });
    };


    $scope.add_new_user_type = function (item) {
        CommonData.add_new_user_type(item.name, function (err, data) {
            $scope.Loader = false;
            if (!err) {
                $mdDialog.hide();
                alertify.alert('Added successfully');
                $scope.item={};
                $scope.view_data.unshift(data);
            }
        })
    };


});
