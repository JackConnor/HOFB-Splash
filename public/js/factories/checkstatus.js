var checkStatusFactory = angular.module('checkStatusFactory', [])

  .factory('checkstatus', checkstatus);

  checkstatus.$inject = ['$http'];
  function checkstatus($http){

    var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJob2ZiLmNvbSIsIm5hbWUiOiJoYXJyeXlleWUuY29tIiwiaWF0IjoxNDQ5NTQ5MDc5LCJleHAiOjE0NDk1NjM0NzksImF1ZCI6ImRlc2lnbmVyIn0.V9TXTyLvVKAOX2qYKkqRBghbMdOOm1g5zLf0AVZQtoY";
    // function checkCall(token){
      return $http({
        method: "GET"
        ,url: "/api/checkstatus/"+token
      })
      .then(function(data){
        self.data = data;
        return data;
      })
    // }

    // return checkCall;
    // return function(){
    //   return 5555;
    // }


    // function checkAdmin(){
      //
      // return $http({
      //   method: "POST"
      //   ,url: "/api/checkstatus"
      //   ,data: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJob2ZiLmNvbSIsIm5hbWUiOiJoYXJyeXlleWUuY29tIiwiaWF0IjoxNDQ5NTQ4MjA5LCJleHAiOjE0NDk1NjI2MDksImF1ZCI6ImRlc2lnbmVyIn0.esBeMyDvBRfnTN6CvO14SemEMGzLRgn4pkIRLrvTmMY"
      // })
      // .then(function(data){
      //   console.log(data);
      //   return data;
      // })
    //   return "yellow"
    // }
    console.log(checkAdmin());
    return checkAdmin;
    //
  //
  }
