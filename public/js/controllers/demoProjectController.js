angular.module('demoProjectController', [])

  .controller('demoProjectCtrl', demoProjectCtrl)

  demoProjectCtrl.$inject = ['$http'];
  function demoProjectCtrl($http){
    var self = this;
    // window.localStorage.checkPw = false;
    // checkPw.checkPassword();


    self.test = "demoProjectController test";
    console.log('demo project console log test');
  ////////end user controller//////
  /////////////////////////////////
  /////////////////////////////////
  }
