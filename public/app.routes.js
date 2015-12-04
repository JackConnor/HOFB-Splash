angular.module('app.routes', ['ngRoute'])

  .config(appRoutes);

  appRoutes.$inject = ['$routeProvider'];

  function appRoutes($routeProvider){

    $routeProvider

    .when('/', {
      templateUrl: 'templates/_splash.html'
      ,controller: 'emailCtrl'
      ,controllerAs: 'email'
    })

    /////////default to home
    .otherwise('/');

  ////////and of api routes///////
  ////////////////////////////////
  ////////////////////////////////
  }
