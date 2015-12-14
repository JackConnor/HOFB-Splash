var app = angular.module('createProjectController', ['postProjectFactory'])

  .controller('createProjectCtrl', createProjectCtrl)

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
        self.miniPhotoCounter = self.tempPhotoCache.length;
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
      highlightMini();
    }
    //////function to delete the photo inside of a mini photo on click
    function deleteMiniPhoto(evt){
      var targetImage = $(evt.currentTarget.previousElementSibling);
      var placeInLine = targetImage[0].id.split('').pop();
      self.tempPhotoCache.splice(placeInLine, 1);///our master photo array should be adjusted
      $('.newProductCurrentImage').attr('src', URL.createObjectURL(self.tempPhotoCache[0]));
      self.miniPhotoCounter = self.tempPhotoCache.length//sets this to the slot one after our last active upload;
      highlightMini();
      ///////now we need to reorder all of the remaining mini photos so that there are no spaces
      var allMiniPhotosLength = $('.newProductMiniImage').length;//array of all photos as elements
      for(var i = 0; i < allMiniPhotosLength; i++) {
        $('#newProductMiniImage'+i).attr('src', '');
        if(i < self.tempPhotoCache.length){
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
    }
    $('.newProductDeleteMini').on('click', deleteMiniPhoto);///Make all the small photo x buttons work

    function changeMiniPhoto(event){
      var source = $(event.target)[0].src;
      $(".newProductCurrentImage").attr('src', source);
      var photoNumber = $(event.target)[0].id.split('').pop();
      self.miniPhotoCounter = photoNumber;
      highlightMini();
    }
    $('.newProductMiniImageImage').on('click', changeMiniPhoto)

    ///create function to highlight mini image that's about to be updated
    function highlightMini(){
      var arrLength = $('.newProductMiniImage').length;
      $('#newProductMiniImage0').css({
        borderBottom: "1px solid white"
      })
      $('#newProductMiniImage1').css({
        borderBottom: "1px solid white"
      })
      $('#newProductMiniImage2').css({
        borderBottom: "1px solid white"
      })
      $('#newProductMiniImage3').css({
        borderBottom: "1px solid white"
      })
      $('#newProductMiniImage'+self.miniPhotoCounter).css({
        borderBottom: "5px solid blue"
      })
    }
    highlightMini();
    ////////End Logic for uploading photos/////
    ///////////////////////////////////////////

    ///////////////function to send full create http request
    function sendNewProject(evt){
      var name = "jack";
      var timestamp =  new Date();
      var images = self.tempPhotoCache;
      var groups = $('.newProductCollectionsInput').val().split(' ');
      var productType = $('.newProductTypeDropdown').val();
      var tags = $('.newProductTagsInput').val().split(' ');
      var vendor = $('.newProductTypeDropdown').val();
      var colorsFunc = function(){
        var allPicked = $(".picked");
        var colorsArray = [];
        for (var i = 0; i < allPicked.length; i++) {
          if(allPicked[i].id.split('_')[1] == 'Color')
          colorsArray.push(allPicked[i].id.split('_')[2])
        }
        return colorsArray;
      }
      var colors = colorsFunc();
      var fabricsFunc = function(){
        var allPicked = $(".picked");
        var fabricsArray = [];
        for (var i = 0; i < allPicked.length; i++) {
          if(allPicked[i].id.split('_')[1] == 'Fabric')
          fabricsArray.push(allPicked[i].id.split('_')[2])
        }
        return fabricsArray;
      }
      var fabrics = fabricsFunc();
      var seasonsFunc = function(){
        var allPicked = $(".picked");
        var seasonsArray = [];
        for (var i = 0; i < allPicked.length; i++) {
          if(allPicked[i].id.split('_')[1] == 'Season')
          seasonsArray.push(allPicked[i].id.split('_')[2])
        }
        return seasonsArray;
      }
      var seasons = seasonsFunc();
      var stitchesFunc = function(){
        var allPicked = $(".picked");
        var stitchesArray = [];
        for (var i = 0; i < allPicked.length; i++) {
          if(allPicked[i].id.split('_')[1] == 'Stitch')
          stitchesArray.push(allPicked[i].id.split('_')[2])
        }
        return stitchesArray;
      }
      var stitches = stitchesFunc();
      var buttonsFunc = function(){
        var allPicked = $(".picked");
        var stitchesArray = [];
        for (var i = 0; i < allPicked.length; i++) {
          if(allPicked[i].id.split('_')[1] == 'Button')
          stitchesArray.push(allPicked[i].id.split('_')[2])
        }
        return stitchesArray;
      }
      var buttons = buttonsFunc();
      var statusVar = $(evt.target)[0].className.split('_')[2];
      if(statusVar == 'send'){
        var status = 'submitted to curator'
      } else if(statusVar == 'save'){
        var status = 'saved'
      }
      /////putting together whole object to send
      var newProjectObject = {
        name: name
        ,timestamp: timestamp
        ,images: images
        ,groups: groups
        ,productType: productType
        ,tags: tags
        ,vendor: vendor
        ,colors: colors
        ,fabrics: fabrics
        ,seasons: seasons
        ,stitchPatterns: stitches
        ,buttons: buttons
        ,status: status
      }
      postProject.postProject(newProjectObject)///post the object
      //////////logic to send stuff through to cloudinary
      var newForm = new FormData();
      console.log(newForm);
      newForm.append('file', self.tempPhotoCache[0])
      ////action="/pictures/upload" method="POST" enctype="multipart/form-data"
      newForm.action = '/api/pictures';
      console.log(newForm);
      newForm.method = "POST";
      newForm.enctype="multipart/form-data";
      console.log($(newForm));
      // $(newForm).submit();
      // newForm.submit();
      // $http({
      //   method: "POST"
      //   ,data: newForm
      // })
      // .then(function(data){
      //   console.log(data);
      // })
    }
    $('.new_product_send').on('click', sendNewProject);
    $('.new_product_save').on('click', sendNewProject);

    // setInterval(function(){
    //   console.log($('#i_file'));
    // }, 1000)

    function newForm(){
      // var request = new XMLHttpRequest();
      // request.open("POST", "/api/pictures");
      // request.send(formNew);
      $('.appendDiv').append(
        "<form class='tempForm' action='/api/pictures' method='POST' enctype='multipart/form-data'>"+
        "</form>"
      )
      $('.tempForm').append($('#i_file0')[0]);
      $('.tempForm').append($('#i_file1')[0]);
      $('.tempForm').append($('#i_file2')[0]);
      $('.tempForm').append($('#i_file3')[0]);
      $('.tempForm').append($('#i_name')[0]);
      $('.tempForm').submit();
      // $(formNew).submit();
    }
    $("#i_submit").on('click', newForm)
  /////end createProject controller
  ////////////////////////
  ////////////////////////

  }
