angular.module('userController', ['checkStatusFactory', 'checkPwFactory'])

  .controller('userCtrl', userCtrl)

  userCtrl.$inject = ['$http', 'checkstatus', 'checkPw'];
  function userCtrl($http, checkstatus,  checkPw){
    var self = this;

    self.test = "Boom";
  ////////end user controller//////
  /////////////////////////////////
  /////////////////////////////////
  }
