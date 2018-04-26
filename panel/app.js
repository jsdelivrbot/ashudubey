'use strict';

var app = angular.module('app', ['ngMaterial', 'ngMessages',
    'ui.filters',
    'ui.router',
    'mainSvc',
    'login',
    'toolbar',
    'home',
    'app.raiseTicket',
    'app.viewTicket',
    'app.problemType',
    'app.projectType',
    'app.priorityType',
    'app.newJoinee',
    'app.requirementType'
]);

app.config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $mdThemingProvider, $locationProvider) {

        var routes = [{'url': '/home', 'state': 'app.home', 'view': 'home', 'controller': 'homeCtrl'},

            {
                'url': '/raise/ticket',
                'state': 'app.raiseticket',
                'view': 'raiseticket',
                'controller': 'raiseCtrl'
            },

            {'url': '/problem/type', 'state': 'app.problem', 'view': 'problem', 'controller': 'problemCtrl'},

            {'url': '/project/type', 'state': 'app.project', 'view': 'project', 'controller': 'projectCtrl'},

            {'url': '/priority/type', 'state': 'app.priority', 'view': 'priority', 'controller': 'priorityCtrl'},

            {'url': '/view/ticket', 'state': 'app.viewticket', 'view': 'view_ticket', 'controller': 'viewCtrl'},

            {'url': '/new/joinee', 'state': 'app.newjoin', 'view': 'new_joinee', 'controller': 'newjoineeCtrl'},

            {'url': '/new/requirement', 'state': 'app.newreq', 'view': 'new_req', 'controller': 'newreqCtrl'}
        ];

        $urlRouterProvider.when('', '')
            .otherwise('/home');

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl'
            })
            .state('app', {
                url: '',
                abstract: true,
                templateUrl: 'templates/toolbar.html',
                controller: 'toolbarCtrl'
            });
        for (var x in routes) {
            $stateProvider.state(routes[x].state, {
                url: routes[x].url,
                views: {
                    'mainContent': {
                        templateUrl: 'templates/' + routes[x].view + '.html',
                        controller: routes[x].controller,
                        // resolve: {
                        //     auth: ['$q', '$state', 'Auth', function ($q, $state, Auth) {
                        //         var defer = $q.defer();
                        //         if (Auth.IsLogin()) {
                        //             defer.resolve();
                        //         }
                        //         else {
                        //             $state.go('login');
                        //             defer.reject();
                        //         }
                        //         return defer.promise;
                        //     }]
                        //
                        // }
                    }
                }
            })
        }


        $mdThemingProvider.theme('default')
            .primaryPalette('teal', {
                'default': '500', // by default use shade 400 from the pink palette for primary intentions
                'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
            })
            .accentPalette('orange', {
                'default': '500', // by default use shade 400 from the pink palette for primary intentions
                'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
            })
            .backgroundPalette('grey');

        // if(window.history && window.history.pushState){
        //     $locationProvider.html5Mode({
        //         enabled: true,
        //         requireBase: false
        //     });
        //
        // }

    }]);

app.run(['$rootScope', '$state', '$stateParams', '$location', function ($rootScope, $state, $stateParams, $location) {
    var key = localStorage.getItem('ttm');
    if (key != null && key != undefined) {
        $rootScope.user = JSON.parse(key);
    }
}]);
