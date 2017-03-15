var app = angular.module('app', [
  'ngRoute',
  'ui.bootstrap'
])


app.config(['$compileProvider', function ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}])

