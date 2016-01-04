angular.module('userProfileController', [])

  .controller('userProfileCtrl', userProfileCtrl)

  userProfileCtrl.$inject = ['$http'];
  function userProfileCtrl($http){
    var self = this;


    self.test = "Boom";
  ////////end userProfile controller//////
  /////////////////////////////////
  /////////////////////////////////
  }
