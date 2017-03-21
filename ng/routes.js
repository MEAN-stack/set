angular.module('app')
.config(function($routeProvider) {
  $routeProvider
  .when('/practise',    {controller: 'CardsCtrl',    templateUrl: 'practise.html'})
  .when('/login',       {controller: 'LoginCtrl',    templateUrl: 'login.html'})
  .when('/newgame',       {controller: 'GamesCtrl',     templateUrl: 'games.html'})
  .when('/games',       {controller: 'GamesCtrl',     templateUrl: 'games.html'})
})
