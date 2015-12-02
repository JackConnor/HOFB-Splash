var app = angular.module('emailController', [])

  .controller('emailCtrl', emailCtrl)

  emailCtrl.$inject = ['$http']
  function emailCtrl($http){
    var self = this;
    console.log('ououououo');

    /////////to autopopulate the location box
    navigator.geolocation.getCurrentPosition(function(data){
      console.log(data);
      $http({
        method: "POST"
        ,url: "/api/cities"
        ,data: {long: data.coords.longitude, lat: data.coords.latitude}
      })
      .then(function(zipcode){
        console.log(zipcode);
        $('.locationInput').val(zipcode.data)
      })
    })


    $('.collectEmail').on('click', function(){
      var emailAddress = $('.emailInput').val();
      var location = $('.locationInput').val();
      $http({
        method: "POST"
        ,url: "/api/emailcaptures"
        ,data: {email: emailAddress, location: location}
      })
      .then(function(email){
        $http({
          method: "POST"
          ,url: "/api/sendemail"
          ,data: {email: emailAddress}
        })
        .then(function(){
          window.location.reload()
        })
      })
    })

  ////////end email controller//////
  ////////////////////////////////////
  ////////////////////////////////////
  }
