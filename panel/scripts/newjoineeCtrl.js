/**
 * Created by Ashu on 4/12/2018.
 */

var app = angular.module('app.newJoinee', []);

app.controller('newjoineeCtrl',function ($scope,CommonData,apiSrv) {


    $scope.loader = false;
    $scope.hr = {};

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

    $scope.get_dropdown_data();


    $scope.camelcase = function (text) {
        if ($scope.hr[text] != undefined && $scope.hr[text] != null && $scope.hr[text] != "" && $scope.hr[text] != "undefined") {
            $scope.hr[text] = $scope.hr[text].replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            })
        }
    };



    var ValidationArray = ['emp_name', 'emp_code', 'mobile', 'location','project','requirement', 'Date','job','gender','vertical','cost_center','reporting_manager'];

    $scope.submit_new_requirement_data =function () {

        for (x in ValidationArray) {
            if ($scope.hr[ValidationArray[x]] == null || $scope.hr[ValidationArray[x]] == undefined) {
                $scope.ErrorMsg = "Please enter " + ValidationArray[x];
                return $scope.ErrorMsg;
            }
        }
        $scope.Loader = true;

        CommonData.submit($scope.hr, function (err, data) {
            $scope.Loader = false;
            if (!err) {
                console.log(data);
                alertify.alert('Successfully Submitted');
                $scope.hr={};

            }
            else {
                alertify.alert(err.msg)

            }
        })

    };


    $scope.change_input_format = function (model) {
        $scope.new_model = model;
        return $scope.$watch('hr.' + model, function (newValue, oldValue, scope) {
            var month;
            if (oldValue !== void 0 && oldValue !== null && oldValue !== '' && oldValue !== 'undefined') {
                if (oldValue.length > newValue.length) {
                    $scope.hr[model] = '';
                    $scope.show_date_error = '';
                } else if ($scope.hr[model].length === 2) {
                    if ($scope.hr[model] > 0 && $scope.hr[model] < 32) {
                        $scope.hr[model] = $scope.hr[model] + ['/'];
                    } else {
                        $scope.show_date_error = 'Please enter day in correct format';
                    }
                } else if ($scope.hr[model].length === 5) {
                    month = $scope.hr[model].slice(3, 5);
                    if (month > 0 && month < 13) {
                        $scope.hr[model] = $scope.hr[model] + '/';
                    } else {
                        $scope.show_date_error = 'Please enter month in correct format';
                    }
                } else if ($scope.hr[model].length > 10) {
                    $scope.show_date_error = 'Please enter year in correct format';
                }
            }
        });
    };
    
    
    

});
