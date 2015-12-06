angular.module('signupController', [])

  .controller('signupCtrl', signupCtrl)

  signupCtrl.$inject = ['$http'];
  function signupCtrl($http){
    var self = this;

    self.viewToggle = "designer";////for controller whether buyer or designer portion of page are displayed

    ///////////////////////////////////////////
    /////////logic for the navbar and toggle///

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

    //////toggle to buyer version
    $('.splashNavLinksText2').on('click', function(){
      if(self.viewToggle == "designer"){
        self.viewToggle = 'buyer';
        console.log(self.viewToggle);
        swapToBuyer();
      }
    })

    //////toggle to designer version
    $('.splashNavLinksText1').on('click', function(){
      if(self.viewToggle == "buyer"){
        self.viewToggle = 'designer';
        console.log(self.viewToggle);
      }
    })

    ///////////////////////////////////////////
    //////////Begin Toggle Logic///////////////
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

    }
    ////////////End Toggle Logic///////////////
    ///////////////////////////////////////////

    /////End logic for the navbar and toggle///
    ///////////////////////////////////////////

  //////////////End signup controller////
  ///////////////////////////////////////
  ///////////////////////////////////////
  }
