/**
 * ng-breadcrumb.js - v0.0.8 - A better AngularJS service to help with breadcrumb-style navigation between views
 * Based on https://github.com/angular-app/angular-app/blob/master/client/src/common/services/breadcrumbs.js
 *
 * @author Ian Kennington Walter (http://ianvonwalter.com)
 */

/* global angular */
angular
  .module('ng-breadcrumbs', [])
  .factory('breadcrumbs', ['$rootScope', '$location', '$route', function ($rootScope, $location, $route) {
    var BreadcrumbService = {
      breadcrumbs: [],
      get: function(options) {
        this.options = options || this.options;
        if (this.options) {
          for (var key in this.options) {
            if (this.options.hasOwnProperty(key)) {
              for (var index in this.breadcrumbs) {
                if (this.breadcrumbs.hasOwnProperty(index)) {
                  var breadcrumb = this.breadcrumbs[index];
                  if (breadcrumb.label === key) {
                    breadcrumb.label = this.options[key];
                  }
                }
              }
            }
          }
        }
        return this.breadcrumbs;
      },
      generateBreadcrumbs: function() {
        var routes = $route.routes,
            pathElements = $location.path().split('/'),
            path = '',
            self = this;

        var getRoute = function(route) {
          if ($route.current) {
            var param;
            angular.forEach($route.current.params, function (value, key) {
              var re = new RegExp(value);
              if (re.test(route)) {
                param = value;
              }
              if (value) {
                route = route.replace(re, ':' + key);
              }
            });
            return { path: route, param: param };
          }
        };

        if (pathElements[1] === '') {
          delete pathElements[1];
        }

        this.breadcrumbs = [];
        angular.forEach(pathElements, function(el) {
          path += path === '/' ? el : '/' + el;
          var route = getRoute(path);
          if (route && routes[route.path]) {
            var label = routes[route.path].label || route.param;
            self.breadcrumbs.push({ label: label, path: path });
          }
        });
      }
    };

    // We want to update breadcrumbs only when a route is actually changed
    // as $location.path() will get updated immediately (even if route change fails!)
    $rootScope.$on('$routeChangeSuccess', function() {
      BreadcrumbService.generateBreadcrumbs();
    });

    BreadcrumbService.generateBreadcrumbs();

    return BreadcrumbService;
  }]);