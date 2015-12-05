var app = angular.module('createProjectController', [])

  .controller('createProjectCtrl', createProjectCtrl)

  createProjectCtrl.$inject = ['$http']
  function createProjectCtrl($http){
    var self = this;

    //////global variables we'll be using for moving the carousel
    var carouselMargin = 0; ///keeps track of carousel's margin
    var carouselCounter = 0;///keeps track of carousel's postion in the queue
    /////end global variables

    ///////////////////////////////////////////
    //////////begin logic for moving carousel//
    ///function controlling carousel movement forward
    function moveNext(){
      var singleCellDistance = $('.carouselBacking').width()* (0.192) + 4;
      var moveDistance = carouselMargin - singleCellDistance;
      carouselMargin = moveDistance;
      carouselCounter ++;
      console.log(carouselCounter);
      $('.carouselBacking').animate({
        marginLeft: moveDistance
      }, 200)
    }

    ///function controlling carousel movement forward
    function movePrevious(){
      var singleCellDistance = $('.carouselBacking').width()* (0.192) + 4;
      var moveDistance = carouselMargin + singleCellDistance;
      carouselMargin = moveDistance;
      carouselCounter --;
      $('.carouselBacking').animate({
        marginLeft: moveDistance
      }, 200)
    }

    $('.carouselRight').on('click', function(){
      if(carouselCounter < 4){
        moveNext();
      }
      highlightCounter();
    })

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
        for (var i = 1; i < 4; i++) {
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
        for (var i = 2; i < 4; i++) {
          $('.circle'+i).css({
            backgroundColor: "white"
          })
        }
      } else if(carouselCounter == 2){
        $('.circle2').css({
          backgroundColor: 'blue'
        })
        $('.circle3').css({
          backgroundColor: "white"
        })
        for (var i = 0; i < 2; i++) {
          $('.circle'+i).css({
            backgroundColor: "white"
          })
        }
      } else if(carouselCounter == 3){
        $('.circle3').css({
          backgroundColor: 'blue'
        })
        $('.circle4').css({
          backgroundColor: "white"
        })
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
      }
    }
    highlightCounter(); //run to set counter on load

    /////////end logic for progress counter/////
    ////////////////////////////////////////////


  /////end createProject controller
  ////////////////////////
  ////////////////////////

  }
