angular.module('app')
.config(function($routeProvider) {
  $routeProvider
  .when('/practise',    {controller: 'CardsCtrl',    templateUrl: 'practise.html'})
  .when('/login',    {controller: 'LoginCtrl',    templateUrl: 'login.html'})
})
