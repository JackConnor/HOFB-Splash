angular.module('signupController', ['checkStatusFactory', 'signupUserFactory', 'startSessionFactory', 'checkPwFactory'])

  .controller('signupCtrl', signupCtrl)

  signupCtrl.$inject = ['$http', 'checkstatus', 'signupUser', 'startSession', 'checkPw'];
  function signupCtrl($http, checkstatus, signupUser, startSession, checkPw){
    window.localStorage.testing = "blahhhh";
    var self = this;

    self.viewToggle = "designer";////for controller whether buyer or designer portion of page are displayed
    // window.localStorage.checkPw = false;
    // checkPw.checkPassword();
    /////event to sign up a new user from signup page
    $('.signupSubmit').on('click', function(){
      console.log('lolll');
      var password = $('.signupPassword').val();
      var rePassword = $('.signupPasswordRepeat').val();
      var status = window.location.hash.split('/')[1];
      console.log(status);
      if(password == rePassword){
        signupUser.signup(startSession.startSession, password, status);
        setTimeout(function(){
          window.location.hash = "#/"+status+"/dashboard"
        }, 1500)
      } else {
        alert('your passwords dont match');
      }
    })

    ///////function to signin a new user from signin page
    function signinUser(email, pw){
      startSession.startSession(email, pw, function(token){
        $http({
          method:"GET"
          ,url: '/api/checkstatus/'+token
        })
        .then(function(decToken){
          console.log('in here');
          console.log(decToken);
          var newUrl = "#/"+decToken.data.aud.split('-')[0]+"/dashboard";
          console.log(newUrl);
          window.location.hash = newUrl;
        })
      });
    }

    // event to trigger starting a session from signin page
    $('.signinSubmit').on('click', function(){
      var email = $('.signinEmail').val();
      var password = $('.signinPassword').val();
      var rePassword = $('.signinPasswordRepeat').val();
      if(password == rePassword){
        console.log('tryig to sign in');
        signinUser(email, password);
        // window.location.hash = "#/designer/dashboard"

      } else {
        console.log('not matching dude');
      }
    })
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

  //////////////End signup controller////
  ///////////////////////////////////////
  ///////////////////////////////////////
  }
