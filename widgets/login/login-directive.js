var angular = require('angular');

angular.module('angular-unit-testing.login').directive('login', function() {
  return {
    restrict: 'E',
    template: require('./login-template.html')
  };
});
