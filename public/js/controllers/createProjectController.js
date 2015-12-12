var app = angular.module('createProjectController', ['postProjectFactory'])

  .controller('createProjectCtrl', createProjectCtrl)

  createProjectCtrl.$inject = ['$http', 'postProject']
  function createProjectCtrl($http, postProject){
    var self = this;
    //////global variables we'll be using for moving the carousel
    var carouselMargin = 0; ///keeps track of carousel's margin
    var carouselCounter = 0;///keeps track of carousel's postion in the queue
    self.createNewProject = {
      name: ""
      ,timestamp: ""
      ,images: []
      ,groups: []
      ,productType: ""
      ,tags: []
      ,vendor: ""
      ,colors: []
      ,fabrics: []
      ,buttons: ""
      ,stitchPattern: ""
      ,season: ""
    }
    console.log(self.createNewProject);
    /////end global variables

    // console.log(postProject);
    // console.log(postProject.postProject({name: "The Wonder Mop"}));<---logic for post project factory call

    ////////////////////////////////////////
    /////////Effects for carousel//////////
    ////click effect for seasonsplash
    function swatchLogic(swatchType){
      ///////note: swatchType needs to be added as a capital, i.e. "Season"
      $('.create'+swatchType).on('click', function(evt){
        if($(evt.target).css('opacity') == 1 ){
          $(evt.target).css({
            opacity: 0.5
            ,backgroundColor: "blue"
          })
          $(evt.target).attr('id', 'picked_'+swatchType+"_"+evt.target.innerText.split(' ').join(''));
          $(evt.target).addClass('picked');
        } else {
          $(evt.target).css({
            opacity: 1
            ,backgroundColor: "black"
          })
        }
      })
    }
    swatchLogic("Season");
    swatchLogic("Fabric");
    swatchLogic("Color");
    swatchLogic("Button");
    swatchLogic("Stitch");

    ///////////////////////////////////////////////////
    ///////////////build function to collect and submit
    $('.createSubmit').on('click', function(){
      console.log('lol');
      self.createNewProject = {
        name: $('.carouselNameEntry').val()
        ,timestamp: ""
        ,images: []
        ,groups: []
        ,productType: ""
        ,tags: []
        ,vendor: ""
        ,colors: []
        ,fabrics: []
        ,buttons: ""
        ,stitchPattern: ""
        ,season: ""
      }
      var pickedElems = $('.picked');
      console.log(pickedElems);
      for (var i = 0; i < pickedElems.length; i++) {
        if(pickedElems[i].id.split('_')[1] == "Season"){
          self.createNewProject.season = pickedElems[i].id.split('_')[2];
          console.log(self.createNewProject.season);
        }
        else if(pickedElems[i].id.split('_')[1] == "Color"){
          self.createNewProject.colors.push(pickedElems[i].id.split('_')[2])
          console.log(self.createNewProject.colors);
        }
        else if(pickedElems[i].id.split('_')[1] == "Fabric"){
          self.createNewProject.fabrics.push(pickedElems[i].id.split('_')[2])
          console.log(self.createNewProject.fabricss);
        }
        else if(pickedElems[i].id.split('_')[1] == "Buttons"){
          self.createNewProject.buttons = pickedElems[i].id.split('_')[2];
          console.log(self.createNewProject.color);
        }
        else if(pickedElems[i].id.split('_')[1] == "Stitch"){
          self.createNewProject.stitchPattern = pickedElems[i].id.split('_')[2];
          console.log(self.createNewProject.stitchPattern);
        }
      }
      $http({
        method: "POST"
        ,url: "/api/projects"
        ,data: self.createNewProject
      })
      .then(function(newProjectStuff){
        console.log(newProjectStuff);
      })
    })

    /////////Effects for carousel//////////
    ////////////////////////////////////////


    ///////////////////////////////////////////
    //////////begin logic for moving carousel//
    ///function controlling carousel movement forward
    function moveNext(){
      var singleCellDistance = $('.carouselBacking').width()* (0.12) + 4;
      var moveDistance = carouselMargin - singleCellDistance;
      carouselMargin = moveDistance;
      carouselCounter ++;
      // getName();
      $('.carouselBacking').animate({
        marginLeft: moveDistance
      })
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
          backgroundColor: 'white',
          color: 'black'
        })
        for (var i = 1; i < 8; i++) {
          $('.circle'+i).css({
            backgroundColor: "black",
            color: 'white'
          })
        }
      } else if(carouselCounter == 1){
        $('.circle1').css({
          backgroundColor: 'white',
          color: 'black'
        })
        $('.circle0').css({
          backgroundColor: "black",
          color: 'white'
        })
        for (var i = 2; i < 8; i++) {
          $('.circle'+i).css({
            backgroundColor: "black",
            color: 'white'
          })
        }
      } else if(carouselCounter == 2){
        $('.circle2').css({
          backgroundColor: 'white',
          color: 'black'
        })
        for (var i = 3; i < 8; i++) {
          $('.circle'+i).css({
            backgroundColor: "black",
            color: 'white'
          })
        }
        for (var i = 0; i < 2; i++) {
          $('.circle'+i).css({
            backgroundColor: "black",
            color: 'white'
          })
        }
      } else if(carouselCounter == 3){
        $('.circle3').css({
          backgroundColor: 'white',
          color: 'black'
        })
        for (var i = 4; i < 8; i++) {
          $('.circle'+i).css({
            backgroundColor: "black",
            color: 'white'
          })
        }
        for (var i = 0; i < 3; i++) {
          $('.circle'+i).css({
            backgroundColor: "black",
            color: 'white'
          })
        }
      } else if(carouselCounter == 4){
        $('.circle4').css({
          backgroundColor: 'white',
          color: 'black'
        })
        for (var i = 0; i < 4; i++) {
          $('.circle'+i).css({
            backgroundColor: "black",
            color: 'white'
          })
        }
        for (var i = 5; i < 8; i++) {
          $('.circle'+i).css({
            backgroundColor: "black",
            color: 'white'
          })
        }
      } else if(carouselCounter == 5){
        $('.circle5').css({
          backgroundColor: 'white',
          color: 'black'
        })
        for (var i = 0; i < 5; i++) {
          $('.circle'+i).css({
            backgroundColor: "black",
            color: 'white'
          })
        }
        for (var i = 6; i < 8; i++) {
          $('.circle'+i).css({
            backgroundColor: "black",
            color: 'white'
          })
        }
      } else if(carouselCounter == 6){
        $('.circle6').css({
          backgroundColor: 'white',
          color: 'black'
        })
        for (var i = 0; i < 6; i++) {
          $('.circle'+i).css({
            backgroundColor: "black",
            color: 'white'
          })
        }
        for (var i = 7; i < 8; i++) {
          $('.circle'+i).css({
            backgroundColor: "black",
            color: 'white'
          })
        }
      } else if(carouselCounter == 7){
        for (var i = 0; i < 7; i++) {
          $('.circle'+i).css({
            backgroundColor: "black",
            color: 'white'
          })
        }
        $('.circle7').css({
          backgroundColor: 'white',
          color: 'black'
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
        var circlePositionBeta = $(evt.target)[0];
        var circlePosition = $(circlePositionBeta)[0].id.split('')[7];
        clickDistance(circlePosition);
        highlightCounter();
      })
      $('.circle1').on('click', function(evt){
        var circlePositionBeta = $(evt.target)[0];
        var circlePosition = $(circlePositionBeta)[0].id.split('')[7];
        clickDistance(circlePosition);
        highlightCounter();
      })
      $('.circle2').on('click', function(evt){
        var circlePositionBeta = $(evt.target)[0];
        var circlePosition = $(circlePositionBeta)[0].id.split('')[7];
        clickDistance(circlePosition);
        highlightCounter();
      })
      $('.circle3').on('click', function(evt){
        var circlePositionBeta = $(evt.target)[0];
        var circlePosition = $(circlePositionBeta)[0].id.split('')[7];
        clickDistance(circlePosition);
        highlightCounter();
      })
      $('.circle4').on('click', function(evt){
        console.log('this working?');
        var circlePositionBeta = $(evt.target)[0];
        console.log(circlePositionBeta);
        var circlePosition = $(circlePositionBeta)[0].id.split('')[6];
        console.log(circlePosition);
        clickDistance(circlePosition);
        highlightCounter();
      })
      $('.circle5').on('click', function(evt){
        var circlePositionBeta = $(evt.target)[0];
        var circlePosition = $(circlePositionBeta)[0].id.split('')[7];
        clickDistance(circlePosition);
        highlightCounter();
      })
      $('.circle6').on('click', function(evt){
        var circlePositionBeta = $(evt.target)[0];
        var circlePosition = $(circlePositionBeta)[0].id.split('')[7];
        clickDistance(circlePosition);
        highlightCounter();
      })
      $('.circle7').on('click', function(evt){
        var circlePositionBeta = $(evt.target)[0];
        var circlePosition = $(circlePositionBeta)[0].id.split('')[7];
        clickDistance(circlePosition);
        highlightCounter();
      })
    }
    circleClick();

    ////function for calculating distance
    function clickDistance(circlePosition){
      var spaces = circlePosition - carouselCounter;
      var singleCellDistance = $('.carouselBacking').width()* (0.12) + 4;
      var moveDistance = carouselMargin + (singleCellDistance*spaces*-1);
      carouselMargin = moveDistance;
      carouselCounter = circlePosition;
      // getName();
      $('.carouselBacking').css({
        marginLeft: moveDistance
      })
      // $('.carouselBacking').css({
      //   marginLeft: carouselMargin
    }

    //////end logic for click to switch page//
    ////////////////////////////////////////////

    // function getName(){
    //   var name = $('.carouselNameEntry').val();
    //   if(name.split('').length > 0){
    //     console.log('there something there');
    //     $('.productTitle').text(name);
    //   }
    // }
    // getName();

  /////end createProject controller
  ////////////////////////
  ////////////////////////

  }
