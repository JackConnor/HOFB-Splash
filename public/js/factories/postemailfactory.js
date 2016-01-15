angular.module('newemailfactory', [])

  .factory('newEmail', newEmail)

  newEmail.$inject = ['$http'];
  function newEmail($http){

    return function postEmail(userEmailInfo){
      console.log(userEmailInfo);
      $http({
        method: "POST"
        ,url: "/api/emailcaptures"
        ,data: {email: userEmailInfo.email, date: userEmailInfo.date}
      })
      .then(function(email){
        $http({
          method: "POST"
          ,url: "/api/email/betasignup"
          ,data: {email: email.data.email, signupLink: 'beta.hofb.com/#/designer/loginportal/'+email.data.email}
        })
        .then(function(email){
          console.log(email);
          window.location.reload();
        })
      })
    }
    return singleUserCall;
  }
