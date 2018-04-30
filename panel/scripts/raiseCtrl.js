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


    var ValidationArray = ['name', 'email', 'mobile', 'location', 'problem_type', 'project_type', 'description', 'remarks', 'doc']
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
                alertify.alert('Your ticket   ' + "<u><b>" + data['ticket_number'] + "</b></u>" + '  has been raised')
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


    $scope.change_input_format = function (model) {
        $scope.new_model = model;
        return $scope.$watch('emp.' + model, function (newValue, oldValue, scope) {
            var month;
            if (oldValue !== void 0 && oldValue !== null && oldValue !== '' && oldValue !== 'undefined') {
                if (oldValue.length > newValue.length) {
                    $scope.emp[model] = '';
                    $scope.show_date_error = '';
                } else if ($scope.emp[model].length === 2) {
                    if ($scope.emp[model] > 0 && $scope.emp[model] < 32) {
                        $scope.emp[model] = $scope.emp[model] + ['/'];
                    } else {
                        $scope.show_date_error = 'Please enter day in correct format';
                    }
                } else if ($scope.emp[model].length === 5) {
                    month = $scope.emp[model].slice(3, 5);
                    if (month > 0 && month < 13) {
                        $scope.emp[model] = $scope.emp[model] + '/';
                    } else {
                        $scope.show_date_error = 'Please enter month in correct format';
                    }
                } else if ($scope.emp[model].length > 10) {
                    $scope.show_date_error = 'Please enter year in correct format';
                }
            }
        });
    };


});

