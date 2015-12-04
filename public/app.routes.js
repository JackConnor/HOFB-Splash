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

    .when('/admin/dashboard', {
      templateUrl: 'templates/_adminDashboard.html'
      ,controller: 'dashCtrl'
      ,controllerAs: 'dash'
    })

    .when('/designer/dashboard', {
      templateUrl: 'templates/_designerDashboard.html'
      ,controller: 'dashCtrl'
      ,controllerAs: 'dash'
    })

    .when('/curator/dashboard', {
      templateUrl: 'templates/_curatorDashboard.html'
      ,controller: 'dashCtrl'
      ,controllerAs: 'dash'
    })

    /////////default to home
    .otherwise('/');

  ////////and of api routes///////
  ////////////////////////////////
  ////////////////////////////////
  }
