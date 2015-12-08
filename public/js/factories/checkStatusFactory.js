var checkStatusFactory = angular.module('checkStatusFactory', [])

  .factory('checkstatus', checkstatus);

  checkstatus.$inject = ['$http'];
  function checkstatus($http){

    var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJob2ZiLmNvbSIsIm5hbWUiOiJoYXJyeXlleWUuY29tIiwiaWF0IjoxNDQ5NTQ5MDc5LCJleHAiOjE0NDk1NjM0NzksImF1ZCI6ImRlc2lnbmVyIn0.V9TXTyLvVKAOX2qYKkqRBghbMdOOm1g5zLf0AVZQtoY";
    // var token = window.location.localStorage.token;
    return $http({
      method: "GET"
      ,url: "/api/checkstatus/"+token
    })
    .then(function(data){
      self.data = data;
      return data;
    })
  }
