angular.module('tosController', [])

  .controller('tosCtrl', tosCtrl)

  tosCtrl.$inject = ['$http'];
  function tosCtrl($http){
    var self = this;
    // window.localStorage.checkPw = false;
    // checkPw.checkPassword();


    self.test = "Boom";
  ////////end user controller//////
  /////////////////////////////////
  /////////////////////////////////
  }
