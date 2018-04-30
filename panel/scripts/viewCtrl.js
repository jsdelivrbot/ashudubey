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


    $scope.update_priority = function (item) {
        CommonData.update_priority(item,function (err, data) {
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

    var validationArray = ['ticket_number'];


    $scope.view_ticket_report = function () {
        $scope.report_data = []
        $scope.ErrorMsg = ''
        for (x in validationArray) {
            if ($scope.emp[validationArray[x]] == null || $scope.emp[validationArray[x]] == undefined) {
                $scope.ErrorMsg = "Please Enter " + validationArray[x];
                return $scope.ErrorMsg;
            }
        }
        $scope.Loader = true;
        CommonData.view_ticket_report($scope.emp.ticket_number, function (err, data) {
            $scope.Loader = false;
            if (!err) {
                $scope.report_data = data;


            }
            else {
                $scope.ErrorMsg = err
            }
        })

    };


    $scope.load_ticket_data = function () {

        $scope.Loader = true;

        CommonData.load_ticket_data($scope.ticket_report, function (err, data) {
            $scope.Loader = false;
            if (!err) {

                $scope.report_data = data;
                console.log(data[0].date);

            }
            else {
                alertify.alert(err.msg)

            }
        })
    }

    if($scope.isLogined)
        $scope.load_ticket_data();




    $scope.export_ticket_data = function () {

        $scope.Loader = true;

        CommonData.load_ticket_data($scope.ticket_report,function (err,data) {
            $scope.Loader = false;
            if(!err){

                delete data[0]._id;
                delete data[0].date;
                console.log(data);

                alasql('SELECT * INTO XLSX("It_report.xlsx",{headers:true}) FROM ?', [data]);


            }


        })

    }







});

