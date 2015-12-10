angular.module('viewProductController', [])

  .controller('viewProductCtrl', viewProductCtrl)

  viewProductCtrl.$inject = ['$http'];
  function viewProductCtrl($http){
    var self = this;
    console.log('vieProductController is working');
    self.test=('self test');




  $("#commentSubmit").on('click', function(){
          console.log('boom');
    });



  /////end viewProduct controller
  ////////////////////////
  ////////////////////////
  //self.test=('self test'); // quick way to testing displaying data
  }
