var app = angular.module('createProjectController', ['postProjectFactory'])

  .controller('createProjectCtrl', createProjectCtrl)

  createProjectCtrl.$inject = ['$http', 'postProject']
  function createProjectCtrl($http, postProject){
    var self = this;
    //////global variables we'll be using for moving the carousel
    var carouselMargin = 0; ///keeps track of carousel's margin
    var carouselCounter = 0;///keeps track of carousel's postion in the queue
    /////end global variables

    // console.log(postProject);
    // console.log(postProject.postProject({name: "The Wonder Mop"}));<---logic for post project factory call

    ////click effect for seasonsplash
    $('.createSeason').on('click', function(evt){
      console.log(evt.target);
      console.log($(evt.target).css('opacity'));
      if($(evt.target).css('opacity') == 1 ){
        $(evt.target).css({
          opacity: 0.5
          ,backgroundColor: "blue"
        })
      } else {
        $(evt.target).css({
          opacity: 1
          ,backgroundColor: ""
        })
      }

    })


    ///////////////////////////////////////////
    //////////begin logic for moving carousel//
    ///function controlling carousel movement forward
    function moveNext(){
      var singleCellDistance = $('.carouselBacking').width()* (0.12) + 4;
      var moveDistance = carouselMargin - singleCellDistance;
      carouselMargin = moveDistance;
      carouselCounter ++;
      getName();
      $('.carouselBacking').animate({
        marginLeft: moveDistance
      }, 200)
    }

    ///function controlling carousel movement forward
    function movePrevious(){
      var singleCellDistance = $('.carouselBacking').width()* (0.12) + 4;
      var moveDistance = carouselMargin + singleCellDistance;
      carouselMargin = moveDistance;
      carouselCounter --;
      $('.carouselBacking').animate({
        marginLeft: moveDistance
      }, 200)
    }

    ///on-click, move to next page
    $('.carouselRight').on('click', function(){
      if(carouselCounter < 7){
        moveNext();
      }
      highlightCounter();
    })

    //on click, move to the last page
    $('.carouselLeft').on('click', function(){
      if(carouselCounter > 0){
        movePrevious();
      }
      highlightCounter();
    })
    //////////end logic for moving carousel////
    ///////////////////////////////////////////

    ////////////////////////////////////////////
    /////////begin logic for progress counter///
    function highlightCounter(){
      if(carouselCounter == 0){
        $('.circle0').css({
          backgroundColor: 'blue'
        })
        for (var i = 1; i < 8; i++) {
          $('.circle'+i).css({
            backgroundColor: "white"
          })
        }
      } else if(carouselCounter == 1){
        $('.circle1').css({
          backgroundColor: 'blue'
        })
        $('.circle0').css({
          backgroundColor: "white"
        })
        for (var i = 2; i < 8; i++) {
          $('.circle'+i).css({
            backgroundColor: "white"
          })
        }
      } else if(carouselCounter == 2){
        $('.circle2').css({
          backgroundColor: 'blue'
        })
        for (var i = 3; i < 8; i++) {
          $('.circle'+i).css({
            backgroundColor: "white"
          })
        }
        for (var i = 0; i < 2; i++) {
          $('.circle'+i).css({
            backgroundColor: "white"
          })
        }
      } else if(carouselCounter == 3){
        $('.circle3').css({
          backgroundColor: 'blue'
        })
        for (var i = 4; i < 8; i++) {
          $('.circle'+i).css({
            backgroundColor: "white"
          })
        }
        for (var i = 0; i < 3; i++) {
          $('.circle'+i).css({
            backgroundColor: "white"
          })
        }
      } else if(carouselCounter == 4){
        $('.circle4').css({
          backgroundColor: 'blue'
        })
        for (var i = 0; i < 4; i++) {
          $('.circle'+i).css({
            backgroundColor: "white"
          })
        }
        for (var i = 5; i < 8; i++) {
          $('.circle'+i).css({
            backgroundColor: "white"
          })
        }
      } else if(carouselCounter == 5){
        $('.circle5').css({
          backgroundColor: 'blue'
        })
        for (var i = 0; i < 5; i++) {
          $('.circle'+i).css({
            backgroundColor: "white"
          })
        }
        for (var i = 6; i < 8; i++) {
          $('.circle'+i).css({
            backgroundColor: "white"
          })
        }
      } else if(carouselCounter == 6){
        $('.circle6').css({
          backgroundColor: 'blue'
        })
        for (var i = 0; i < 6; i++) {
          $('.circle'+i).css({
            backgroundColor: "white"
          })
        }
        for (var i = 7; i < 8; i++) {
          $('.circle'+i).css({
            backgroundColor: "white"
          })
        }
      } else if(carouselCounter == 7){
        for (var i = 0; i < 7; i++) {
          $('.circle'+i).css({
            backgroundColor: "white"
          })
        }
        $('.circle7').css({
          backgroundColor: "blue"
        })
      }
    }
    highlightCounter(); //run to set counter on load

    /////////end logic for progress counter/////
    ////////////////////////////////////////////

    ////////////////////////////////////////////
    //////begin logic for click to switch page//
    function circleClick(){
      $('.circle0').on('click', function(evt){
        var circlePosition = $(evt.target)[0].className.split('')[13];
        clickDistance(circlePosition);
        highlightCounter();
      })
      $('.circle1').on('click', function(evt){
        var circlePosition = $(evt.target)[0].className.split('')[13];
        clickDistance(circlePosition);
        highlightCounter();
      })
      $('.circle2').on('click', function(evt){
        var circlePosition = $(evt.target)[0].className.split('')[13];
        clickDistance(circlePosition);
        highlightCounter();
      })
      $('.circle3').on('click', function(evt){
        var circlePosition = $(evt.target)[0].className.split('')[13];
        clickDistance(circlePosition);
        highlightCounter();
      })
      $('.circle4').on('click', function(evt){
        var circlePosition = $(evt.target)[0].className.split('')[13];
        clickDistance(circlePosition);
        highlightCounter();
      })
    }
    circleClick();

    ////function for calculating distance
    function clickDistance(circlePosition){
      var spaces = circlePosition - carouselCounter;
      var singleCellDistance = $('.carouselBacking').width()* (0.192) + 4;
      var moveDistance = carouselMargin + (singleCellDistance*spaces*-1);
      carouselMargin = moveDistance;
      carouselCounter = circlePosition;
      getName();
      $('.carouselBacking').animate({
        marginLeft: moveDistance
      }, 300)
      // $('.carouselBacking').css({
      //   marginLeft: carouselMargin
    }

    //////end logic for click to switch page//
    ////////////////////////////////////////////

    function getName(){
      var name = $('.carouselNameEntry').val();
      if(name.split('').length > 0){
        console.log('there something there');
        $('.productTitle').text(name);
      }
    }
    // getName();

  /////end createProject controller
  ////////////////////////
  ////////////////////////

  }
