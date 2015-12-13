var app = angular.module('createProjectController', ['postProjectFactory'])

  .controller('createProjectCtrl', createProjectCtrl)

  ///////////////////////////////////////////////////////
  ///////about to do experimental service/directive stuff



  ///////about to do experimental service/directive stuff
  ///////////////////////////////////////////////////////

  createProjectCtrl.$inject = ['$http', 'postProject']
  function createProjectCtrl($http, postProject){
    var self = this;
    //////global variables we'll be using for moving the carousel
    var carouselMargin = 0; ///keeps track of carousel's margin
    var carouselCounter = 0;///keeps track of carousel's postion in the queue
    self.miniPhotoCounter = 0;
    self.tempPhotoCache = [];
    /////end global variables

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
      for (var i = 0; i < pickedElems.length; i++) {
        if(pickedElems[i].id.split('_')[1] == "Season"){
          self.createNewProject.season = pickedElems[i].id.split('_')[2];
        }
        else if(pickedElems[i].id.split('_')[1] == "Color"){
          self.createNewProject.colors.push(pickedElems[i].id.split('_')[2])
        }
        else if(pickedElems[i].id.split('_')[1] == "Fabric"){
          self.createNewProject.fabrics.push(pickedElems[i].id.split('_')[2])
        }
        else if(pickedElems[i].id.split('_')[1] == "Buttons"){
          self.createNewProject.buttons = pickedElems[i].id.split('_')[2];
        }
        else if(pickedElems[i].id.split('_')[1] == "Stitch"){
          self.createNewProject.stitchPattern = pickedElems[i].id.split('_')[2];
        }
      }
      $http({
        method: "POST"
        ,url: "/api/projects"
        ,data: self.createNewProject
      })
      .then(function(newProjectStuff){
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
        var circlePositionBeta = $(evt.target)[0];
        var circlePosition = $(circlePositionBeta)[0].id.split('')[6];
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
      $('.carouselBacking').css({
        marginLeft: moveDistance
      })
    }

    //////end logic for click to switch page//
    ////////////////////////////////////////////

    ///////////////////////////////////////////
    ////////Begin Logic for uploading photos///
    /////listens for change to file upload, creating an event every time there is a change
    $('#i_file').change( function(event) {
      if(self.miniPhotoCounter >= 0 && self.miniPhotoCounter < 4){
        frontendPhotoDisplay();
      }
      else{
        alert('better delete some photos if you want to add more')
      }
    });

    function frontendPhotoDisplay(){
      var tmppath = URL.createObjectURL(event.target.files[0]);//new temp url
      $(".newProductCurrentImage").attr('src',tmppath);////turn big image to what was just picked
      self.tempPhotoCache[self.miniPhotoCounter] = event.target.files[0]////add photo to the cache so we can send later
      $('#newProductMiniImage'+self.miniPhotoCounter).attr('src', tmppath)
      $('#newProductMiniImage'+self.miniPhotoCounter).css({
        outline: "3px solid orange"
      })
      self.miniPhotoCounter++;
    }
    //////function to delete the photo inside of a mini photo on click
    function deleteMiniPhoto(evt){
      console.log(evt);
      console.log(evt.target);
      console.log(evt.currentTarget.previousElementSibling);
      //
      var targetImage = $(evt.currentTarget.previousElementSibling);
      var placeInLine = targetImage[0].id.split('').pop();
      console.log(placeInLine);
      console.log(self.tempPhotoCache);
      self.tempPhotoCache.splice(placeInLine, 1);///our master photo array should be adjusted
      console.log(self.tempPhotoCache);
      ///////now we need to reorder all of the remaining mini photos so that there are no spaces
      var allMiniPhotosLength = $('.newProductMiniImage').length;//array of all photos as elements
      console.log(allMiniPhotosLength);
      // var allMiniPhoto = function(){
      //   var photoArray = [];
      //   for (var i = 0; i < allMiniPhotosLength; i++) {
      //     photoArray.push($('#newProductMiniImage'+i)[0])
      //   }
      //   return photoArray;
      // }
      // console.log(allMiniPhoto());
      console.log(self.tempPhotoCache.length);
      for(var i = 0; i < allMiniPhotosLength; i++) {
        $('#newProductMiniImage'+i).attr('src', '');
        console.log(i);
        if(i < self.tempPhotoCache.length){
          console.log('abot to change');
          console.log($('#newProductMiniImage'+i));
          console.log($('#newProductMiniImage'+i)[0]);
          var imageShift = $('#newProductMiniImage'+i)[0];
          $(imageShift).attr('src', URL.createObjectURL(self.tempPhotoCache[i]))
          // $('#newProductMiniImage'+i).src( URL.createObjectURL(self.tempPhotoCache[i]))
        }
        else if(i >= self.tempPhotoCache.length){
          var imageShift = $('#newProductMiniImage'+i)[0];
          $(imageShift).attr('src', '');
          $(imageShift).css({
            outline: '1px dashed gray'
          })
        }
      }
      //  $(evt.currentTarget.previousElementSibling).attr('src', '')
    }
    $('.newProductDeleteMini').on('click', deleteMiniPhoto)



    ////////Begin Logic for uploading photos///
    ///////////////////////////////////////////


  /////end createProject controller
  ////////////////////////
  ////////////////////////

  }
