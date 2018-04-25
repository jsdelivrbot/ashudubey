/**
 * Created by Ashu on 4/24/2018.
 */


var app = angular.module('app.requirementType', []);

app.controller('newreqCtrl', function ($scope,Auth,CommonData,apiSrv) {

    $scope.isLogined = Auth.IsLogin();
    $scope.Loader = false;


    $scope.hr = {};

    $scope.new_requirement =[]

    $scope.new_report = {
        SDate: new Date(),
        EDate: new Date()
    }

    $scope.load_new_data = function () {
        $scope.Loader = true;
        CommonData.load_new_data($scope.new_report, function (err, data) {
            $scope.Loader = false;
            if (!err) {

                $scope.new_requirement = data;

            }
            else {
                alertify.alert(err.msg)

            }
        })


    }

    $scope.load_new_data();


    $scope.export_new_data = function () {

        $scope.Loader = true;

        CommonData.export_new_data($scope.new_report,function (err,data) {
            $scope.Loader = false;
            if(!err){

                delete data[0]._id;
                delete data[0].date;
                console.log(data);

                alasql('SELECT * INTO XLSX("new_requirement_report.xlsx",{headers:true}) FROM ?', [data]);


            }


        })

    }

});


