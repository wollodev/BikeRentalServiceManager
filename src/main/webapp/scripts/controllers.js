'use strict';

/* Controllers */

bikeRentalServiceManagerApp.controller('MainController', ['$scope', 'breadcrumbs',
    function ($scope, breadcrumbs) {
        $scope.breadcrumbs = breadcrumbs;
    }]);

bikeRentalServiceManagerApp.controller('AdminController', ['$scope',
    function ($scope) {
    }]);

bikeRentalServiceManagerApp.controller('LenderController', ['$scope',
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
        }
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
            delete $scope.bikestation.numberOfAvailableBikes;

            // query google geocoder for coordinates

            $scope.geocoder = new google.maps.Geocoder();

            var address = $scope.bikestation.addressStreet + ', ' + $scope.bikestation.addressCity;

            $scope.geocoder.geocode({'address': address},
                function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        console.log(results[0].geometry.location);

                        $scope.bikestation.locationLatitude = results[0].geometry.location.k;
                        $scope.bikestation.locationLongitude = results[0].geometry.location.A;

                        BikeStation.save($scope.bikestation,
                            function () {
                                $scope.bikestations = BikeStation.query();
                                $('#saveBikeStationModal').modal('hide');
                                $scope.clear();
                            });

                    } else {
                        console.log("Geocode for " + address + " was unsuccessful! ()" + status);
                    }
                });
        };

        $scope.update = function (id) {
            $scope.bikestation = BikeStation.get({id: id});
            $('#saveBikeStationModal').modal('show');
        };

        $scope.delete = function (id) {
            BikeStation.delete({id: id},
                function () {
                    $scope.bikestations = BikeStation.query();
                });
        };

        $scope.clear = function () {
//            $scope.bikestation = {id: "", sampleTextAttribute: "", sampleDateAttribute: ""};
        };
    }]);

bikeRentalServiceManagerApp.controller('BikeStationDetailController', ['$scope', '$routeParams', 'BikeStation', 'Bike', '$http', 'BikeType', 'breadcrumbs',
    function ($scope, $routeParams, BikeStation, Bike, $http, BikeType, breadcrumbs) {

        // get bikestation from server and put id into breadcrumbs afterwards
        $scope.bikestation = BikeStation.get({id: $routeParams.bikestationId},  function() {
            $scope.breadcrumbs.options = {"Bikestation Detail": "Bikestation " + $scope.bikestation.id + " Details"};
        });

        $scope.biketypes = BikeType.query();

        $scope.breadcrumbs = breadcrumbs;

        $scope.create = function () {
            if ($scope.editableBike != null) {
                delete $scope.editableBike.rented;
                delete $scope.editableBike.bikeStationId;

                Bike.save($scope.editableBike,
                    function () {
                        $scope.bikestation = BikeStation.get({id: $routeParams.bikestationId});
                        $('#editBikeModal').modal('hide');
                        $scope.clear();
                    });

                return;
            }

            $scope.bike.note = "Write here some notes...";
            $http.post('app/rest/bikestations/' + $routeParams.bikestationId + '/addBike', $scope.bike).success(
                function () {
                    $scope.bikestation = BikeStation.get({id: $routeParams.bikestationId});
                    $scope.clear();
                });
        };

        $scope.update = function (id) {
            $scope.editableBike = Bike.get({id: id}, function(bike){
                console.log($scope.biketypes);
                $scope.biketypes.forEach( function(biketype){
                    console.log(biketype);
                    if (biketype.id == bike.bikeType.id) {
                        bike.bikeType = biketype;
                        console.log("updat biketype");
                    }
                });
            });
            $('#editBikeModal').modal('show');
        };

        $scope.delete = function (id) {
            Bike.delete({id: id},
                function () {
                    $scope.bikestation = BikeStation.get({id: $routeParams.bikestationId});
                });
        };

        $scope.clear = function () {
            $scope.bike = null;
            $scope.editableBike = null;
        };

        $scope.editBikeStation = function () {
            delete $scope.bikestation.numberOfBikes;
            delete $scope.bikestation.numberOfAvailableBikes;
            delete $scope.bikestation.bikes;

            // query google geocoder for coordinates

            $scope.geocoder = new google.maps.Geocoder();

            var address = $scope.bikestation.addressStreet + ', ' + $scope.bikestation.addressCity;

            $scope.geocoder.geocode({'address': address},
                function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        console.log(results[0].geometry.location);

                        $scope.bikestation.locationLatitude = results[0].geometry.location.k;
                        $scope.bikestation.locationLongitude = results[0].geometry.location.A;

                        BikeStation.save($scope.bikestation,
                            function () {
                                $scope.bikestation = BikeStation.get();
                                $('#saveBikeStationModal').modal('hide');
                                $scope.clear();
                            });

                    } else {
                        console.log("Geocode for " + address + " was unsuccessful! ()" + status);
                    }
                });
        };

        $scope.rent = function (bike) {

            var ladda = document.querySelector("#bike" + bike.id).ladda;

            var rentButton = document.querySelector("#bike" + bike.id);


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


bikeRentalServiceManagerApp.controller('SignupController', ['$scope', '$location', 'User', '$timeout', function($scope, $location, User, $timeout) {

    $scope.signUpError = false;
    $scope.signUpSuccess = false;

    $scope.createUser = function() {
        // post the new user to the server, fix user role assignment?
//        $scope.signup.user.roles = ["ROLE_USER"];

        // save new user and redirect to login page after (delay)
        User.save($scope.signup.user,
            function() {
                $scope.signUpSuccess = true;
                $timeout(function() {
                    $location.path('/login');
                }, 1000);
            }, function() {
                $scope.signUpError = true;
                console.log("Error handler");
            });
    }

    $scope.createLender = function() {

        // save new user and redirect to login page after (delay)
        User.save($scope.lender,
            function() {
                $scope.signUpSuccess = true;
                $('#saveLenderModal').modal('hide');
                $scope.clear();
            }, function() {
                $scope.signUpError = true;
                console.log("Error handler");
            });
    }

    $scope.clear = function () {
        $scope.lender = null;
    };

}]);

bikeRentalServiceManagerApp.controller('DemoController', ['$scope', '$location', '$http',  function ($scope, $location, $http) { //BikeStation, resolvedBikeStation, $http) {

//    $scope.bikestations = resolvedBikeStation;

    $scope.showMap = true;

//    $scope.mapMarkers = new Array();

    // center map on aachen, zoomed in
    $scope.map = {
        center: {
            latitude: 50.776667,
            longitude: 6.083611
        },
        zoom: 14
    };

    // fetch all bikestations from back end
    var promise = $http.get('/app/rest/allbikestations');
    promise.success(function(data, status, headers, config) {
        $scope.bikestations = data;
    }).error(function(data, status) {
        console.log("Failed to fetch Bikestations:" + status);
    });

    $scope.gotoDetails = function (bikeStationId) {
        $location.path('/bikestations/'+bikeStationId);
    }

//    $scope.infoWindow = new google.maps.InfoWindow({
//        content: ''
//    });

//    $scope.showInfo = function (station, marker) {
//        console.log("Clicked the button " + station.name);
//
//        var position = google.maps.LatLng(station.locationLatitude, station.locationLongitude);
//        var map = $scope.map.getGMap()
//
//        var infoWindow = new google.maps.InfoWindow({
//            content: "blablabla"
//        });
//        infoWindow.open(map, position);
//    }

    $scope.toggleMap = function () {
        $scope.showMap = !$scope.showMap;
    }

}]);

/*
 bikeRentalServiceManagerApp.controller('MapController', ['$scope', 'BikeStation', 'resolvedBikeStation', function ($scope, $BikeStation, resolvedBikeStation) {

 $scope.bikestations = resolvedBikeStation;

 }]);
 */