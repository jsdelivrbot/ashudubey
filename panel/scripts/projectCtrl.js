/**
 * Created by Ashu on 3/6/2018.
 */

var app = angular.module('app.projectType', []);

app.controller('projectCtrl', function ($scope, CommonData, apiSrv, Auth, $mdDialog) {

    $scope.isLogined = Auth.IsLogin();
    $scope.Loader = false;

    $scope.ticket_report = {
        SDate: new Date(),
        EDate: new Date()
    };

    $scope.view_data = [];

    $scope.view_project_type = (function () {
        $scope.Loader = true;
        CommonData.view_project_type(function (err, data) {
            $scope.Loader = false;
            if (!err) {
                $scope.view_data = data;
            }
            else {
                alertify.alert(err.msg)

            }
        })
    }());

    $scope.update_project_type = function (item) {
        var arr = item.name.split(' ')
        var temp = ''
        for(var i=0;i<arr.length;i++){
            temp += arr[i].charAt(0).toUpperCase() + arr[i].slice(1) + ' '
        }
        item.name = temp
        CommonData.update_project_type(item._id, item.name, function (err, data) {
            $scope.Loader = false;
            console.log(data)
            if (!err) {

                alertify.alert('updated successfully');

            }
        })
    };

    $scope.showAdvanced = function (ev) {
        $mdDialog.show({
            controller: 'projectCtrl',
            templateUrl: 'templates/new_project.html',
            targetEvent: ev,
            escapeToClose: false,
            preserveScope:true,
            scope: $scope,
            clickOutsideToClose: true
        });
    };


    $scope.add_new_project_type = function (item) {
        var arr = item.name.split(' ')
        var temp = ''
        for(var i=0;i<arr.length;i++){
            temp += arr[i].charAt(0).toUpperCase() + arr[i].slice(1) + ' '
        }
        item.name = temp
        CommonData.add_new_project_type(item.name, function (err, data) {
            $scope.Loader = false;
            if (!err) {
                $mdDialog.hide();
                alertify.alert('Added successfully');
                $scope.item={};
                $scope.view_data.unshift(data);
            }
        })
    };

        //
        // $scope.camelcase = function (text) {
        //     if ($scope.item[text] != undefined && $scope.item[text] != null && $scope.item[text] != "" && $scope.item[text] != "undefined") {
        //         $scope.item[text] = $scope.item[text].replace(/\w\S*/g, function (txt) {
        //             return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        //         })
        //     }
        // };





});
