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
    //
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
    .when('/create/product/:project_name/:type/:season', {
      templateUrl: 'templates/_newProject.html'
      ,controller: 'createProjectCtrl'
      ,controllerAs: 'createProject'
    })

    .when('/edit/project/:id', {
      templateUrl: 'templates/_editProject.html'
      ,controller: 'editProjectCtrl'
      ,controllerAs: 'editProject'
    })

    .when('/beta', {
      templateUrl: 'templates/_beta_gotologin.html'
      ,controller: 'emailCtrl'
      ,controllerAs: 'email'
    })

    .when('/buyer/loginportal', {
      templateUrl: 'templates/_signup.html'
      ,controller: 'signupCtrl'
      ,contollerAs: 'signup'
    })

    .when('/designer/loginportal', {
      templateUrl: 'templates/_signup.html'
      ,controller: 'signupCtrl'
      ,contollerAs: 'signup'
    })
    ////designer login from link
    .when('/designer/loginportal/:email', {
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

    //////go to all messages
    .when('/getemails', {
      templateUrl: 'templates/_getemails.html'
      ,controller: 'emailCtrl'
      ,controllerAs: 'email'
    })

    .when('/purchase/:product_id', {
      templateUrl: 'templates/_purchaseOrder.html'
      ,controller: 'buyerCtrl'
      ,controllerAs: 'order'
    })

    //Get single user profile info
    .when('/profile/:user_id', {
      templateUrl: 'templates/_userProfile.html'
      ,controller: 'userProfileCtrl'
      ,controllerAs: 'userProfile'
    })

    .when('/message/:messageId', {
      templateUrl: 'templates/_singleMessage.html'
      ,controller: 'messageCtrl'
      ,controllerAs: 'message'
    })

    .when('/password/reset/:encrypted_id', {
      templateUrl: 'templates/_changePassword.html'
      ,controller: 'userProfileCtrl'
      ,controllerAs: 'userProfile'
    })
    /////////default to home
    .otherwise('/');

  ////////and of api routes///////
  ////////////////////////////////
  ////////////////////////////////
  }
