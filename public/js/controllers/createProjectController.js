var app = angular.module('createProjectController', [])

  .controller('createProjectCtrl', createProjectCtrl)

  createProjectCtrl.$inject = ['$http']
  function createProjectCtrl($http){
    var self = this;

    var carouselCounter = 0;
    $('.carouselRight').on('click', function(){
      var singleCellDistance = $('.carouselBacking').width()* (0.24) + 4;
      var moveDistance = carouselCounter - singleCellDistance;
      carouselCounter = moveDistance;
      console.log(moveDistance);
      $('.carouselBacking').animate({
        marginLeft: moveDistance
      }, 200)
    })


  /////end createProject controller
  ////////////////////////
  ////////////////////////

  }
