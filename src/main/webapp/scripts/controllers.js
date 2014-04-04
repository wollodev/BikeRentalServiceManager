'use strict';

/* Controllers */

bikeRentalServiceManagerApp.controller('MainController', ['$scope',
    function ($scope) {
    }]);

bikeRentalServiceManagerApp.controller('AdminController', ['$scope',
    function ($scope) {
    }]);

bikeRentalServiceManagerApp.controller('LanguageController', ['$scope', '$translate',
    function ($scope, $translate) {
        $scope.changeLanguage = function (languageKey) {
            $translate.use(languageKey);
        };
    }]);

bikeRentalServiceManagerApp.controller('MenuController', ['$scope',
    function ($scope) {
    }]);

bikeRentalServiceManagerApp.controller('LoginController', ['$scope', '$location', 'AuthenticationSharedService',
    function ($scope, $location, AuthenticationSharedService) {
        $scope.rememberMe = true;
        $scope.login = function () {
            AuthenticationSharedService.login({
                username: $scope.username,
                password: $scope.password,
                rememberMe: $scope.rememberMe,
                success: function () {
                    $location.path('');
                }
            })
        };

        $scope.toSignup = function() {
            $location.path('/signup');
        };
    }]);

bikeRentalServiceManagerApp.controller('LogoutController', ['$location', 'AuthenticationSharedService',
    function ($location, AuthenticationSharedService) {
        AuthenticationSharedService.logout({
            success: function () {
                $location.path('');
            }
        });
    }]);

bikeRentalServiceManagerApp.controller('SettingsController', ['$scope', 'Account',
    function ($scope, Account) {
        $scope.success = null;
        $scope.error = null;
        $scope.settingsAccount = Account.get();

        $scope.save = function () {
            Account.save($scope.settingsAccount,
                function (value, responseHeaders) {
                    $scope.error = null;
                    $scope.success = 'OK';
                    $scope.settingsAccount = Account.get();
                },
                function (httpResponse) {
                    $scope.success = null;
                    $scope.error = "ERROR";
                });
        };
    }]);

bikeRentalServiceManagerApp.controller('PasswordController', ['$scope', 'Password',
    function ($scope, Password) {
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.changePassword = function () {
            if ($scope.password != $scope.confirmPassword) {
                $scope.doNotMatch = "ERROR";
            } else {
                $scope.doNotMatch = null;
                Password.save($scope.password,
                    function (value, responseHeaders) {
                        $scope.error = null;
                        $scope.success = 'OK';
                    },
                    function (httpResponse) {
                        $scope.success = null;
                        $scope.error = "ERROR";
                    });
            }
        };
    }]);

bikeRentalServiceManagerApp.controller('SessionsController', ['$scope', 'resolvedSessions', 'Sessions',
    function ($scope, resolvedSessions, Sessions) {
        $scope.success = null;
        $scope.error = null;
        $scope.sessions = resolvedSessions;
        $scope.invalidate = function (series) {
            Sessions.delete({series: encodeURIComponent(series)},
                function (value, responseHeaders) {
                    $scope.error = null;
                    $scope.success = "OK";
                    $scope.sessions = Sessions.get();
                },
                function (httpResponse) {
                    $scope.success = null;
                    $scope.error = "ERROR";
                });
        };
    }]);

bikeRentalServiceManagerApp.controller('MetricsController', ['$scope', 'MetricsService', 'HealthCheckService', 'ThreadDumpService',
    function ($scope, MetricsService, HealthCheckService, ThreadDumpService) {

        $scope.refresh = function () {
            HealthCheckService.check().then(function (data) {
                $scope.healthCheck = data;
            });

            $scope.metrics = MetricsService.get();

            $scope.metrics.$get({}, function (items) {

                $scope.servicesStats = {};
                $scope.cachesStats = {};
                angular.forEach(items.timers, function (value, key) {
                    if (key.indexOf("web.rest") != -1) {
                        $scope.servicesStats[key] = value;
                    }

                    if (key.indexOf("net.sf.ehcache.Cache") != -1) {
                        // remove gets or puts
                        var index = key.lastIndexOf(".");
                        var newKey = key.substr(0, index);

                        // Keep the name of the domain
                        index = newKey.lastIndexOf(".");
                        $scope.cachesStats[newKey] = {
                            'name': newKey.substr(index + 1),
                            'value': value
                        };
                    }
                });
            });
        };

        $scope.refresh();

        $scope.threadDump = function () {
            ThreadDumpService.dump().then(function (data) {
                $scope.threadDump = data;

                $scope.threadDumpRunnable = 0;
                $scope.threadDumpWaiting = 0;
                $scope.threadDumpTimedWaiting = 0;
                $scope.threadDumpBlocked = 0;

                angular.forEach(data, function (value, key) {
                    if (value.threadState == 'RUNNABLE') {
                        $scope.threadDumpRunnable += 1;
                    } else if (value.threadState == 'WAITING') {
                        $scope.threadDumpWaiting += 1;
                    } else if (value.threadState == 'TIMED_WAITING') {
                        $scope.threadDumpTimedWaiting += 1;
                    } else if (value.threadState == 'BLOCKED') {
                        $scope.threadDumpBlocked += 1;
                    }
                });

                $scope.threadDumpAll = $scope.threadDumpRunnable + $scope.threadDumpWaiting +
                    $scope.threadDumpTimedWaiting + $scope.threadDumpBlocked;

            });
        };

        $scope.getLabelClass = function (threadState) {
            if (threadState == 'RUNNABLE') {
                return "label-success";
            } else if (threadState == 'WAITING') {
                return "label-info";
            } else if (threadState == 'TIMED_WAITING') {
                return "label-warning";
            } else if (threadState == 'BLOCKED') {
                return "label-danger";
            }
        };
    }]);

bikeRentalServiceManagerApp.controller('LogsController', ['$scope', 'resolvedLogs', 'LogsService',
    function ($scope, resolvedLogs, LogsService) {
        $scope.loggers = resolvedLogs;

        $scope.changeLevel = function (name, level) {
            LogsService.changeLevel({name: name, level: level}, function () {
                $scope.loggers = LogsService.findAll();
            });
        }
    }]);

bikeRentalServiceManagerApp.controller('AuditsController', ['$scope', '$translate', '$filter', 'AuditsService',
    function ($scope, $translate, $filter, AuditsService) {
        $scope.onChangeDate = function () {
            AuditsService.findByDates($scope.fromDate, $scope.toDate).then(function (data) {
                $scope.audits = data;
            });
        };

        // Date picker configuration
        $scope.today = function () {
            // Today + 1 day - needed if the current day must be included
            var today = new Date();
            var tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // create new increased date

            $scope.toDate = $filter('date')(tomorrow, "yyyy-MM-dd");
        };

        $scope.previousMonth = function () {
            var fromDate = new Date();
            if (fromDate.getMonth() == 0) {
                fromDate = new Date(fromDate.getFullYear() - 1, 0, fromDate.getDate());
            } else {
                fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth() - 1, fromDate.getDate());
            }

            $scope.fromDate = $filter('date')(fromDate, "yyyy-MM-dd");
        };

        $scope.today();
        $scope.previousMonth();

        AuditsService.findByDates($scope.fromDate, $scope.toDate).then(function (data) {
            $scope.audits = data;
        });
    }]);

bikeRentalServiceManagerApp.controller('BikeController', ['$scope', 'resolvedBike', 'Bike',
    function ($scope, resolvedBike, Bike) {

        $scope.bikes = resolvedBike;

        $scope.create = function () {
            Bike.save($scope.bike,
                function () {
                    $scope.bikes = Bike.query();
                    $('#saveBikeModal').modal('hide');
                    $scope.clear();
                });
        };

        $scope.update = function (id) {
            $scope.bike = Bike.get({id: id});
            $('#saveBikeModal').modal('show');
        };

        $scope.delete = function (id) {
            Bike.delete({id: id},
                function () {
                    $scope.bikes = Bike.query();
                });
        };

        $scope.clear = function () {
//            $scope.bike = {id: "", sampleTextAttribute: "", sampleDateAttribute: ""};
        };
    }]);

bikeRentalServiceManagerApp.controller('BikeStationController', ['$scope', 'resolvedBikeStation', 'BikeStation',
    function ($scope, resolvedBikeStation, BikeStation) {

        $scope.bikestations = resolvedBikeStation;

        $scope.create = function () {
            delete $scope.bikestation.numberOfBikes;
            BikeStation.save($scope.bikestation,
                function () {
                    $scope.bikestations = BikeStation.query();
                    $('#saveBikeStationModal').modal('hide');
                    $scope.clear();
                });
        };

        $scope.update = function (id) {
            $scope.bikestation = BikeStation.get({id: id});
            $('#saveBikeStationModal').modal('show');
        };

        $scope.delete = function (id) {
            BikeStation.delete({id: id},
                function () {
                    $scope.bikestations = BikeStation.my.query();
                });
        };

        $scope.clear = function () {
//            $scope.bikestation = {id: "", sampleTextAttribute: "", sampleDateAttribute: ""};
        };
    }]);

bikeRentalServiceManagerApp.controller('BikeStationDetailController', ['$scope', '$routeParams', 'BikeStation', 'Bike', '$http',
    function ($scope, $routeParams, BikeStation, Bike, $http) {

        $scope.bikestation = BikeStation.get({id: $routeParams.bikestationId});

        $scope.create = function () {
            $http.post('app/rest/bikestations/' + $routeParams.bikestationId + '/addBike', $scope.bike).success(
                function () {
                    $scope.bikestation = BikeStation.get({id: $routeParams.bikestationId});
                    $('#saveBikeModal').modal('hide');
                    $scope.clear();
                });
        };

        $scope.update = function (id) {
            $scope.bikestation = BikeStation.get({id: $routeParams.bikestationId});
            $('#saveBikeModal').modal('show');
        };

        $scope.delete = function (id) {
            Bike.delete({id: id},
                function () {
                    $scope.bikestation = BikeStation.get({id: $routeParams.bikestationId});
                });
        };

        $scope.clear = function () {
//            $scope.bikestation = {id: "", sampleTextAttribute: "", sampleDateAttribute: ""};
        };

        $scope.rent = function (bike) {

            var ladda = document.querySelector("#bike" + bike.id).ladda;

            ladda.start();

            console.log("toggle state");
            console.log(bike);

            var tmpBike = angular.copy(bike);

            tmpBike.rented = !tmpBike.rented;

            delete tmpBike.bikeStationId;

            Bike.save(tmpBike,
                function () {
                    bike.rented = tmpBike.rented;

                    ladda.stop();

                });

//            $http.post('app/rest/bikes/' + tmpBike.id + '/changeRentState', null, {params : { state : tmpBike.rented}}).success(
//                function () {
//                    bike.rented = tmpBike.rented;
//
//                    ladda.stop();
//                });
        };

    }]);

bikeRentalServiceManagerApp.controller('SignupController', ['$scope', '$location', 'User', '$http', function($scope, $location, User, $http) {
    $scope.createUser = function() {
        // post the new user to the server, fix user role assignment?
        $scope.signup.user.roles = {"ROLE_USER": true};
        User.save($scope.signup.user);
        $location.path('/login');
    }
}]);

bikeRentalServiceManagerApp.controller('DemoController', ['$scope', '$location', 'BikeStation', 'resolvedBikeStation', function ($scope, $location, BikeStation, resolvedBikeStation) {

    $scope.bikestations = resolvedBikeStation;

    $scope.showMap = true;

    // center map on aachen, zoomed in
    $scope.map = {
        center: {
            latitude: 50.776667,
            longitude: 6.083611
        },
        zoom: 14
    };

    $scope.getCoordinates = function() {
//        $scope.geocoder = new google.maps.Geocoder();
//
//
//        for (var i = 0; i < $scope.bikestations.length; i++) {
//            var station = $scope.bikestations[i];
//            var address = station.addressStreet + ', ' + station.addressCity;
//            console.log(address);
//
//
//            $scope.geocoder.geocode({'address': address},
//                function(results, status) {
//                    if (status == google.maps.GeocoderStatus.OK) {
//                        var newMarker = new google.maps.Marker(
//                            {
//                                map: $scope.map,
//                                position: results[0].geometry.location
//                            }
//                        );
//                    } else {
//                        console.log("Geocode for " + addressString + " was unsuccessful!");
//                    }
//                });
//
//        }

    }

    $scope.gotoDetails = function (bikeStationId) {
        $location.path('/bikestations/'+bikeStationId);
    }

    $scope.toggleMap = function () {
        $scope.showMap = !$scope.showMap;
    }

}]);

/*
bikeRentalServiceManagerApp.controller('MapController', ['$scope', 'BikeStation', 'resolvedBikeStation', function ($scope, $BikeStation, resolvedBikeStation) {

    $scope.bikestations = resolvedBikeStation;

}]);
*/