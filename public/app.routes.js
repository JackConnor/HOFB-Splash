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
      ,controller: 'adminCtrl'
      ,controllerAs: 'admin'
    })

    .when('/designer/dashboard', {
      templateUrl: 'templates/_designerDashboard.html'
      ,controller: 'dashCtrl'
      ,controllerAs: 'dash'
    })

    .when('/buyer/dashboard', {
      templateUrl: 'templates/_buyerDashboard.html'
      ,controller: 'buyerCtrl'
      ,controllerAs: 'buyer'
    })

    //create new project
    .when('/create/project/:project_name', {
      templateUrl: 'templates/_newProject.html'
      ,controller: 'createProjectCtrl'
      ,controllerAs: 'createProject'
    })

    .when('/edit/project/:id', {
      templateUrl: 'templates/_editProject.html'
      ,controller: 'editProjectCtrl'
      ,controllerAs: 'editProject'
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

    //////go to all messages
    .when('/messages', {
      templateUrl: 'templates/_allMessages.html'
      ,controller: 'messageCtrl'
      ,controllerAs: 'message'
    })

    .when('/profile/:user_id', {
      templateUrl: 'templates/_userProfile.html'
      ,controller: 'userCtrl'
      ,controllerAs: 'user'
    })

    .when('/message/:messageId', {
      templateUrl: 'templates/_singleMessage.html'
      ,controller: 'messageCtrl'
      ,controllerAs: 'message'
    })
    /////////default to home
    .otherwise('/');

  ////////and of api routes///////
  ////////////////////////////////
  ////////////////////////////////
  }
