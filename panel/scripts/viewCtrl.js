/**
 * Created by Ashu on 3/6/2018.
 */

var app = angular.module('app.viewTicket', []);

app.controller('viewCtrl', function ($scope, CommonData, apiSrv, Auth) {

    $scope.isLogined = Auth.IsLogin();
    $scope.Loader = false;

    $scope.emp = {};
    $scope.ticket_report = {
        SDate: new Date(),
        EDate: new Date()
    };

    $scope.update_data = function (item) {
        CommonData.update_data(item,function (err, data) {
            $scope.Loader = false;
            if (!err) {
                console.log(data);
                alertify.alert('updated successfully');

            }
        })
    };

    $scope.show_view = false;
    $scope.report_data = [];

    $scope.showEdit = false;

    $scope.view_ticket_report = function () {
        CommonData.view_ticket_report($scope.emp.ticket_number, function (err, data) {
            if (!err) {
                $scope.report_data = data;
            }
            else {
                alert('Some Error');
            }
        })

    };

    $scope.load_ticket_data = function () {
        $scope.Loader = true;
        CommonData.load_ticket_data($scope.ticket_report, function (err, data) {
            $scope.Loader = false;
            if (!err) {

                $scope.report_data = data;

            }
            else {
                alertify.alert(err.msg)

            }
        })


    }
    $scope.load_ticket_data();


});

