var app = angular.module('createProjectController', ['postProjectFactory', 'checkPwFactory', 'getSwatchesFactory', 'singleuserfactory'])

  .controller('createProjectCtrl', createProjectCtrl)

  createProjectCtrl.$inject = ['$http', 'postProject', 'checkPw', 'allSwatches', 'singleUser']
  function createProjectCtrl($http, postProject, checkPw, allSwatches, singleUser){
    var self = this;
    //////global variables we'll be using for moving the carousel
    ///////get the users token
    // window.localStorage.checkPw = false;
    // checkPw.checkPassword();
    $http({
      method: "GET"
      ,url: '/api/checkstatus/'+ window.localStorage.hofbToken
    })
    .then(function(decodedToken){
      console.log(decodedToken);
      self.decodedToken = decodedToken;
      self.userId = decodedToken.data.name;
      singleUser(self.userId)
      .then(function(user){
        console.log(user);
        self.currentUser = user.data;
      })

    })
    var carouselMargin = 0; ///keeps track of carousel's margin
    var carouselCounter = 0;///keeps track of carousel's postion in the queue
    self.miniPhotoCounter = 0;
    self.tempPhotoCache = [];
    self.tempPhotoHTMLCache = [];
    self.allSwatches = allSwatches;
    /////end global variables

    ////////set our global variables for our our html to create the swatches from
    function setSwatches(){
      var fabricsfunc = function(){
        var allFabrics = [];
        for(fabric in allSwatches.fabrics){
          allFabrics.push(fabric);
          $('.createFabricContainer').append(
            '<div class="createFabricCellHolder col-xs-4">'+
              '<img src='+allSwatches.fabrics[fabric]+' class="createFabric create'+fabric+'">'+
            "</div>"
          )
        }
        console.log(allFabrics);
        return allFabrics;
      }
      fabricsfunc();
      var colorsfunc = function(){
        var allcolors = [];
        for(color in allSwatches.colors){
          allcolors.push(color);
          console.log(color);
          $('.createColorContainer').append(
            '<div class="createColorCellHolder col-xs-6">'+
              '<div class="createColor create'+color+'">'+
                color+
              "</div>"+
            "</div>"
          )
          console.log(allSwatches.colors[color]);
          $('.create'+color).css({
            backgroundColor: allSwatches.colors[color]
            ,outline: "1px solid #E0E0E0"
          })
        }
        console.log(allcolors);
        return allcolors;
      }
      colorsfunc();
      var stitchesfunc = function(){
        var allstitches = [];
        for(stitch in allSwatches.stitch){
          allstitches.push(stitch);
          $('.createStitchContainer').append(
            '<div class="createStitchCellHolder col-xs-12">'+
              '<div class="createStitch create'+stitch+'">'+
                stitch+
              "</div>"+
            "</div>"
          )
        }
        console.log(allstitches);
        return allstitches;
      }
      stitchesfunc();
    }
    setSwatches();


    ////////////////////////////////////////
    /////////Effects for carousel//////////
    ////click effect for seasonsplash
    function swatchLogic(swatchType){
      ///////note: swatchType needs to be added as a capital, i.e. "Season"
      $('.create'+swatchType).on('click', function(evt){
        var type = $(evt.target)[0].classList[1].slice(6, 1000);
        console.log(type);

        if($(evt.target).css('opacity') == 1 ){
          $(evt.target).css({
            opacity: 0.5
            ,outline: "2px solid gray"
          })
          $(evt.target).attr('id', 'picked_'+swatchType+"_"+type)
          $(evt.target).addClass('picked');
        } else {
          $(evt.target).css({
            opacity: 1
            ,outline: "none"
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
        ,url: "/api/products"
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
    function changeEffect(){
      $('#i_file').change( function(event) {
        if(self.miniPhotoCounter >= 0 && self.miniPhotoCounter < 8){
          frontendPhotoDisplay();
          $('#i_file').remove();
          $('.inputFileHolder').prepend(
            '<input type="file" id="i_file" name="files">'
          )
          changeEffect()
          self.miniPhotoCounter = self.tempPhotoCache.length;
        }
        else{
          alert('better delete some photos if you want to add more')
        }
      });
    }
    changeEffect();

    function frontendPhotoDisplay(){
      var tmppath = URL.createObjectURL(event.target.files[0]);//new temp url
      $(".newProductCurrentImage").attr('src',tmppath);////turn big image to what was just picked
      self.tempPhotoCache[self.miniPhotoCounter] = event.target.files[0]////add photo to the cache so we can send later
      self.tempPhotoHTMLCache[self.miniPhotoCounter] = event.target
      $('#newProductMiniImage'+self.miniPhotoCounter).attr('src', tmppath)
      self.miniPhotoCounter++;
      highlightMini();
    }
    //////function to delete the photo inside of a mini photo on click
    function deleteMiniPhoto(evt){
      var potSource = $('#newProductMiniImage'+self.miniPhotoCounter).attr('src');
      console.log(potSource);
      if(!potSource){
        self.miniPhotoCounter = self.tempPhotoCache.length-1;
      }
      var targetImage = $('#newProductMiniImage'+self.miniPhotoCounter)
      var placeInLine = targetImage[0].id.split('').pop();
      self.tempPhotoCache.splice(placeInLine, 1);///our master photo array should be adjusted
      self.tempPhotoHTMLCache.splice(placeInLine, 1);///our master photo array should be adjusted
      $('.newProductCurrentImage').attr('src', URL.createObjectURL(self.tempPhotoCache[self.tempPhotoCache.length-1]));
      self.miniPhotoCounter = self.tempPhotoCache.length//sets this to the slot one after our last active upload;
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
      highlightMini();
    }
    // function setMiniCounterDelete(func){
    //   self.miniPhotoCounter =
    // }
    $('.newProductDeleteMini').on('click', deleteMiniPhoto);///Make all the small photo x buttons work

    function changeMiniPhoto(event){
      console.log($($(event.target)[0]).attr('src'));
      if($($(event.target)[0]).attr('src') != ""){
        var source = $(event.target)[0].src;
        var elId = $(event.target).attr('id');
        self.miniPhotoCounter = elId.split('').pop();
      } else {
        var sourceArray = [];
        var sourceNum = [];
        for (var i = 0; i < $('.newProductMiniImageImage').length; i++) {
          if(!$($('.newProductMiniImageImage')[i]).attr('src')){
            sourceArray.push($($('.newProductMiniImageImage')[i-1]).attr('src'))
            sourceNum.push(i);
            console.log('yuuuup');
          }
        }
        var source = sourceArray[0];
        self.miniPhotoCounter = sourceNum[0];
      }
      $(".newProductCurrentImage").attr('src', source);
      highlightMini();
    }
    $('.newProductMiniImageImage').on('click', changeMiniPhoto)

    ///create function to highlight mini image that's about to be updated
    function highlightMini(){
      var arrLength = $('.newProductMiniImage').length;
      for (var i = 0; i < 8; i++) {
        $('#newProductMiniImage'+i).css({
          border: "1px solid white"
        })
      }
      for (var i = 0; i < 8; i++) {
        if($($('.newProductMiniImageImage')[i]).attr('src') == '' && i != 0){
          $('#newProductMiniImage'+self.miniPhotoCounter).css({
            border: "5px solid #858585"
          })
          return;
        }
        else if($($('.newProductMiniImageImage')[i]).attr('src') == '' && i == 0){
          $('#newProductMiniImage0').css({
            border: "5px solid #858585"
          })
          return;
        }
      }
    }
    highlightMini();
    ////////End Logic for uploading photos/////
    ///////////////////////////////////////////

    ///////////////function to send full create http request
    function sendNewProject(evt){
      var name = $('.newProductTitle').val();
      var timestamp = new Date();
      var imagesHTML = self.tempPhotoHTMLCache;
      var userId = self.userId;
      var collections = $('.newProductCollectionsInput').val().split(' ');
      var productType = window.location.hash.split('/')[4];
      var tags = $('.newProductTagsInput').val().split(' ');
      var vendor = $('.newProductVendor').val();
      var description = $('.newProductDescription').val();
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
        ,userId: userId
        ,timestamp: timestamp
        ,images: []
        ,description: description
        ,productType: productType
        ,tags: tags
        ,collections: collections
        ,vendor: vendor
        ,colors: colors
        ,fabrics: fabrics
        ,seasons: seasons
        ,stitchPatterns: stitches
        ,buttons: buttons
        ,status: status
      }
      console.log(newProjectObject);
      postProject.postProject(newProjectObject)///post the object
      .then(function(newProjectInfo){
        submitPhotos(newProjectInfo.data);
      })
    }
    $('.new_product_send').on('click', sendNewProject);
    $('.new_product_save').on('click', sendNewProject);

    // setInterval(function(){
    //   console.log($('#i_file'));
    // }, 1000)
    function submitPhotos(productToUpdate){
      console.log(self.tempPhotoHTMLCache.length);
      $(".bodyview").append(
        "<form class='tempForm' action='/api/pictures' method='POST' enctype='multipart/form-data'>"+
        "</form>"
      )
      //
      console.log($(self.tempPhotoHTMLCache[0]));
      console.log($(self.tempPhotoHTMLCache[1]));
      console.log($(self.tempPhotoHTMLCache[2]));
      console.log($(self.tempPhotoHTMLCache[3]));
      if(self.tempPhotoHTMLCache[0]){
        $('.tempForm').append(self.tempPhotoHTMLCache[0]);
      }
      if(self.tempPhotoHTMLCache[1]){
        $('.tempForm').append(self.tempPhotoHTMLCache[1]);
      }
      if(self.tempPhotoHTMLCache[2]){
        $('.tempForm').append(self.tempPhotoHTMLCache[2]);
      }
      if(self.tempPhotoHTMLCache[3]){
        $('.tempForm').append(self.tempPhotoHTMLCache[3]);
      }
      if(self.tempPhotoHTMLCache[4]){
        $('.tempForm').append(self.tempPhotoHTMLCache[4]);
      }
      if(self.tempPhotoHTMLCache[5]){
        $('.tempForm').append(self.tempPhotoHTMLCache[5]);
      }
      if(self.tempPhotoHTMLCache[6]){
        $('.tempForm').append(self.tempPhotoHTMLCache[6]);
      }
      if(self.tempPhotoHTMLCache[7]){
        $('.tempForm').append(self.tempPhotoHTMLCache[7]);
      }
      $('.tempForm').append(
        "<input name='productId' type='text' value='"+productToUpdate._id+"'>"
      );
      console.log(self.tempPhotoHTMLCache);
      var newProjectInfo = productToUpdate;
      console.log(newProjectInfo);
      $http({
        method: "POST"
        ,url: "/api/new/conversation"
        ,data: {productName: newProjectInfo.name, productId: newProjectInfo._id, dateCreate: new Date(), comments: [], ownerId: self.userId, ownerName: self.currentUser.name, photoUrl: newProjectInfo.images[0]}
      })
      .then(function(newConvo){
        console.log(newConvo);
        $('.tempForm').submit();
      })
    }

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

    ///////////////////////////////////////////////
    //////Begin logic for photo popup modal////////
    $('.newProductCurrentImage').on('click', function(){
      console.log($('.bodyview'));
      $('.bodyview').prepend(
        '<div class="photoModal">'+
          "<div class='modalFiller'>"+
          "</div>"+
          "<div class='modalPhotoHolder'>"+
            "<img class='modalImage' src='"+$('.newProductCurrentImage').attr('src')+"'>"+
          '</div>'+
          "<div class='modalFiller'>"+
          "</div>"+
        '</div>'
      )
      $('.modalFiller').on('click', function(){
        $('.photoModal').remove();
      })/////function to view a full page modal on click
    });
    //////End logic for photo popup modal//////////
    ///////////////////////////////////////////////

    ///////////////////////////////////////////////
    //////hover states for the save/submit buttons
    $('.new_product_save').on('mouseenter', function(){
      $('.new_product_save').css({
        backgroundColor: '#169AA9'
        ,color: 'white'
      })
    })

    $('.new_product_save').on('mouseleave', function(){
      $('.new_product_save').css({
        backgroundColor: ''
        ,color: '#169AA9'
      })
    })
    $('.new_product_send').on('mouseenter', function(){
      $('.new_product_send').css({
        backgroundColor: '#169AA9'
        ,color: 'white'
      })
    })

    $('.new_product_send').on('mouseleave', function(){
      $('.new_product_send').css({
        backgroundColor: ''
        ,color: '#169AA9'
      })
    })
    ////////end hover states
    ///////////////////////////

    ///////////////////////////////////////////////
    /////////Logic to load intial params name//////
    function loadName(){
      var name = window.location.hash.split('/')[3].split('_').join(' ');
      console.log(name);
      $('.newProductTitle').val(name);
    }
    loadName();

    /////End Logic to load intial params name//////
    ///////////////////////////////////////////////

    ////////////////////////////////////////////////
    //////begin photo cropping stuff////////////////
    //
    // $('.newProductCurrentImage').cropper({
    //   aspectRatio: 1 / 1,
    //   crop: function(e) {
    //     // Output the result data for cropping image.
    //     console.log(e.x);
    //     console.log(e.y);
    //     console.log(e.width);
    //     console.log(e.height);
    //     console.log(e.rotate);
    //     console.log(e.scaleX);
    //     console.log(e.scaleY);
    //   }
    // })

    //////end cropping stuff////////////////////////
    ////////////////////////////////////////////////

  /////end createProject controller
  ////////////////////////
  ////////////////////////

  }
