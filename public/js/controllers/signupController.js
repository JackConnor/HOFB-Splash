angular.module('signupController', ['checkStatusFactory', 'signupUserFactory', 'startSessionFactory', 'checkPwFactory'])

  .controller('signupCtrl', signupCtrl)

  signupCtrl.$inject = ['$http', 'checkstatus', 'signupUser', 'startSession', 'checkPw'];
  function signupCtrl($http, checkstatus, signupUser, startSession, checkPw){
    var self = this;

    self.signInUpCounter = "signin";
    self.viewToggle = "designer";////for controller whether buyer or designer portion of page are displayed
    // window.localStorage.checkPw = false;
    // checkPw.checkPassword();
    /////event to sign up a new user from signup page
    function checkFromEmailLink(){
      if(window.location.hash.split('/')[3] && window.location.hash.split('/')[2] == 'loginportal'){
        console.log('made it');
        var email = window.location.hash.split('/')[3];
        console.log(email);
        $('.signupEmail').val(email);
      }
    }
    checkFromEmailLink();

    function checkEmail(email){
        var pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        if(pattern.test(email)){
            return true;
        }else{
            return false;
        }
    }

    function signupUser(){
      var email = $('.signupEmail').val();
      var firstName = $('.signupFirstName').val();
      var lastName = $('.signupLastName').val();
      var password = $('.signupPassword').val();
      var rePassword = $('.signupPasswordRepeat').val();
      var checked = document.querySelector('.signupCheck').checked;
      var status = window.location.hash.split('/')[1];
      var validatedEmail = checkEmail(email);

        if (validatedEmail == false) {
        alert("You must enter a valid email address.");
       }
        if (validatedEmail == true){
          if(email != '' && firstName != '' && lastName != '' && password != '' && rePassword != '' && checked){
            ///////throught first layer to check that all firelds were filled
            if(checkPassword(password) && checkPassword(rePassword) && (password == rePassword)){
              ////checked that passwords matched and passed our password filters
              $http({
                method: "POST"
                ,url: "/api/signup"
                ,data: {email: email, password: $('.signupPassword').val(), firstname: firstName, lastname: lastName, status: status}
              })
              .then(function(newUser){
                console.log(newUser);
                if(newUser.data == "user exists"){
                  alert('That email is already in our system, please try a new email');
                  window.location.reload();
                }
                else{
                  console.log(newUser);
                  signinUser(newUser.data.email, $('.signupPassword').val());
                }
              })
            }
            else {
              alert('whoops, looks like those two passwords dont match')
            }
          }
        }
        else{
            alert("You missed a field, please take a second look, thank you")
          }
    }
    ///////////event to trigger a user signup
    $('.signupSubmit').on('click', function(){
      signupUser();
    })
    // event to trigger starting a session from signin page
    $('.signinSend').on('click', function(){
      var email = $('.signinEmail').val();
      var password = $('.signinPassword').val();
      signinUser(email, password);
    })
    function keyboardSignin(){
      $('body').on('keypress', function(evt){
        console.log($(evt)[0].charCode);
        if($(evt)[0].charCode == 13){
          console.log(self.signInUpCounter);
            if(self.signInUpCounter == "signin"){
              var email = $('.signinEmail').val();
              var password = $('.signinPassword').val();
              signinUser(email, password);
            }
            else if(self.signInUpCounter == "signup"){
              signupUser();
            }
        }
      })
    }
    keyboardSignin();
    ////////set toggle to signin
    $('.signinEmail').on('click', function(){
      self.signInUpCounter = 'signin';
      keyboardSignin();
    })
    $('.signinPassword').on('click', function(){
      self.signInUpCounter = 'signin';
      keyboardSignin();
    })
    //////set toggle to signup
    $('.signupEmail').on('click', function(){
      self.signInUpCounter = 'signup';
      console.log(self.signInUpCounter);
      keyboardSignin();
    })
    $('.signupFirstName').on('click', function(){
      self.signInUpCounter = 'signup';
      keyboardSignin();
    })
    $('.signupLastName').on('click', function(){
      self.signInUpCounter = 'signup';
    })
    $('.signupPassword').on('click', function(){
      self.signInUpCounter = 'signup';
    })
    $('.signupPasswordRepeat').on('click', function(){
      self.signInUpCounter = 'signup';
    })
    $('.signupCheck').on('click', function(){
      self.signInUpCounter = 'signup';
    })

    // var email = $('.signupEmail').val();
    // var firstName = $('.signupFirstName').val();
    // var lastName = $('.signupLastName').val();
    // var password = $('.signupPassword').val();
    // var rePassword = $('.signupPasswordRepeat').val();
    // var checked = document.querySelector('.signupCheck').checked;

    /////a function to check that passwords are a-z 1-9
    function checkPassword(password){
        var pattern = /^[a-zA-Z0-9_-]{6,15}$/;
        if(pattern.test(password)){
            return true;
        }else{
            return false;
        }
    }

    ///////function to signin a new user from signin page
    function signinUser(email, pw){
      startSession.startSession(email, pw, function(token){
        $http({
          method:"GET"
          ,url: '/api/checkstatus/'+token
        })
        .then(function(decToken){
          var newUrl = "#/"+decToken.data.aud.split('-')[0]+"/dashboard";
          window.localStorage.hofbTourOff = false;
          window.location.hash = newUrl;
          window.location.reload();
        })
      });
    }

    ///////////////////////////////////////////
    /////////logic for the navbar and toggle///

    /////link to signup function
    function goToSignup(){
      if(self.viewToggle == "designer"){
        window.location.hash = "#/designer/signup"
      } else if(self.viewToggle == "buyer"){
        window.location.hash = "#/buyer/signup"
      }
    }
    ////////////link to signup event listener
    $('.signupButton').on('click', function(){
      goToSignup();
    })

    ////make links light up on hover
    $('.splashNavLinksText').on('mouseenter', function(){
      $(this).css({
          backgroundColor: "#A9E2F3"
        });
    })

    ////make links un-light up on mouseleave
    $('.splashNavLinksText').on('mouseleave', function(){
      $(this).css({
          backgroundColor: ""
        });
    })

    //////toggle to designer version
    $('.splashNavLinksText1').on('click', function(){
      if(self.viewToggle == "buyer"){
        self.viewToggle = 'designer';
        console.log(self.viewToggle);
        swapToDesigner();
      }
    })

    //////toggle to buyer version
    $('.splashNavLinksText2').on('click', function(){
      if(self.viewToggle == "designer"){
        self.viewToggle = 'buyer';
        console.log(self.viewToggle);
        swapToBuyer();
      }
    })

    ///////////////////////////////////////////
    //////////Begin Toggle Logic///////////////

    ///
    function swapToBuyer(){
      ///change image
      $('.splashBackgroundImage').attr('src', 'http://st.depositphotos.com/1037987/2504/i/950/depositphotos_25048555-Meeting-In-Fashion-Design-Studio.jpg')
      ////change instruction images
      $('.howTo1').attr('src', '/img/buyerstep.jpg');
      $('.howTo2').attr('src', '/img/buyerstep.jpg');
      $('.howTo3').attr('src', '/img/buyerstep.jpg');
      $('.howTo4').attr('src', '/img/buyerstep.jpg');
      $('.howTo5').attr('src', '/img/buyerstep.jpg');
      $('.howTo6').attr('src', '/img/buyerstep.jpg');
      self.viewToggle = "buyer";
    }

    function swapToDesigner(){
      ///change image
      $('.splashBackgroundImage').attr('src', 'http://www.allfashionstyles.com/wp-content/uploads/2015/01/Top-Fashion-Design-Schools-in-The-World.jpeg')
      ////change instruction images
      $('.howTo1').attr('src', '/img/howtofiller.jpg');
      $('.howTo2').attr('src', '/img/howtofiller.jpg');
      $('.howTo3').attr('src', '/img/howtofiller.jpg');
      $('.howTo4').attr('src', '/img/howtofiller.jpg');
      $('.howTo5').attr('src', '/img/howtofiller.jpg');
      $('.howTo6').attr('src', '/img/howtofiller.jpg');
      self.viewToggle = "designer";
    }
    ////////////End Toggle Logic///////////////
    ///////////////////////////////////////////

    /////End logic for the navbar and toggle///
    ///////////////////////////////////////////

    //////////////////////////////////////////
    /////////////Begin logic for signup page//

    /////interpolate text into signup content
    function intSignup(){
      var userType = window.location.hash.split('/')[1];
      $('.signupUserType').text(userType);
    }
    intSignup();
    /////////////End logic for signup page////
    //////////////////////////////////////////

    ////////////////functions controller buyer/designer signup process
    function buyerDesigner(){
      var userType = window.location.hash.split('/')[1];
      if(userType == 'buyer'){
        $('.signinToggle').html('designer');
        $('.signinToggleActive').html('designer login');
        $('.signinToggleActive').on('click', function(){
          window.location.hash = "#/designer/loginportal";
          window.location.reload();
        })
      }
      else if(userType == 'designer'){
        $('.signinToggle').html('retail buyer');
        $('.signinToggleActive').html('retailer login');
        $('.signinToggleActive').on('click', function(){
          window.location.hash = "#/buyer/loginportal";
          window.location.reload();
        })
      }
    }
    buyerDesigner();
  //////////////End signup controller////
  ///////////////////////////////////////
  ///////////////////////////////////////
  }
