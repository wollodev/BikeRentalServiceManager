'use strict';

/* App Module */

var bikeRentalServiceManagerApp = angular.module('bikeRentalServiceManagerApp', ['http-auth-interceptor', 'tmh.dynamicLocale',
    'ngResource', 'ngRoute', 'ngCookies', 'pascalprecht.translate', 'google-maps', 'ng-breadcrumbs', 'ngDragDrop']);

bikeRentalServiceManagerApp
    .config(['$routeProvider', '$httpProvider', '$translateProvider',  'tmhDynamicLocaleProvider', 'USER_ROLES', '$compileProvider',
        function ($routeProvider, $httpProvider, $translateProvider, tmhDynamicLocaleProvider, USER_ROLES, $compileProvider) {
            $routeProvider
                .when('/login', {
                    templateUrl: 'views/login.html',
                    controller: 'LoginController',
                    label: 'Login',
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .when('/signup', {
                    templateUrl: 'views/signup.html',
                    controller: 'SignupController',
                    label: 'Signup',
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .when('/error', {
                    templateUrl: 'views/error.html',
                    label: 'Error',
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .when('/settings', {
                    templateUrl: 'views/settings.html',
                    controller: 'SettingsController',
                    label: 'Settings',
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .when('/password', {
                    templateUrl: 'views/password.html',
                    controller: 'PasswordController',
                    label: 'Password',
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .when('/sessions', {
                    templateUrl: 'views/sessions.html',
                    controller: 'SessionsController',
                    label: 'Sessions',
                    resolve:{
                        resolvedSessions:['Sessions', function (Sessions) {
                            return Sessions.get();
                        }]
                    },
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .when('/metrics', {
                    templateUrl: 'views/metrics.html',
                    controller: 'MetricsController',
                    label: 'Metrics',
                    access: {
                        authorizedRoles: [USER_ROLES.admin]
                    }
                })
                .when('/logs', {
                    templateUrl: 'views/logs.html',
                    controller: 'LogsController',
                    label: 'Logs',
                    resolve:{
                        resolvedLogs:['LogsService', function (LogsService) {
                            return LogsService.findAll();
                        }]
                    },
                    access: {
                        authorizedRoles: [USER_ROLES.admin]
                    }
                })
                .when('/audits', {
                    templateUrl: 'views/audits.html',
                    controller: 'AuditsController',
                    label: 'Audits',
                    access: {
                        authorizedRoles: [USER_ROLES.admin]
                    }
                })
                .when('/logout', {
                    templateUrl: 'views/main.html',
                    controller: 'LogoutController',
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .when('/bikestations', {
                    templateUrl: 'views/bikestations.html',
                    controller: 'BikeStationController',
                    label: 'Bikestations',
                    resolve:{
                        resolvedBikeStation: ['BikeStation', function (BikeStation) {
                            return BikeStation.query();
                        }]
                    },
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                .when('/bikestations/:bikestationId', {
                    templateUrl: 'views/bikestation.html',
                    controller: 'BikeStationDetailController',
                    label: 'Bikestation Detail',
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
//                .when('/bikes', {
//                    templateUrl: 'views/bikes.html',
//                    controller: 'BikeController',
//                    label: 'Bikes',
//                    resolve: {
//                        resolvedBike: ['Bike', function (Bike) {
//                            console.log(Bike.query());
//                            return Bike.query();
//                        }]
//                    },
//                    access: {
//                        authorizedRoles: [USER_ROLES.all]
//                    }
//                })
                .when('/demo', {
                    templateUrl: 'views/demo.html',
                    controller: 'DemoController',
                    label: 'Demo',
                    resolve: {
                        resolvedBikeStation: ['BikeStation', function (BikeStation) {
                            return BikeStation.query();
                        }]
                    },
                    access: {
                        authorizedRoles: [USER_ROLES.all]
                    }
                })
                // made bike station view default view!
                .otherwise({
                templateUrl: 'views/bikestations.html',
                    controller: 'BikeStationController',
                    label: 'Bikestations',
                    resolve:{
                    resolvedBikeStation: ['BikeStation', function (BikeStation) {
                        return BikeStation.query();
                    }]
                },
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
                });

            // GLOBAL MESSAGES

            var elementsList = $();
            var showMessage = function(content, cl, time, type) {
                $('<div><button type="button" class="close" data-dismiss="alert">&times;</button></div>')
                    .addClass('message')
                    .addClass(cl)
                    .addClass('alert')
                    .addClass(type)
                    .hide()
                    .fadeIn('fast')
                    .delay(time)
                    .fadeOut('fast', function() { $(this).remove(); })
                    .appendTo(elementsList)
                    .text(content);
            };

            $httpProvider.responseInterceptors.push(function($timeout, $q) {
                return function(promise) {
                    var errorInterval = 2000;
                    var successInterval = 500;

                    return promise.then(function(successResponse) {
                        if (successResponse.config.method.toUpperCase() != 'GET') {
//                            var alertType = 'alert-success';
//                            showMessage('Successful', 'successMessage', successInterval, alertType);
                        }
                        return successResponse;

                    }, function(errorResponse) {
                        var alertType = 'alert-danger';
                        switch (errorResponse.status) {
                            case 401:
                                showMessage('Wrong usename or password', 'errorMessage', errorInterval, alertType);
                                break;
                            case 403:
                                showMessage('You don\'t have the right to do this', 'errorMessage', errorInterval, alertType);
                                break;
                            case 500:
                                showMessage('Server internal error: ' + errorResponse.data, 'errorMessage', errorInterval, alertType);
                                break;
                            default:
                                showMessage('Error ' + errorResponse.status + ': ' + errorResponse.data, 'errorMessage', errorInterval, alertType);
                        }
                        return $q.reject(errorResponse);
                    });
                };
            });

            $compileProvider.directive('appMessages', function() {
                var directiveDefinitionObject = {
                    link: function(scope, element, attrs) { elementsList.push($(element)); }
                };
                return directiveDefinitionObject;
            });
            // END GLOBAL MESSAGES


            // Initialize angular-translate
            $translateProvider.useStaticFilesLoader({
                prefix: 'i18n/',
                suffix: '.json'
            });

            $translateProvider.preferredLanguage('en');

            $translateProvider.useCookieStorage();

            tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js')
            tmhDynamicLocaleProvider.useCookieStorage('NG_TRANSLATE_LANG_KEY');
        }])
        .run(['$rootScope', '$location', 'AuthenticationSharedService', 'Session', 'USER_ROLES',
            function($rootScope, $location, AuthenticationSharedService, Session, USER_ROLES) {
                $rootScope.$on('$routeChangeStart', function (event, next) {
                    $rootScope.authenticated = AuthenticationSharedService.isAuthenticated();
                    $rootScope.isAuthorized = AuthenticationSharedService.isAuthorized;
                    $rootScope.userRoles = USER_ROLES;
                    $rootScope.account = Session;

                    var authorizedRoles = next.access.authorizedRoles;
                    if (!AuthenticationSharedService.isAuthorized(authorizedRoles)) {
                        event.preventDefault();
                        if (AuthenticationSharedService.isAuthenticated()) {
                            // user is not allowed
                            $rootScope.$broadcast("event:auth-notAuthorized");
                        } else {
                            // user is not logged in
                            $rootScope.$broadcast("event:auth-loginRequired");
                        }
                    }
                });

                // Call when the the client is confirmed
                $rootScope.$on('event:auth-loginConfirmed', function(data) {
                    if ($location.path() === "/login") {
                        $location.path('/').replace();
                    }
                });

                // Call when the 401 response is returned by the server
                $rootScope.$on('event:auth-loginRequired', function(rejection) {
                    Session.destroy();
                    if ($location.path() !== "/" && $location.path() !== "") {
                        $location.path('/login').replace();
                    }
                });

                // Call when the 403 response is returned by the server
                $rootScope.$on('event:auth-notAuthorized', function(rejection) {
                    $rootScope.errorMessage = 'errors.403';
                    $location.path('/error').replace();
                });

                // Call when the user logs out
                $rootScope.$on('event:auth-loginCancelled', function() {
                    $location.path('');
                });
        }]);
