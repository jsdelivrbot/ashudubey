/**
 * Created by Ashu on 3/6/2018.
 */

var app = angular.module('app.raiseTicket', []);

app.controller('raiseCtrl', function ($scope, CommonData, apiSrv) {

    $scope.Loader = false;

    $scope.emp = {};


    $scope.show_view = false;

    $scope.dropDown_data = [];

    $scope.get_dropdown_data = function () {
        CommonData.get_dropdown_data(function (err, data) {
            if (!err) {

                console.log(data);

                $scope.dropDown_data = data;
            }
            else {
                alert('Some Error');
            }
        })

    };


    var ValidationArray = ['name', 'email', 'mobile', 'location', 'problem_type', 'user_type', 'description', 'remarks']
    $scope.submit = function () {
        for (x in ValidationArray) {
            if ($scope.emp[ValidationArray[x]] == null || $scope.emp[ValidationArray[x]] == undefined) {
                $scope.ErrorMsg = "Please enter " + ValidationArray[x];
                return $scope.ErrorMsg;
            }
        }
        $scope.Loader = true;
        CommonData.submit_data($scope.emp, function (err, data) {
            $scope.Loader = false;
            if (!err) {
                alertify.alert('Your ticket   '+"<u><b>" + data['ticket_number'] +"</b></u>"+'  has been raised')
                $scope.emp = {}

            }
            else {
                alertify.alert(err.msg)

            }
        })
    };


    $scope.camelcase = function (text) {
        if ($scope.emp[text] != undefined && $scope.emp[text] != null && $scope.emp[text] != "" && $scope.emp[text] != "undefined") {
            $scope.emp[text] = $scope.emp[text].replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            })
        }
    };

});

