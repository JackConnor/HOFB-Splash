angular.module('newemailfactory', [])

  .factory('newEmail', newEmail)

  newEmail.$inject = ['$http'];
  function newEmail($http){

    return function postEmail(userEmail){
      $http({
        method: "POST"
        ,url: "/api/emailcaptures"
        ,data: {email: userEmail}
      })
      .then(function(email){
        $http({
          method: "POST"
          ,url: "/api/sendemail"
          ,data: {email: userEmail}
        })
        .then(function(email){
          console.log(email);
          // window.location.reload()
        })
      })
    }
    return singleUserCall;
  }
