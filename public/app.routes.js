angular.module('app.routes', ['ngRoute'])

  .config(appRoutes);

  appRoutes.$inject = ['$routeProvider'];

  function appRoutes($routeProvider){

    $routeProvider

    .when('/create/project', {
      templateUrl: 'templates/_createProject.html'
      ,controller: 'createProjectCtrl'
      ,controllerAs: 'createProject'
    })

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

    .when('/newproduct', {
      templateUrl: 'templates/_newproject.html'
      ,controller: 'projectCtrl'
      ,controllerAs: 'project'
    })

    /////////default to home
    .otherwise('/');

  ////////and of api routes///////
  ////////////////////////////////
  ////////////////////////////////
  }
