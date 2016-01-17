var app = angular.module('editProjectController', ['postProjectFactory', 'getProductFactory', 'editProjectFactory', 'checkPwFactory', 'getSwatchesFactory'])

  .controller('editProjectCtrl', editProjectCtrl)

  editProjectCtrl.$inject = ['$http', 'allSwatches', 'postProject', 'checkPw', 'getProduct', 'editProject'];
  function editProjectCtrl($http, allSwatches, postProject, checkPw, getProduct, editProject){
    var self = this;
    //////global variables we'll be using for moving the carousel
    var carouselMargin = 0; ///keeps track of carousel's margin
    var carouselCounter = 0;///keeps track of carousel's postion in the queue
    self.miniPhotoCounter = 0;
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
      loadData(self.currentProduct);
    })

    self.allSwatches = allSwatches;
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
              '<img src='+allSwatches.fabrics[fabric].url+' class="createFabric create'+fabric+'">'+
            "</div>"
          )
        }
        return allFabrics;
      }
      fabricsfunc();
      var colorsfunc = function(){
        var allcolors = [];
        for(color in allSwatches.colors){
          allcolors.push(color);
          $('.createColorContainer').append(
            '<div class="createColorCellHolder col-xs-6">'+
              '<div class="createColor create'+color+'">'+
              "</div>"+
            "</div>"
          )
          $('.create'+color).css({
            backgroundColor: allSwatches.colors[color]
            ,outline: "1px solid #E0E0E0"
          })
        }
        return allcolors;
      }
      colorsfunc();
      var accessoriesfunc = function(){
        var allAccessories = [];
        $('.createAccessoryContainer').append(
          '<div class="createAccessoryLabel drawCords col-xs-12">'+
            "Draw Cords"+
          "</div>"+
          '<div class="createAccessoryLabel metalTrims col-xs-12">'+
            "MetalTrims"+
          "</div>"
        )
        for(drawCord in allSwatches.accessories.drawCords){
          allAccessories.push(drawCord);
          $('.drawCords').after(
            "<img src='"+allSwatches.accessories.drawCords[drawCord]+"' class='createAccessory create"+drawCord+" createAccessoryCellHolder col-xs-4'/>"
          )
        }
        for(metalTrim in allSwatches.accessories.metalTrims){
          allAccessories.push(metalTrim);
          $('.metalTrims').after(
            "<img src='"+allSwatches.accessories.metalTrims[metalTrim]+"' class='createAccessory create"+metalTrim+" createAccessoryCellHolder col-xs-4'/>"
          )
        }
        return allAccessories;
      }
      accessoriesfunc();
    }
    setSwatches();

    ////////////////////////////////////////
    /////////Effects for carousel//////////
    ////click effect for highlighting
    function swatchLogic(swatchType){
      ///////note: swatchType needs to be added as a capital, i.e. "Season"

      ///////fabrics hav a color popup modal, which we take care of here
      if(swatchType == "Fabric"){
        $('.create'+swatchType).on('click', function(evt){
          var target = $(evt.target);
          var fabricType = target[0].classList[1].slice(6, 100);
          var fabricDescription = allSwatches.fabrics[fabricType].description;
          var allColors = allSwatches.fabrics[fabricType].colors;
          console.log(allColors);
          ////////we add the color picking modal
          $('.bodyview').append(
            "<div class='invisModal'>"+
              "<div class='colorModalContainer'>"+
              '<i class="fa fa-times deleteColorModal"></i>'+
                "<div class='colorModalInner'>"+
                  "<div class='colorModalLeftColumn'>" +
                    "<div class='colorModalMainImage'>"+
                    "</div>"+
                    "<div class='colorModalTitle'>"+
                      fabricType.split('_').join(' ').toUpperCase() +
                    "</div>"+
                    "<div class='colorModalDescription'>"+
                      fabricDescription +
                    "</div>"+
                  "</div>"+
                  "<div class='colorModalRightColumn'>" +
                    "<p>Color options for fabric</p>"+
                    "<div class='colorModalColorContainer'>"+
                    "</div>"+
                    "<div class='colorModalSubmit'>"+
                      "SUBMIT"+
                    "</div>"+
                    "<div class='colorModalRemoveColors'>"+
                      "remove colors?"+
                    "</div>"+
                  "</div>"+
                "</div>"+
              "</div>"+
            "</div>"
          )
          ///////removes the modal, wihtout saving any of your selection
          $('.deleteColorModal').on('click', function(){
            $('.invisModal').remove();
          })
          ///////////remove the modal and unselect all colors, and the fabric
          $('.colorModalRemoveColors').on('click', function(){
            target.removeClass('picked');
            target.removeClass('fabricColor');
            var colorListClass = target[0].classList[2];
            target.removeClass('fabricColor');
            target.removeClass(colorListClass);
            target.attr('id', '')
            target.css({
              border: '0px'
            })
            $('.invisModal').remove();
          })
          /////function to add colors to the popup
          for(color in allColors){
            $('.colorModalColorContainer').append(
              "<div class='colorModalColorCell col-xs-6'>"+
                "<div class='colorModalCellInner colorModal"+color+"' id='"+allSwatches.fabrics[fabricType].colors[color]+"'>"+
                "</div>"+
              "</div>"
            )
            $(".colorModal"+color).css({
              backgroundColor: allColors[color]
            })
            /////////function that changes css and adds a "colorPicked" class which we will use later to tally up the total colors
            $('.colorModal'+ color).on('click', function(evt){
              if(!$(evt.target).hasClass('colorPicked')){
                $('.colorModalMainImage').css({
                  backgroundColor: evt.target.id
                })
                $(evt.target).addClass('colorPicked');
                $(evt.target).css({
                  border: "4px solid #289DAE"
                });
              }
              else {
                $('.colorModalMainImage').css({
                  backgroundColor: ''
                })
                $(evt.target).removeClass('colorPicked');
                $(evt.target).css({
                  border: "1px solid #A4D4C7"
                });
              }
            })
          }
          //////////now we split based on if the modal is being picked for the first time, or editing a previously picked choice
          /////if this is a first time color choice for this fabric......
          if(!target.hasClass('picked')){
            $(evt.target).addClass('fabricColor');
            $(evt.target).addClass('fabricColorList');
            ////////function to submit the modal with all your color choices
            $('.colorModalSubmit').on('click', function(){
              for (var i = 0; i < $('.colorModalCellInner').length; i++) {
                if($($('.colorModalCellInner')[i]).hasClass('colorPicked')){
                  var colorName = $($('.colorModalCellInner')[i])[0].classList[1].slice(10, 100);
                  var colorList = $(target[0])[0].classList[3];
                  target.removeClass(colorList);
                  var colorList = colorList + "_" + colorName;
                  target.addClass(colorList);
                  target.css({
                    border: "4px solid #289DAE"
                  })
                }
              }
              target.attr('id', 'picked_'+swatchType+"_"+fabricType)
              target.addClass('picked');
              $('.invisModal').remove();
            })
          }
          else {
            ///////////////first we need to load up the already-picked colors
            var colors = $(target[0])[0].classList[3].split("_").slice(1, 100);
            console.log(colors);
            for (var i = 0; i < $('.colorModalCellInner').length; i++) {
              var swatchColorType = $($('.colorModalCellInner')[i])[0].classList[1].slice(10, 100);
              console.log(swatchColorType);
              for (var k = 0; k < colors.length; k++) {
                if(colors[k] == swatchColorType){
                  $($('.colorModalCellInner')[i]).css({
                    border: "4px solid #289DAE"
                  })
                  $($('.colorModalCellInner')[i]).addClass('colorPicked');
                }
              }
            }
            $('.colorModalSubmit').on('click', function(){
              var newColorList = [];
              for (var i = 0; i < $('.colorModalCellInner').length; i++) {
                if($($('.colorModalCellInner')[i]).hasClass('colorPicked')){
                  var colorName = $($('.colorModalCellInner')[i])[0].classList[1].slice(10, 100);
                  newColorList.push(colorName);
                }
              }
              if(newColorList == 0){
                alert('Please select at least one color to continue');
                return;
              }
              target.removeClass('picked');
              var colorList = $(target[0])[0].classList[3];
              $(target[0]).removeClass(colorList);
              var colorList = "fabricColorList"
              for (var i = 0; i < newColorList.length; i++) {
                colorList = colorList + "_" + newColorList[i]
              }
              target.addClass(colorList);
              target.addClass('picked');
              $('.invisModal').remove();
            })
          }
        })
      }
      else {
        $('.create'+swatchType).on('click', function(evt){
          var type = $(evt.target)[0].classList[1].slice(6, 1000);

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
    }
    // swatchLogic("Season");
    swatchLogic("Fabric");
    swatchLogic("Color");
    swatchLogic("Accessory");
    // swatchLogic("Button");
    // swatchLogic("Stitch");

    ///////////////////////////////////////////////////


    function loadData(productObject){
      console.log(productObject);
      //////load text inputs
      $('.newProductTitle').val(productObject.name)
      $('.newProductDescription').val(productObject.description);
      $('.newProductTagsInput').val(productObject.tags.join(', '))
      $('.newProductCollectionsInput').val(productObject.collections.join(', '))
      $('.newProductType').val(productObject.productType);
      $('.newProductVendor').val(productObject.vendor);
      /////add photos
      var addImgsFunc = function(){
        console.log(productObject);
        $('.newProductCurrentImage').attr('src', productObject.images[0])
        for (var i = 0; i < productObject.images.length; i++) {
          $('#newProductMiniImage'+i).attr('src' , productObject.images[i]);
          ////////load photo and html caches
          self.tempPhotoCache.push(productObject.images[i]);
          self.tempPhotoHTMLCache.push($('#newProductMiniImage'+i));
        }
        console.log(self.miniPhotoCounter);
        frontBackSide(self.miniPhotoCounter);
      }
      addImgsFunc();
      //////functions for addding swatches to the html once its' loaded
      function addFabrics(){
        var fabricsHtmlArray = $('.createFabric');
        var currentValues = productObject.fabrics;
        console.log(currentValues);
        for (var i = 0; i < fabricsHtmlArray.length; i++) {
          var elType = fabricsHtmlArray[i].classList[1].slice(6, 20);
          for (var j = 0; j < currentValues.length; j++) {
            console.log(elType);
            console.log(currentValues[j].name);
            if( elType == currentValues[j].name){
              $(fabricsHtmlArray[i]).addClass('fabricColorList');
              $(fabricsHtmlArray[i]).addClass('fabricColorList_'+currentValues.join("_"));
              $(fabricsHtmlArray[i]).addClass('picked');
              $(fabricsHtmlArray[i]).attr('id', "picked_Fabric_"+currentValues[j]);
              $(fabricsHtmlArray[i]).css({
                border: "4px solid #289DAE"
              })
            }
          }
        }
      }
      addFabrics();
      function addAccessories(){
        var buttonHtmlArray = $('.createButton');
        var currentValues = productObject.buttons;
        for (var i = 0; i < buttonHtmlArray.length; i++) {
          var elType = buttonHtmlArray[i].classList[1].slice(6, 20);
          for (var j = 0; j < currentValues.length; j++) {
            if( elType == currentValues[j]){
              $(buttonHtmlArray[i]).addClass('picked');
              $(buttonHtmlArray[i]).attr('id', "picked_Button_"+currentValues[j]);
              $(buttonHtmlArray[i]).css({
                backgroundColor: "blue"
              })
            }
          }
        }
      }
      addAccessories();
      swatchLogic("Fabric");
      swatchLogic("Accessory");
    }
  ////////////////////////////
  ////////////////////////////
  //////end edit controller///
  //////////begin code to controler all upload functions (mirrored from create page)

  ////////////////////////////////////////
  /////////Effects for carousel//////////

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
          backgroundColor: "#232730",
          color: 'white'
        })
      }
    } else if(carouselCounter == 1){
      $('.circle1').css({
        backgroundColor: 'white',
        color: 'black'
      })
      $('.circle0').css({
        backgroundColor: "#232730",
        color: 'white'
      })
      for (var i = 2; i < 8; i++) {
        $('.circle'+i).css({
          backgroundColor: "#232730",
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
          backgroundColor: "#232730",
          color: 'white'
        })
      }
      for (var i = 0; i < 2; i++) {
        $('.circle'+i).css({
          backgroundColor: "#232730",
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
          backgroundColor: "#232730",
          color: 'white'
        })
      }
      for (var i = 0; i < 3; i++) {
        $('.circle'+i).css({
          backgroundColor: "#232730",
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
          backgroundColor: "#232730",
          color: 'white'
        })
      }
      for (var i = 5; i < 8; i++) {
        $('.circle'+i).css({
          backgroundColor: "#232730",
          color: 'white'
        })
      }
    } else if(carouselCounter == 5){
      $('.circle5').css({
        backgroundColor: 'white',
        color: '#232730'
      })
      for (var i = 0; i < 5; i++) {
        $('.circle'+i).css({
          backgroundColor: "black",
          color: 'white'
        })
      }
      for (var i = 6; i < 8; i++) {
        $('.circle'+i).css({
          backgroundColor: "#232730",
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
          backgroundColor: "#232730",
          color: 'white'
        })
      }
      for (var i = 7; i < 8; i++) {
        $('.circle'+i).css({
          backgroundColor: "#232730",
          color: 'white'
        })
      }
    } else if(carouselCounter == 7){
      for (var i = 0; i < 7; i++) {
        $('.circle'+i).css({
          backgroundColor: "#232730",
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
        frontendPhotoDisplay(event);
        $('#i_file').remove();
        $('.fileUploadWrapper').prepend(
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

  function frontendPhotoDisplay(event){
    var tmppath = URL.createObjectURL(event.target.files[0]);//new temp url
    /////let's check for blob ratio, then just nota ccept and ask for a new on eif it's not a proper ratio
    var blob = new Image();
    blob.src = tmppath;
    blob.onload = function(){
      console.log(this.width);
      console.log(this.height);
      var ratio = (this.width/this.height);
      console.log(ratio);
      if(ratio > .7 && ratio <= .725){
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
        frontBackSide(self.miniPhotoCounter);
        highlightMini();
      }
      else {
          alert('Please Uploadf a photo that is in a 5/7 ratio');
      }
    }
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
    frontBackSide(self.miniPhotoCounter);
    ///////now we need to reorder all of the remaining mini photos so that there are no spaces
    var allMiniPhotosLength = $('.newProductMiniImage').length;//array of all photos as elements
    for(var i = 0; i < allMiniPhotosLength; i++) {
      $('#newProductMiniImage'+i).attr('src', '');
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
    var accessoriesFunc = function(){
      var allPicked = $(".picked");
      var accessoriesArray = [];
      for (var i = 0; i < allPicked.length; i++) {
        console.log(allPicked[i]);
        if(allPicked[i].id.split('_')[1] == 'Accessory')
        accessoriesArray.push(allPicked[i].id.split('_')[2])
      }
      return accessoriesArray;
    }
    var accessories = accessoriesFunc();
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
      ,fabrics: fabrics
      ,images: self.tempPhotoCache
      ,accessories: accessories
      ,status: status
    }
    console.log(newProjectObject);
    editProjectToDb(newProjectObject, function(){
      window.location.hash = "#/designer/dashboard";
    })
  }
  $('.new_product_send').on('click', function(evt){
    console.log(self.tempPhotoHTMLCache);
    if(self.tempPhotoHTMLCache.length < 4){
      alert('Must include at least four photos from four front, back, and both sides to save a project');
      $('.invisModal').remove();
      return;
    }
    else {
      editProject(evt);
    }
  })
  $('.new_product_save').on('click', function(evt){
    if(self.tempPhotoHTMLCache.length < 1){
      alert('Must include at least one photo to save a project');
      $('.invisModal').remove();
      return;
    }
    else {
      editProject(evt);
    }
  });
  ////hover states
  $('.new_product_send').on('mouseenter', function(){
    $('.new_product_send').css({
      backgroundColor: "#169AA9"
      ,color: "white"
    })
  })
  $('.new_product_send').on('mouseleave', function(){
    $('.new_product_send').css({
      backgroundColor: ""
      ,color: "#169AA9"
    })
  })

  $('.new_product_save').on('mouseenter', function(){
    $('.new_product_save').css({
      backgroundColor: "#169AA9"
      ,color: "white"
    })
  })
  $('.new_product_save').on('mouseleave', function(){
    $('.new_product_save').css({
      backgroundColor: ""
      ,color: "#169AA9"
    })
  })

  /////function to update a project (will go in a factory)
  function editProjectToDb(projectArray, callback){
    console.log('over here now');
    return $http({
      method: "POST"
      ,url: "/api/product/update"
      ,data: projectArray
    })
    .then(function(newProjectInfo){
      console.log(newProjectInfo);
      callback(newProjectInfo.data._id);
      // return newProjectInfo;
    })
  }

  // logout button functionality
  $('.logoutButton').on('click', function(){
    window.localStorage.hofbToken = "";
    window.location.hash = "#/designer/loginportal"
  })


    ///////////////////////////////////////////////
    //////Begin logic for photo popup modal////////
    // $('.newProductCurrentImage').on('click', function(){
    //   $('.bodyview').prepend(
    //     '<div class="invisModal">'+
    //       "<div class='modalPhotoHolder'>"+
    //         "<img class='modalImage' src='"+$('.newProductCurrentImage').attr('src')+"'>"+
    //       '</div>'+
    //     '</div>'
    //   )
    //   $('.invisModal').on('click', function(evt){
    //     if($(evt.target)[0].classList[0] == "invisModal"){
    //       $('.invisModal').remove();
    //     }
    //   })/////function to view a full page modal on click
    // });
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


        ///////functions to add outline to edit tools on hover
        $('.newProductDeleteMini').on('mouseenter', function(){
          $('.newProductDeleteMini').css({
            outline: "2px solid gray"
          })
        })
        $('.newProductDeleteMini').on('mouseleave', function(){
          $('.newProductDeleteMini').css({
            outline: "none"
          })
        })
        $('.expandPhoto').on('mouseenter', function(){
          $('.expandPhoto').css({
            outline: "2px solid gray"
          })
        })
        $('.expandPhoto').on('mouseleave', function(){
          $('.expandPhoto').css({
            outline: "none"
          })
        })
        $('.fileUploadWrapper').on('mouseenter', function(){
          $('.fileUploadWrapper').css({
            outline: "2px solid gray"
          })
        })
        $('.fileUploadWrapper').on('mouseleave', function(){
          $('.fileUploadWrapper').css({
            outline: "none"
          })
        })



        //////function to keep scroll-right for mini images in the right placeholder
        self.imageHolderMargin = 0;
        $('.newProductScrollImagesRight').on('click', function(){
          //////check to make sure it's not at either end
          var maxWidth = ($('.newProductMiniImage').width()*8) - $('.newProductImageFrame').width();
          if(self.imageHolderMargin > -(maxWidth+15)){
            self.imageHolderMargin -= 130;
            $('.newProductMiniImagesHolder').animate({
              marginLeft: self.imageHolderMargin+"px"
            }, 100)
          }

        })
        $('.newProductScrollImagesLeft').on('click', function(){
          if(self.imageHolderMargin < 0){
            self.imageHolderMargin += 130;
            $('.newProductMiniImagesHolder').animate({
              marginLeft: self.imageHolderMargin+"px"
            }, 100)
          }
        })

        /////function to make sure the tabs for the scrol on th emini photos stays in place, which is triggered pretty much every time the mini photo thing is moved
        function resizeScrollTabs(){
          $('.newProductScrollImagesLeft').css({
            marginLeft: 0
          })
          $('.newProductScrollImagesRight').css({
            marginLeft: $('.newProductImageFrame').width() - 30
          })
        }

        $(document).ready(function(){
          resizeScrollTabs()
          setTimeout(function(){
            resizeScrollTabs();
          }, 1000);
        })
        $(window).resize(function(){
          resizeScrollTabs();
          setTimeout(function(){
            resizeScrollTabs();
          }, 1000);
        })
        setInterval(function(){
          resizeScrollTabs();
        }, 100);

      ////////function to check the margin everytime the mini photo counter is changed (i.e. a photo is added or deleted), and adjust it accordingly
      function adjustMiniMarginUpload() {
        if(self.miniPhotoCounter > 3){
          var maxWidth = ($('.newProductMiniImage').width()*(self.miniPhotoCounter))- ($('.newProductImageFrame').width()/2);
          $('.newProductMiniImagesHolder').css({
            marginLeft: -maxWidth+"px"
          })
          resizeScrollTabs();
          self.imageHolderMargin = -maxWidth;
        }
      }

      /////////////////////////////////////////////////////////
      //////////functions to add the front-side-back html to the page as a user uploads photos
      function frontBackSide(counter){
        ////make sure there is no previous html from this guide before we precede
        $('.fontChallenge').remove();
        $('.sideBanner').remove();
        /////html we will be adding for each of or four first photos;
        function addHtmlGuide(view, imageCount){
          var htmlToPrepend =
                  '<div class="fontChallenge">'+
                    '<div class="imageBox">'+
                      '<i class="fa fa-file-image-o"></i>'+
                    '</div>'+
                    '<div class="plusBox">'+
                      '<i class="fa fa-plus"></i>'+
                    '</div>'+
                    "<div class='sideText'>Image Upload</div>"+
                  "</div>"+
                  "<div class='sideBanner'>"+
                    "<div class='bannerTop'>"+
                      "Facing "+ view +
                    "</div>"+
                    "<div class='bannerBottom'>"+
                      imageCount+" of 4 Required Images"+
                    "</div>"+
                  '</div>'
          ////now we run the function
          $(".newProductImageHolder").prepend(htmlToPrepend);
          $('#i_file').css({
            height: "120px"
            ,width: '89px'
            ,marginLeft: '-45%'
            ,marginTop: 0
          })
        }

        console.log('in the guide function');
        console.log(counter);
        if(counter == 0){
          $('.newProductCurrentImage').attr('src', '');
          var view = "Forward";
          var imageCount = self.miniPhotoCounter + 1;
          addHtmlGuide(view, imageCount);
        }
        else if(counter == 1){
          $('.newProductCurrentImage').attr('src', '');
          var view = "Left Side";
          var imageCount = self.miniPhotoCounter + 1;
          addHtmlGuide(view, imageCount);
        }
        else if(counter == 2){
          $('.newProductCurrentImage').attr('src', '');
          var view = "Right Side";
          var imageCount = self.miniPhotoCounter + 1;
          addHtmlGuide(view, imageCount);

        }
        else if(counter == 3){
          $('.newProductCurrentImage').attr('src', '');
          var view = "Back";
          var imageCount = self.miniPhotoCounter + 1;
          addHtmlGuide(view, imageCount);
        }
        else {
          $('#i_file').css({
            height: ""
            ,width: '50px'
            ,marginLeft: '-38px'
            ,marginTop: 0
          })
          return null;
        }
      }
      /////////////////////////////////////////////////////////
      //////////end functions to add the front-side-back html

      function checkToken(){
        var token = window.localStorage.hofbToken;
        if(token){
          console.log('aight');
        }
        else {
          alert('Please login or sign up to view this page');
          window.location.hash = "#/designer/loginportal";
          window.location.reload();
        }
      }
      checkToken();
  ////////////////////////////////
  ///////////////////////////////
  ///////End all controller Code///
  }
