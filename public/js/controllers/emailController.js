var app = angular.module('emailController', [])

  .controller('emailCtrl', emailCtrl)

  emailCtrl.$inject = ['$http']
  function emailCtrl($http){
    var self = this;
    console.log('ououououo');

    navigator.geolocation.getCurrentPosition(function(data){
      console.log(data);
    })

  ////////end email controller//////
  ////////////////////////////////////
  ////////////////////////////////////
  }
