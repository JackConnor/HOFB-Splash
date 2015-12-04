var app = angular.module('emailController', ['allusersfactory', 'singleuserfactory', 'newuserfactory'])

  .controller('emailCtrl', emailCtrl)

  emailCtrl.$inject = ['$http', 'allUsers', 'singleUser', 'newUser']
  function emailCtrl($http, allUsers, singleUser, newUser){
    var self = this;
    console.log('ououououo');

    ///////get all users
    console.log(allUsers());

    //////use factory to search a single user
    var url = "5660e162312d9bf1f2d2dce6";
    console.log(singleUser(url));

    /////post a new user
    var newUserData = {firstname: "trinity", password: "password"}
    console.log(newUser(newUserData));


    /////////to autopopulate the location box
    // navigator.geolocation.getCurrentPosition(function(data){
    //   console.log(data);
    //   $http({
    //     method: "POST"
    //     ,url: "/api/cities"
    //     ,data: {long: data.coords.longitude, lat: data.coords.latitude}
    //   })
    //   .then(function(zipcode){
    //     console.log(zipcode);
    //     $('.locationInput').val(zipcode.data)
    //   })
    // })


    $('.collectEmail').on('click', function(){
      var emailAddress = $('.emailInput').val();
      // var location = $('.locationInput').val();
      $http({
        method: "POST"
        ,url: "/api/emailcaptures"
        ,data: {email: emailAddress, location: location}
      })
      .then(function(email){
        console.log(email);
        $http({
          method: "POST"
          ,url: "/api/sendemail"
          ,data: {email: emailAddress}
        })
        .then(function(email){
          console.log(email);
          window.location.reload()
        })
      })
    })

  ////////end email controller//////
  ////////////////////////////////////
  ////////////////////////////////////
  }
