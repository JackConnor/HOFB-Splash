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

    .when('/signin', {
      templateUrl: 'templates/_signin.html'
      ,controller: 'signupCtrl'
      ,controllerAs: 'signin'
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

    //create new project
    .when('/create/project', {
      templateUrl: 'templates/_newProject.html'
      ,controller: 'createProjectCtrl'
      ,controllerAs: 'createProject'
    })

    .when('/edit/project/:id', {
      templateUrl: 'templates/_editProject.html'
      ,controller: 'createProjectCtrl'
      ,controllerAs: 'createProject'
    })

    .when('/betasplash', {
      templateUrl: 'templates/_beta_splash.html'
      ,controller: 'signupCtrl'
      ,controllerAs: 'signup'
    })

    .when('/buyer/signup', {
      templateUrl: 'templates/_signup.html'
      ,controller: 'signupCtrl'
      ,contollerAs: 'signup'
    })

    .when('/designer/signup', {
      templateUrl: 'templates/_signup.html'
      ,controller: 'signupCtrl'
      ,contollerAs: 'signup'
    })
    //view a single Product
    .when('/view/product/:id', {
      templateUrl: 'templates/_viewProduct.html'
      ,controller: 'viewProductCtrl'
      ,controllerAs: 'viewProduct'
    })
    /////////default to home
    .otherwise('/');

  ////////and of api routes///////
  ////////////////////////////////
  ////////////////////////////////
  }
