angular.module('userProfileController', ['singleuserfactory'])

  .controller('userProfileCtrl', userProfileCtrl)

  userProfileCtrl.$inject = ['$http', 'singleUser'];
  function userProfileCtrl($http, singleUser){
    var self = this;

//grabs userId from URL
    var userProfileHashData = window.location.hash.split('/')[2];////grab the id of the data in order to prepopulate the page

//test userId with all data, except image - 568c3b81be426e0ad0bd5248
    if(window.location.hash.split('/')[1] == "profile"){
      function checkToken(){
        var token = window.localStorage.hofbToken;
        if(token){
          console.log('aight');
        }
        else {
          alert('Please login or sign up to view this page');
          window.location.hash = "#/designer/loginportal";
          window.location.reload();
        }
      }
      checkToken();
      singleUser(userProfileHashData)
      .then(function (user){
        if(user == 'no id'){
          window.location.hash = "#/designer/dashboard";
          window.location.hash.reload();
        }
        console.log(user);
        self.user = user
      })
    }

  // User profile update button wiring
  $(".userProfileSubmitBtn").on('click', function(){
    console.log('Update button is working');
          updateUserProfile();
          // location.reload();
    });
// Update user password button wiring
  $(".userProfileChangePw").on('click', function(){
    console.log('Update PW button is working');
    var resetLink = "beta.hofb.com/#/password/reset/"+window.location.hash.split('/')[2];
    $http({
      method: "POST"
      ,url: "/api/email/password"
      ,data: {resetLink: resetLink, email: self.user.data.email}
    })
    .then(function(data){
      console.log(data);
      // window.location.hash = "#/"
    })
  });
// user profile photo upload
$(".userProfileImageFileUpload").on('change', function (){
  console.log('profile upload on change is working');
  console.log($(".userProfileImageFileUpload"));
  });


    function updateUserProfile() {
      var userProfileId = $(userProfileHashData)
      console.log(userProfileId);
      var userFirstName = $('#userProfileFirstName').val();
      console.log($('#userProfileFirstName'));
      var userLastName = $('#userProfileLastName').val();
      var userProfileLocation = $('#userProfileLocation').val();
      var userBio = $('#userProfileBio').val();
      var userEmail = $('#userProfileEmail').val();

      var userData = {
        firstname:userFirstName,
        lastname:userLastName,
        location:userProfileLocation,
        bio:userBio,
        email:userEmail,
        userId: userProfileId.selector,
      };
      console.log(userData);
      self.test=(userData);
      $http({
        method: "POST"
        ,url: "/api/users/update"
        ,data: userData
      })
      .then(function(data){
        console.log(data);
        // newForm();
      })
      if (status = '200'){
        alert('Your profile has been updated')
      }
    }

    function checkPassword(password){
        var pattern = /^[a-zA-Z0-9_-]{6,15}$/;
        if(pattern.test(password)){
            return true;
        }else{
            return false;
        }
    }

  function updateUserProfilePassword(){
    console.log('changing');
    var passOld = $('.inputOldPassword').val();
    var pass1 = $('.inputPassword').val();
    var pass2 = $('.inputPasswordConfirm').val();
    var userId =  window.location.hash.split('/')[3];
    console.log(userId);
    console.log(passOld);
    console.log(pass1);
    console.log(pass2);
    $http({
      method: "POST"
      ,url: "/api/check/password"
      ,data: {userId:userId, password: passOld}
    })
    .then(function(result){
      console.log(result);
      ////////////first check - is the original password correct?
      if(result.data == true){
        //////second check - do the two new passwords match?
        if(pass1 == pass2){
          console.log('worked');
          var checkedPassword = checkPassword(pass1);
          if (checkedPassword){
            var pwHash = pass1
            var userProfileId = window.location.hash.split('/')[3];
            console.log(userProfileId);
            var userPwData ={
              password:pwHash,
              userId: userProfileId
            }
            console.log(userPwData);
            self.test=(userPwData);
            $http({
              method: "POST"
              ,url: "/api/users/update"
              ,data: userPwData
            })
            .then(function(data){
              console.log(data);
              alert('Your Password is Updated');
              window.location.hash = "#/designer/dashboard";
            })
          }
          else{
            alert('Minimum of 6 characters - No special characters in password, please re-enter your password and try again.')
          }
        }
        else{
          alert('Please make sure your passwords match');
        }
      }
      else{
        alert('You need to enter your old password correctly, in order to update to a new password');
      }
    })
  }
  $('.changePassword').on('click', function(){
    updateUserProfilePassword();
  });


  /////////////post for password verification email////////////////
  function postPasswordVericationEmail(userEmailInfo){
    console.log(userEmailInfo);
    $http({
      method: "POST"
      ,url: "/api/email/password"
      ,data: {email: userEmailInfo.email, date: userEmailInfo.date}
    })
    .then(function(email){
      $http({
        method: "POST"
        ,url: "/api/sendemail"
        ,data: {email: email.data.email}
      })
      .then(function(email){
        alert('your password has been emailed to you')
      })
    })
  }



  //////////////multer form///////////////
  //////////////////////////////////////
  function newForm(){
    $('.bodyview').append(
      "<form class='tempForm' action='/api/profile/pictures' method='POST' enctype='multipart/form-data'>"+
      "</form>"
    )
    $('.tempForm').append($('#userProfileImageFileUpload')[0]);
    $('.tempForm').append(
      "<input name='userId' type='text' value='"+userProfileHashData+"'>"
    );
    console.log('.tempForm');
    $('.tempForm').submit(function(){
      console.log('submitted');
    });
  }
// $(".userProfileSubmitBtn").on('click', newForm)
///////////end of multer form/////////////
//////////////////////////////////////

//////navbar click events
  $('.navTitle').on('click', function(){
    window.location.hash = "#/designer/dashboard";
  });
  $('#navBarEnvelopeIcon').on('click', function(){
    window.location.hash = "#/messages";
  })

  ////////end userProfile controller//////
  /////////////////////////////////
  /////////////////////////////////

  /////start of navbar dropdown logic/////////////
  ////////////////////////////////////////////////
  $(".dropbtn").on('click', function(){
    console.log('dropbtn is working');
          myFunction();
          // location.reload();
    });

  /* When the user clicks on the button,
  toggle between hiding and showing the dropdown content */
  function myFunction() {
      document.getElementById("myDropdown").classList.toggle("show");
  }

  // Close the dropdown if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {

      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
  /////end of navbar dropdown logic/////////////
  ////////////////////////////////////////////////

  // logout button functionality
  $('.logoutButton').on('click', function(){
    window.localStorage.hofbToken = "";
    window.location.hash = "#/designer/loginportal"
  })

}
