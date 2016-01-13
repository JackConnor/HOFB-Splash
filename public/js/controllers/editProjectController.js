var app = angular.module('editProjectController', ['postProjectFactory', 'getProductFactory', 'editProjectFactory', 'checkPwFactory', 'getSwatchesFactory'])

  .controller('editProjectCtrl', editProjectCtrl)

  editProjectCtrl.$inject = ['$http', 'allSwatches', 'postProject', 'checkPw', 'getProduct', 'editProject'];
  function editProjectCtrl($http, allSwatches, postProject, checkPw, getProduct, editProject){
    console.log(allSwatches);
    var self = this;
    //////global variables we'll be using for moving the carousel
    var carouselMargin = 0; ///keeps track of carousel's margin
    var carouselCounter = 0;///keeps track of carousel's postion in the queue
    self.miniPhotoCounter;
    self.tempPhotoCache = [];
    self.tempPhotoHTMLCache = [];
    /////end global variables
    // window.localStorage.checkPw = false;
    // checkPw.checkPassword();
    var productId = window.location.hash.split('/')[3];
    $http({
      method: "GET"
      ,url: "/api/product/"+productId
    })
    .then(function(product){
      self.currentProduct = product.data;
      console.log(self.currentProduct);
      loadData(self.currentProduct);
    })

    self.allSwatches = allSwatches;
    console.log(self.allSwatches);
    /////end global variables

    ////////set our global variables for our our html to create the swatches from
/// correct code
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
    }
    setSwatches();

    ////////////////////////////////////////
    /////////Effects for carousel//////////
    ////click effect for seasonsplash
    function swatchLogic(swatchType){
      console.log('aww ya');
      ///////note: swatchType needs to be added as a capital, i.e. "Season"
      $('.create'+swatchType).on('click', function(evt){
        var type = $(evt.target)[0].classList[1].slice(6, 1000);
        console.log(type);

        if($(evt.target).css('opacity') == 1 ){
          $(evt.target).css({
            opacity: 0.5
            ,outline: "4px solid #3CB878"
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
    // swatchLogic("Season");
    swatchLogic("Fabric");
    swatchLogic("Color");
    // swatchLogic("Button");
    // swatchLogic("Stitch");

    ///////////////////////////////////////////////////


    function loadData(productObject){
      //////load text inputs
      $('.newProductTitle').val(productObject.name)
      $('.newProductDescription').val(productObject.description);
      $('.newProductTagsInput').val(productObject.tags.join(', '))
      $('.newProductCollectionsInput').val(productObject.collections.join(', '))
      $('.newProductType').val(productObject.productType);
      $('.newProductVendor').val(productObject.vendor);
      /////add photos
      var addImgsFunc = function(){
        $('.newProductCurrentImage').attr('src', productObject.images[0])
        for (var i = 0; i < productObject.images.length; i++) {
          $('#newProductMiniImage'+i).attr('src' , productObject.images[i]);
          ////////load photo and html caches
          self.tempPhotoCache.push(productObject.images[i]);
          self.tempPhotoHTMLCache.push($('#newProductMiniImage'+i));
        }
      }
      addImgsFunc();
      //////functions for addding swatches to the html once its' loaded
      function addFabrics(){
        var fabricsHtmlArray = $('.createFabric');
        var currentValues = productObject.fabrics;
        for (var i = 0; i < fabricsHtmlArray.length; i++) {
          var elType = fabricsHtmlArray[i].classList[1].slice(6, 20);
          for (var j = 0; j < currentValues.length; j++) {
            if( elType == currentValues[j]){
              $(fabricsHtmlArray[i]).addClass('picked');
              $(fabricsHtmlArray[i]).attr('id', "picked_Fabric_"+currentValues[j]);
              $(fabricsHtmlArray[i]).css({
                opacity: .5
                ,outline: "4px solid #3CB878"
              })
            }
          }
        }
      }
      addFabrics();
      function addColors(){
        var colorsHtmlArray = $('.createColor');
        var currentValues = productObject.colors;
        for (var i = 0; i < colorsHtmlArray.length; i++) {
          var elType = colorsHtmlArray[i].classList[1].slice(6, 20);
          for (var j = 0; j < currentValues.length; j++) {
            if( elType == currentValues[j]){
              $(colorsHtmlArray[i]).addClass('picked');
              $(colorsHtmlArray[i]).attr('id', "picked_Color_"+currentValues[j]);
              $(colorsHtmlArray[i]).css({
                opacity: .5
                ,outline: "4px solid #3CB878"
              })
            }
          }
        }
      }
      addColors();
      // function addAccessories(){
      //   var buttonHtmlArray = $('.createButton');
      //   var currentValues = productObject.buttons;
      //   for (var i = 0; i < buttonHtmlArray.length; i++) {
      //     var elType = buttonHtmlArray[i].classList[1].slice(6, 20);
      //     for (var j = 0; j < currentValues.length; j++) {
      //       if( elType == currentValues[j]){
      //         $(buttonHtmlArray[i]).addClass('picked');
      //         $(buttonHtmlArray[i]).attr('id', "picked_Button_"+currentValues[j]);
      //         $(buttonHtmlArray[i]).css({
      //           backgroundColor: "blue"
      //         })
      //       }
      //     }
      //   }
      // }
      // addAccessories();
      swatchLogic("Fabric");
      swatchLogic("Color");
    }
  ////////////////////////////
  ////////////////////////////
  //////end edit controller///
  //////////begin code to controler all upload functions (mirrored from create page)

  ////////////////////////////////////////
  /////////Effects for carousel//////////
  ////click effect for seasonsplash
  function swatchLogic(swatchType){
    ///////note: swatchType needs to be added as a capital, i.e. "Season"
    $('.create'+swatchType).on('click', function(evt){
      console.log($(evt.target)[0].classList[1].slice(6, 100));
      if($(evt.target).css('opacity') == 1 ){
        $(evt.target).css({
          opacity: 0.5
          ,outline: "4px solid #3CB878"
        })
        $(evt.target).attr('id', 'picked_'+swatchType+"_"+$(evt.target)[0].classList[1].slice(6, 100));
        $(evt.target).addClass('picked');
      } else {
        $(evt.target).css({
          opacity: 1
          ,outline: 'none'
        })
        $(evt.target).removeClass('picked');
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
      if(pickedElems[i].id.split('_')[1] == "Color"){
        self.createNewProject.colors.push(pickedElems[i].id.split('_')[2])
      }
      else if(pickedElems[i].id.split('_')[1] == "Fabric"){
        self.createNewProject.fabrics.push(pickedElems[i].id.split('_')[2])
      }
    }
    $http({
      method: "POST"
      ,url: "/api/products/update"
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
    var sourceArray = [];
    var sourceNum = [];
    for (var i = 0; i < $('.newProductMiniImageImage').length; i++) {
      if(!$($('.newProductMiniImageImage')[i]).attr('src')){
        sourceArray.push($($('.newProductMiniImageImage')[i-1]).attr('src'))
        sourceNum.push(i);
      }
    }
    var source = sourceArray[0];
    self.miniPhotoCounter = sourceNum[0];
    highlightMini();
  }
  //////function to delete the photo inside of a mini photo on click
  function deleteMiniPhoto(evt){
    console.log(self.tempPhotoCache);
    console.log(self.tempPhotoHTMLCache);
    var potSource = $('#newProductMiniImage'+self.miniPhotoCounter).attr('src');
    console.log(potSource);
    if(!potSource){
      self.miniPhotoCounter = self.tempPhotoCache.length-1;
    }
    var targetImage = $('#newProductMiniImage'+self.miniPhotoCounter);
    console.log(targetImage);
    var placeInLine = targetImage[0].id.split('').pop();
    console.log(placeInLine);
    self.tempPhotoCache.splice(placeInLine, 1);///our master photo array should be adjusted
    self.tempPhotoHTMLCache.splice(placeInLine, 1);///our master photo array should be adjusted
    console.log(self.tempPhotoCache);
    console.log(self.tempPhotoHTMLCache);
    $('.newProductCurrentImage').attr('src', self.tempPhotoCache[self.tempPhotoCache.length-1]);
    self.miniPhotoCounter = self.tempPhotoCache.length//sets this to the slot one after our last active upload;
    ///////now we need to reorder all of the remaining mini photos so that there are no spaces
    var allMiniPhotosLength = $('.newProductMiniImage').length;//array of all photos as elements
    for(var i = 0; i < allMiniPhotosLength; i++) {
      $('#newProductMiniImage'+i).attr('src', '');
      console.log(self.tempPhotoCache);
      if(i < self.tempPhotoCache.length){
        var imageShift = $('#newProductMiniImage'+i)[0];
        $(imageShift).attr('src', self.tempPhotoCache[i]);
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
  $('.newProductDeleteMini').on('click', deleteMiniPhoto);///Make all the small photo x buttons work

  function changeMiniPhoto(event){
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
    for (var i = 0; i < 8; i++) {
      $('#newProductMiniImage'+i).css({
        border: "1px solid white"
      })
    }
    $('#newProductMiniImage'+self.miniPhotoCounter).css({
      border: "5px solid #858585"
    })
  }
  var miniPhotoCounterFunc = function(){
    var sourceNum = [];
    for (var i = 0; i < $('.newProductMiniImageImage').length; i++) {
      if(!$($('.newProductMiniImageImage')[i]).attr('src')){
        sourceNum.push(i);
      }
    }
    self.miniPhotoCounter = sourceNum[0];
    highlightMini();
  };
  setTimeout(miniPhotoCounterFunc, 1000);

  ////////End Logic for uploading photos/////
  ///////////////////////////////////////////

  ///////////////function to send full create http request
  function editProject(evt){
    var name = $('.newProductTitle').val();
    var timestamp = new Date();
    // var images = self.tempPhotoCache;
    var imagesHTML = self.tempPhotoHTMLCache;
    var collections = $('.newProductCollectionsInput').val().split(' ');
    var productType = $('.newProductTypeDropdown').val();
    var tags = $('.newProductTagsInput').val().split(' ');
    var vendor = $('.newProductVendor').val();
    var description = $('.newProductDescription').val();
    var colorsFunc = function(){
      var allPicked = $(".picked");
      var colorsArray = [];
      for (var i = 0; i < allPicked.length; i++) {
        console.log('we got one');
        console.log(allPicked[i].id);
        if(allPicked[i].id.split('_')[1] == 'Color')
        colorsArray.push(allPicked[i].id.split('_')[2])
      }
      return colorsArray;
    }
    var colors = colorsFunc();
    console.log(colors);
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
      projectId: window.location.hash.split('/')[3]
      ,name: name
      ,timestamp: timestamp
      ,description: description
      ,productType: productType
      ,tags: tags
      ,collections: collections
      ,vendor: vendor
      ,colors: colors
      ,fabrics: fabrics
      ,seasons: seasons
      ,images: self.tempPhotoCache
      ,stitchPatterns: stitches
      ,buttons: buttons
      ,status: status
    }
    console.log(newProjectObject);
    editProjectToDb(newProjectObject, function(){
      window.location.hash = "#/designer/dashboard";
    })
  }
  $('.new_product_send').on('click', editProject);
  $('.new_product_save').on('click', editProject);

  /////function to update a project (will go in a factory)
  function editProjectToDb(projectArray, callback){
    return $http({
      method: "POST"
      ,url: "/api/product/update"
      ,data: projectArray
    })
    .then(function(newProjectInfo){
      callback(newProjectInfo.data._id);
      // return newProjectInfo;
    })
  }
  function submitPhotos(productIdToUpdate){
    console.log('aint even worrying about it, since we already have the phtoo urls. Look in the edit project function.');

    // $(".bodyview").append(
    //   "<form class='tempForm' action='/api/pictures' method='POST' enctype='multipart/form-data'>"+
    //   "</form>"
    // )
    // //
    // if(self.tempPhotoHTMLCache[0]){
    //   $('.tempForm').append(self.tempPhotoHTMLCache[0]);
    // }
    // if(self.tempPhotoHTMLCache[1]){
    //   $('.tempForm').append(self.tempPhotoHTMLCache[1]);
    // }
    // if(self.tempPhotoHTMLCache[2]){
    //   $('.tempForm').append(self.tempPhotoHTMLCache[2]);
    // }
    // if(self.tempPhotoHTMLCache[3]){
    //   $('.tempForm').append(self.tempPhotoHTMLCache[3]);
    // }
    // $('.tempForm').append(
    //   "<input name='productId' type='text' value='"+productIdToUpdate+"'>"
    // );
    // $('.tempForm').submit();
  }

  ///logout button functionality
  $('.logoutButton').on('click', function(){
    window.localStorage.hofbToken = "";
    window.location.hash = "#/signin"
  })


    ///////////////////////////////////////////////
    //////Begin logic for photo popup modal////////
    $('.newProductCurrentImage').on('click', function(){
      $('.bodyview').prepend(
        '<div class="invisModal">'+
          "<div class='modalPhotoHolder'>"+
            "<img class='modalImage' src='"+$('.newProductCurrentImage').attr('src')+"'>"+
          '</div>'+
        '</div>'
      )
      $('.invisModal').on('click', function(evt){
        if($(evt.target)[0].classList[0] == "invisModal"){
          $('.invisModal').remove();
        }
      })/////function to view a full page modal on click
    });
    //////End logic for photo popup modal//////////
    ///////////////////////////////////////////////

    /////start of navbar dropdown logic/////////////
    ////////////////////////////////////////////////
    $(".dropbtn").on('click', function(){
      console.log('dropbtn is working');
            myFunction();
            // location.reload();
      });

    /* When the user clicks on the button,
    toggle between hiding and showing the dropdown content */
    function myFunction() {
        document.getElementById("myDropdown").classList.toggle("show");
    }

    // Close the dropdown if the user clicks outside of it
    window.onclick = function(event) {
      if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    }
    /////end of navbar dropdown logic/////////////
    ////////////////////////////////////////////////

    ///////////////////////////////////////////////
    //////Begin logic for photo popup modal////////
    $('.expandPhoto').on('click', function(){
      $('.bodyview').prepend(
        '<div class="invisModal">'+
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
    //////navbar click events
    $('.navTitle').on('click', function(){
      window.location.hash = "#/designer/dashboard";
    });
    $('#navBarEnvelopeIcon').on('click', function(){
      window.location.hash = "#/messages";
    })
  ////////////////////////////////
  ///////////////////////////////
  ///////End all controller Code///
  }
