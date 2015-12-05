var app = angular.module('createProjectController', [])

  .controller('createProjectCtrl', createProjectCtrl)

  createProjectCtrl.$inject = ['$http']
  function createProjectCtrl($http){
    var self = this;

    //////global variables we'll be using for moving the carousel
    var carouselMargin = 0;
    var carouselCounter = 0;
    /////end global variables

    ///function controlling carousel movement forward
    function moveNext(){
      var singleCellDistance = $('.carouselBacking').width()* (0.24) + 4;
      var moveDistance = carouselMargin - singleCellDistance;
      carouselMargin = moveDistance;
      console.log(moveDistance);
      $('.carouselBacking').animate({
        marginLeft: moveDistance
      }, 200)
    }

    ///function controlling carousel movement forward
    function movePrevious(){
      var singleCellDistance = $('.carouselBacking').width()* (0.24) + 4;
      var moveDistance = carouselMargin + singleCellDistance;
      carouselMargin = moveDistance;
      console.log(moveDistance);
      $('.carouselBacking').animate({
        marginLeft: moveDistance
      }, 200)
    }

    $('.carouselRight').on('click', function(){
      moveNext();
    })

    $('.carouselLeft').on('click', function(){
      movePrevious();
    })


  /////end createProject controller
  ////////////////////////
  ////////////////////////

  }
