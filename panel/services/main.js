var app = angular.module('mainSvc', []);

app.factory('Auth', function ($http, apiSrv, $rootScope) {
    var obj = this;
    obj.IsLogin = function () {

        if ($rootScope.user === null || $rootScope.user === undefined)
            return false;
        else {
            return true;
        }
    };
    var saveMe = function (data) {
        localStorage.setItem('ttm', JSON.stringify(data));
    };
    obj.Login = function (obj, remember, callback) {
        $http.post(apiSrv.path('/api/common/login/'), obj).then(function (resp) {
            if (resp.data.isError) {
                var res = {
                    'status': false,
                    'msg': resp.data.msg
                };
                callback(res);
            }
            else {
                var res = {
                    'status': true
                };
                if (remember) {
                    saveMe(resp.data.data);
                }
                $rootScope.user = resp.data.data;
                callback(res);
            }
        }, function (resp) {
            var res = {
                'status': false,
                'msg': 'Internal Server Error!'
            };
            callback(res);
        })
    };
    obj.ForgotPwd = function (obj, callback) {
        $http.post(apiSrv.path('/api/common/forget_password/'), obj).then(function (resp) {
            if (resp.data.isError) {
                var res = {
                    'status': false,
                    'msg': resp.data.msg
                };
                callback(res);
            }
            else {
                var res = {
                    'status': true,
                    'email': resp.data.data.email
                };
                callback(res);
            }
        }, function (resp) {
            var res = {
                'status': false,
                'msg': 'Internal Server Error!'
            };
            callback(res);
        })
    };
    obj.ResetPassword = function (obj, callback) {
        $http.post(apiSrv.path('/api/common/reset_password/'), obj).then(function (resp) {
            if (resp.data.isError) {
                var res = {
                    'status': false,
                    'msg': resp.data.msg
                };
                callback(res);
            }
            else {
                var res = {
                    'status': true,
                };
                callback(res);
            }
        }, function (resp) {
            var res = {
                'status': false,
                'msg': 'Internal Server Error!'
            };
            callback(res);
        })
    };

    return obj;
});

app.factory('apiSrv', function ($location) {
    const url = $location.protocol() + '://' + $location.host() + ':8094';
    var obj = this;
    this.path = function (p) {
        console.log('i am hitting '+p)
        return url + p;
    };
    return obj;
});

app.service('CommonData', function ($http, apiSrv) {

    this.get_dropdown_data = function (callback) {
        $http.get(apiSrv.path('/api/tickets/getting_dropdown_data/')).then(function (resp) {
            if (resp.data.isError)
                callback(resp, null);
            else {
                callback(null, resp.data.data);
            }
        }, function (resp) {
            var res = {
                'status': false,
                'msg': 'Internal Server Error!'
            };
            callback(res);
        })
    };

    this.view_problem_type = function (callback) {
        $http.get(apiSrv.path('/api/tickets/get_problem_type/')).then(function (resp) {
            if (resp.data.isError)
                callback(resp, null);
            else {
                callback(null, resp.data.data);
            }
        }, function (resp) {
            var res = {
                'status': false,
                'msg': 'Internal Server Error!'
            };
            callback(res);
        })
    };

    this.view_project_type = function (callback) {
        $http.get(apiSrv.path('/api/tickets/get_project_type/')).then(function (resp) {
            if (resp.data.isError)
                callback(resp, null);
            else {
                callback(null, resp.data.data);
            }
        }, function (resp) {
            var res = {
                'status': false,
                'msg': 'Internal Server Error!'
            };
            callback(res);
        })
    };

    this.submit_data = function (data,callback) {
        $http.post(apiSrv.path('/api/tickets/add_new_forms_data/'),data).then(function (resp) {
            if (resp.data.isError)
                callback(resp, null);
            else {
                callback(null, resp.data.data);
            }
        }, function (resp) {
            var res = {
                'status': false,
                'msg': 'Internal Server Error!'
            };
            callback(res);
        })
    };


//new requirement form function

    this.submit = function (data,callback) {
        $http.post(apiSrv.path('/api/tickets/submit_new_requirement_data/'),data).then(function (resp) {
            if (resp.data.isError)
                callback(resp, null);
            else {
                callback(null, resp.data.data);
            }
        }, function (resp) {
            var res = {
                'status': false,
                'msg': 'Internal Server Error!'
            };
            callback(res);
        })
    };


    this.view_ticket_report = function (ticket_data,callback) {
        $http.get(apiSrv.path('/api/tickets/get_report_data/?key='+ticket_data)).then(function (resp) {
            if (resp.data.isError)
                callback(resp, null);
            else {
                console.log(JSON.stringify(resp));
                callback(null, resp.data.data);
            }
        }, function (resp) {
            var res = {
                'status': false,
                'msg': 'Internal Server Error!'
            };
            callback(res);
        })
    };

    this.load_ticket_data = function (data, callback) {
        $http.get(apiSrv.path('/api/tickets/get_raised_ticket_report/?sdate='+data.SDate + '&edate=' +data.EDate)).then(function (resp) {
            if (resp.data.isError)
                callback(resp, null);
            else {
                callback(null, resp.data.data);

            }
        }, function (resp) {
            var res = {
                'status': false,
                'msg': 'Internal Server Error!'
            };
            callback(res);

        })


    };


    this.export_new_data = function (data, callback) {
        $http.get(apiSrv.path('/api/tickets/get_new_requirement_report/?sdate=' +data.SDate + '&edate=' + data.EDate)).then(function (resp) {
            if (resp.data.isError)
                callback(resp, null);
            else {
                callback(null, resp.data.data);
            }
        }, function (resp) {
            var res = {
                'status': false,
                'msg': 'Internal Server Error'

            };
            callback(res);
        })

    };


    this.update_data = function (item, callback) {
        $http.post(apiSrv.path('/api/tickets/change_status/'),item).then(function (resp) {
            if (resp.data.isError)
                callback(resp, null);
            else {
                callback(null, resp.data.data);

            }
        }, function (resp) {
            var res = {
                'status': false,
                'msg': 'Internal Server Error!'
            };
            callback(res);

        })


    };

    this.update_priority = function (item, callback) {
        $http.post(apiSrv.path('/api/tickets/change_priority_type/'),item).then(function (resp) {
            if (resp.data.isError)
                callback(resp, null);
            else {
                callback(null, resp.data.data);

            }
        }, function (resp) {
            var res = {
                'status': false,
                'msg': 'Internal Server Error!'
            };
            callback(res);

        })


    };





    this.update_problem_type = function (id,name,callback) {
        $http.put(apiSrv.path('/api/tickets/update_problem_type/?id='+id + '&name=' +name)).then(function (resp) {
            if (resp.data.isError)
                callback(resp, null);
            else {
                callback(null, resp.data.data);

            }
        }, function (resp) {
            var res = {
                'status': false,
                'msg': 'Internal Server Error!'
            };
            callback(res);

        })

    };


    this.update_project_type = function (id,name,callback) {
        $http.put(apiSrv.path('/api/tickets/update_project_type/?id='+id + '&name=' +name)).then(function (resp) {
            if (resp.data.isError)
                callback(resp, null);
            else {
                callback(null, resp.data.data);

            }
        }, function (resp) {
            var res = {
                'status': false,
                'msg': 'Internal Server Error!'
            };
            callback(res);

        })

    };

    this.add_new_project_type = function (name, callback) {
        $http.post(apiSrv.path('/api/tickets/add_new_project_type/?name='+ name)).then(function (resp) {
            if (resp.data.isError)
                callback(resp, null);
            else {
                callback(null, resp.data.data);
            }

        }, function (resp) {
            var res = {
                'status': false,
                'msg': 'Internal Server Error!'
            };
            callback(res);

        })
    };

    this.add_new_problem_type = function (name, callback) {
        $http.post(apiSrv.path('/api/tickets/add_new_problem_type/?name=' + name)).then(function (resp) {
            if (resp.data.isError)
                callback(resp, null);
            else {
                callback(null, resp.data.data);
            }

        }, function (resp) {
            var res = {
                'status': false,
                'msg': 'Internal Server Error!'
            };
            callback(res);
        })

    };


    this.load_new_data = function (data, callback) {
        $http.get(apiSrv.path('/api/tickets/get_new_requirement_report/?sdate='+data.SDate + '&edate=' +data.EDate)).then(function (resp) {
            if (resp.data.isError)
                callback(resp, null);
            else {
                callback(null, resp.data.data);

            }
        }, function (resp) {
            var res = {
                'status': false,
                'msg': 'Internal Server Error!'
            };
            callback(res);

        })


    };



    return this;
});

app.directive('myHref', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var url = $parse(attrs.myHref)(scope);
            console.log(url)
            element.attr('href', url);
        }
    }
});
