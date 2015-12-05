var app = angular.module('createProjectController', [])

  .controller('createProjectCtrl', createProjectCtrl)

  createProjectCtrl.$inject = ['$http']
  function createProjectCtrl($http){
    var self = this;

    //////global variables we'll be using for moving the carousel
    var carouselMargin = 0;
    var carouselCounter = 0;
    /////end global variables

    ///////////////////////////////////////////
    //////////begin logic for moving carousel//
    ///function controlling carousel movement forward
    function moveNext(){
      var singleCellDistance = $('.carouselBacking').width()* (0.24) + 4;
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
      var singleCellDistance = $('.carouselBacking').width()* (0.24) + 4;
      var moveDistance = carouselMargin + singleCellDistance;
      carouselMargin = moveDistance;
      carouselCounter --;
      console.log(carouselCounter);
      $('.carouselBacking').animate({
        marginLeft: moveDistance
      }, 200)
    }

    $('.carouselRight').on('click', function(){
      if(carouselCounter < 3){
        moveNext();
      }
    })

    $('.carouselLeft').on('click', function(){
      if(carouselCounter > 0){
        movePrevious();
      }
    })

    //////////end logic for moving carousel////
    ///////////////////////////////////////////


  /////end createProject controller
  ////////////////////////
  ////////////////////////

  }
