/**
 * Created by Ashu on 3/6/2018.
 */

var app = angular.module('app.problemType', []);

app.controller('problemCtrl', function ($scope, CommonData, apiSrv, Auth, $mdDialog) {


    $scope.isLogined = Auth.IsLogin();
    $scope.Loader = false;

    $scope.ticket_report = {
        SDate: new Date(),
        EDate: new Date()
    };


    // $scope.Edit = function () {
    //     $scope.name = ""
    // }

    $scope.status = '';
    $scope.customFullscreen = false;
    $scope.view_data = [];

    $scope.isEdit = false;

    $scope.view_problem_type = (function () {
        $scope.Loader = true;
        CommonData.view_problem_type(function (err, data) {
            $scope.Loader = false;
            if (!err) {
                $scope.view_data = data;
                console.log(data)
            }
            else {
                alertify.alert(err.msg)

            }
        })
    }());

    $scope.update_problem_type = function (item) {
        CommonData.update_problem_type(item._id, item.name, function (err, data) {
            $scope.Loader = false;
            console.log(data)
            if (!err) {

                alertify.alert('updated successfully');

            }
        })
    };

    $scope.showAdvanced = function (ev) {
        $mdDialog.show({
            controller: 'problemCtrl',
            templateUrl: 'templates/a.html',
            targetEvent: ev,
            clickOutsideToClose: true
        }).then(function (answer) {
            $scope.status = 'You said the information was "' + answer + '".';
        }, function () {
            $scope.status = 'You cancelled the dialog.';
        });
    };


});
