angular.module('dashController', ['allProjectsFactory', 'checkPwFactory', 'getSwatchesFactory'])

  .controller('dashCtrl', dashCtrl)

  dashCtrl.$inject = ['$http', 'allProjects', 'checkPw', 'allSwatches'];
  function dashCtrl($http, allProjects, checkPw, allSwatches){
    var self = this;
    //////counter to keep track of active or curated list being shown
    self.curatedToggleCounter = 'active'
    self.collectionCounter = true;///so we only load collections once
    // window.localStorage.checkPw = false;
    // checkPw.checkPassword();
    /////////////////////////////////////////////////////
    /////////onload event to add initial list of repeated projects

    var allSwatches = allSwatches;
    function loadProjects(callback, arg){
      ///////decode user to pull data
      $http({
        method: "GET"
        ,url: '/api/checkstatus/'+ window.localStorage.hofbToken
      })
      .then(function(decodedToken){
        self.decodedToken = decodedToken;
        ///////note: User Id is ""
        if(decodedToken.data.aud != "designer"){
          window.location.hash = '#/signin'
        }
        $http({
          method: "GET"
          ,url: '/api/'+decodedToken.data.name+'/products'
        })
        .then(function(products){
          var allProjects = products.data;
          var allProjectsSaved = [];
          var curatedProjectsArray = [];
          var submittedProjectsArray = [];
          for (var i = 0; i < allProjects.length; i++) {
            if(allProjects[i].status == "saved"){
              allProjectsSaved.push(allProjects[i]);
            }
            else if(allProjects[i].status ==  "curated"){
              curatedProjectsArray.push(allProjects[i]);
            }
            else if(allProjects[i].status == "submitted to curator"){
              submittedProjectsArray.push(allProjects[i]);
            }
            self.allProjects = allProjectsSaved;
            self.curatedProjects = curatedProjectsArray;
            self.submittedProjects = submittedProjectsArray;
          }
          //////add time-since-creation field
          var collectionName = ["All"];
          // sel
          for (var i = 0; i < self.allProjects.length; i++) {
            function timeSince(){
              var nowDate = new Date();
              var timeProj = self.allProjects[i].timestamp;
              //////project creation variables
              var projYear = timeProj.split('-')[0];
              var projMonth = timeProj.split('-')[1];
              var projDay = timeProj.split('-')[2].slice(0,2);
              var projDate = projMonth+"-"+projDay+"-"+projYear;

              ///////current time variables
              var nowMonth = nowDate.getMonth() + 1;
              var nowYear  = nowDate.getFullYear();
              var nowDay = nowDate.getDate();
              var rigthNow = nowMonth+"-"+nowDay+"-"+nowYear;
              if(nowYear > projYear){
                if(nowMonth > projMonth){
                   var months_since = (nowYear - projYear) + (nowMonth - projMonth);
                   return months_since+ " months old"
                }
                else if ((nowYear - projYear == 1) && projMonth >= nowMonth ){
                  if(projMonth == nowMonth){
                    return "11 months old"
                  }
                  else {
                    var mSince = ((12+nowMonth) - projMonth);

                    if(mSince == 1){
                      return  "less than "+mSince+" month old";
                    }
                    else {
                      return (mSince+" months old");
                    }
                  }

                }
              }
              else if(projYear == nowYear){
                if(nowMonth > projMonth+1){
                  return (nowMonth - projMonth)+" months old";
                }
                else if(nowMonth-1 == projMonth){
                  return "less than "+(nowMonth - projMonth)+" month old";
                }
                else if(nowMonth == projMonth){
                  return nowDay - projDay+ " days old";
                }
              }
            }
            self.allProjects[i].TimeSinceCreation = timeSince();
            /////get all collections
            for (var j = 0; j < self.allProjects[i].collections.length; j++) {
              console.log(self.allProjects[i].collections[j]);
              if(self.allProjects[i].collections[j].split('').length > 1){
                console.log('ccepted');
                collectionName.push(self.allProjects[i].collections[j]);
              }
            }
            self.allCollectionsRaw = collectionName;
            console.log(self.allCollectionsRaw);
          }
          checkDuplicate();
          callback(arg)
        })
      })
    }

    //////simple function to return just the unique items from an array, very useful for many purposes
    function unique(list) {
      var result = [];
      $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
      });
      return result;
    }

    function checkDuplicate(){
      //////must make sure there are no duplicates
      self.allCollections = unique(self.allCollectionsRaw);
      loadCollection(self.allCollections);
    }

    /////load all active projects into the dashboard view
    function loadInitialList(arg){
      var dataType = $('.dashDataType');
      dataType.text('Active Products, which have not been sent to curation');
      for (var i = 0; i < self.allProjects.length; i++) {
        $('.designerDashList').append(
          "<div class='col-md-4 col-xs-12 projectCell'>"+
            "<div class='projectCellInner'>"+
              "<div class='projectCellImageHolder'>"+
                "<img class='projectCellImage' id='"+self.allProjects[i]._id+"'"+
              "src='"+self.allProjects[i].images[0]+"'>"+
              "</div>"+
              "<div class='projectCellMinis' id='mini"+i+"'>"+
              "</div>"+
              "<div class='projectCellContent'>"+
                "<p class='projectCellContentName'>"+self.allProjects[i].name+"</p>"+
                "<p class='projectCellContentTime'>"+self.allProjects[i].TimeSinceCreation+"</p>"+
              "</div>"+
            "</div>"+
          "</div>"
        )
        //////we need to load up all the different element attributes to populate the boxes
        var allAttributes = [];
        var allImages = self.allProjects[i].images;
        for (var k = 0; k < allImages.length; k++) {
          allAttributes.push(allImages[k]);
        }
        // var allFabrics = self.allProjects[i].fabrics;
        // console.log(self.allProjects[i]);
        // console.log(allFabrics);
        // for (var k = 0; k < allFabrics.length; k++) {
        //   console.log(allFabrics[k]);
        //   //////compare against swatches, so we can send right swatch info
        //   for (fabric in allSwatches.fabrics) {
        //     console.log(fabric);
        //     if(allFabrics[k].toLowerCase() == fabric){
        //       console.log(fabric);
        //       allAttributes.push(allSwatches.fabrics[fabric])
        //     }
        //   }
        // }
        // var allColors = self.allProjects[i].colors;
        // for (var k = 0; k < allColors.length; k++) {
        //   //////compare against swatches, so we can send right swatch info
        //   for (color in allSwatches.colors) {
        //     if(allColors[k].toLowerCase() == color){
        //       allAttributes.push(allSwatches.colors[color])
        //     }
        //   }
        // }
        for (var j = 0; j < allAttributes.length; j++) {
          $('#mini'+i).append(
            "<img src='"+allAttributes[j]+"' class='projectCellMiniImage' id='miniCell"+j+"'/>"
          )
        }
      }
      moveDashMinis();

      self.activeMinis = '';///this is were we'll keep track of which mini photo thing should be moving
      self.miniMarg = 0;
      self.intervalCounter = 0;////this is to run and not run the moving phtoos on the dashboard side that we're going to use
      function moveDashMinis() {
        //////We create the logic for the mini photos. these run on an interval, that switches to the photos being move (margin-left being added)
        setInterval(function(){
          if(self.intervalCounter == 0){
            self.miniMarg = 0;
          }
          else {
            var imageCount = $(self.activeMinis)[0].children.length;
            console.log(imageCount);
            var totalLengthPhotos = ((imageCount+.3)*64);
            console.log(totalLengthPhotos);
            var viewWindow = $('.projectCellImageHolder').width();
            console.log(viewWindow);
            var maxMovement = (-totalLengthPhotos) + viewWindow;
            console.log(maxMovement);
            console.log(self.miniMarg);
            if(self.miniMarg >= maxMovement && maxMovement < 0){
              $(self.activeMinis).css({
                marginLeft: self.miniMarg
              })
              self.miniMarg += -1;
            }
            else {
              console.log('no room for movement there');
            }
          }
        }, 20)
        $('.projectCellMinis').on('mouseenter', function(evt){
          self.intervalCounter = 1;
          if($(evt.target)[0].classList[0] == 'projectCellMinis'){
            self.activeMinis = $(evt.target)[0];
          }
          else {
            self.activeMinis = $(evt.target)[0].parentNode;
          }
        })
        $('.projectCellMinis').on('mouseleave', function(){
          self.intervalCounter = 0;
          self.activeMinis = "none";
        })
      }


      ///////////////////////////////////////////////////////
      ///////////////begin logic for the photo popup windows/
      function setPopup(){
        $('.projectCellMiniImage').on('click', function(evt){
          $('.invisModal').remove();
          var source = $(evt.target).attr('src');
          var marTop = $(evt)[0].pageY;
          var marLeft = $(evt)[0].pageX;
          $('.bodyview').append(
            "<div class='invisModal'>"+
              "<div class='photoPopup'>"+
                "<img class='photoPopupImage' src='"+source+"'>"+
              "</div>"+
            "</div>"
          )
          $(".photoPopup").css({
            marginTop: marTop - 450
            ,marginLeft: marLeft - 75
          })
          $('.invisModal').height($(document).height())
          $('.invisModal').on('click', function(evt){
            var thisClass = $(evt.target)[0].classList[0];
            if(thisClass == 'photoPopup' || thisClass == 'photoPopupImage'){
            }
            else {
              $('.invisModal').remove();
            }
          })
        })
      }
      setPopup();
      setTimeout(setPopup(), 1000)
      setTimeout(setPopup(), 3000)
      /////////////end logic for the photo popup windows/////
      ///////////////////////////////////////////////////////
      $('.designerDashList').append(
        "<div class='col-md-4 col-xs-12 projectCell projectCellNew'>"+
          "<div class='projectCellNewInner'>"+
            "<p>Build a New product</p>"+
          "</div>"+
        "</div>"
      )
      //////add hover events to 'addNew' box
      $('.projectCellNewInner').on('mouseenter', function(){
        $('.projectCellNewInner').animate({
          opacity: .6
        }, 100)
      })
      $('.projectCellNewInner').on('mouseleave', function(){
        $('.projectCellNewInner').animate({
          outline: 'none'
          ,opacity: 1
        }, 100)
      })
      $('.projectCellNewInner').on('click', function(){
        newProductPop();
      })
      if(self.decodedToken.data.sub <= 3){////this if statement controls how many times a client uses our app before they stop getting the tutorial
        self.tourCounter = 0;///keeps track of where we are in the dashboard tour
        dashboardTour();
      }
      arg();
    }
    ///////will set self.allProjects as all our projects
    setTimeout(loadProjects(loadInitialList, addHoverToCell), 700)
    function newProductPop(){
      $('.bodyview').prepend(
        '<div class="newProductModal">'+
          "<div class='modalFiller'>"+
          "</div>"+
          "<div class='newProductModalHolder'>"+
            "<div class='newProductModalDelete'>X</div>"+
            "<div class='newProductModalContent'>"+
              "<h3>Welcome to your New Product</h3>"+
              "<h4>Here we will be building your new Product. It's important to give us as much detail as possible, so that our buyers can evaluate what they are getting</h4>"+
              "<br>"+
              "<h4>The first step is giving your product a name</h4>"+
              "<input class='newProductName' placeholder='New Product Name'>"+
              "<h4>Next, please select the type of clothing you would like to make</h4>"+
              '<select class="target newProductModalDropdown">'+
                '<option selected="selected">Please Choose Your Clothing Type</option>'+
                '<option value="dress">Dress'+ '</option>'+
              '  <option value="pants" disabled>Pants</option>'+
              '  <option value="skirt" disabled>Skirt</option>'+
              '  <option value="shirt" disabled>Shirt</option>'+
              '</select>'+
              "<input class='newProductBegin' value='Ok, lets start' type='button'>"+
            '</div>'+
          '</div>'+
          "<div class='modalFiller'>"+
          "</div>"+
        '</div>'
      )
      $('.dropList').on('change', function(){
      })
      $('.newProductBegin').on('click', function(){
        var name = $('.newProductName').val().split(' ').join('_');
        var type = $('.newProductModalDropdown').val();
        window.location.hash = "#/create/product/"+name+"/"+type;
      });////function to begin product build
      $('.modalFiller').on('click', function(){
        $('.newProductModal').remove();
      });/////function to go back to dashboard
      $('.newProductModalDelete').on('click', function(){
        $('.newProductModal').remove();
      })
    }

    ////function for appending active list
    function loadCuratedList(){
      var dataType = $('.dashDataType');
      dataType.text('Sent-for-Curation Products');
      for (var i = 0; i < self.curatedProjects.length; i++) {
        function timeSince(){
          var nowDate = new Date();
          var timeProj = self.curatedProjects[i].timestamp;
          var projYear = timeProj.split('-')[0];
          var projMonth = timeProj.split('-')[1];
          var projDay = timeProj.split('-')[2];
          var yearsSince = nowDate.getFullYear() - projYear;
          var monthsSince = nowDate.getMonth() - projMonth;
          var daysSince = nowDate.getDate() - projDay;
          if(yearsSince > 0){
            return yearsSince+" years";
          }
          else if(monthsSince > 0){
            return monthsSince+" months";
          }
          else if(daysSince > 0 ){
            return daysSince+" days"
          } else {
            return "Less Than 1 day";
          }
        }
        self.curatedProjects[i].TimeSinceCreation = timeSince();
      }
      $('.designerDashList').append(
        "<div class='curatedTopBar'>"+
        "<p class='curatedBarProduct'>"+
          "Product"+
        "</p>"+
        "<p class='curatedBarStatus'>"+
          "Status"+
        "</p>"+
        "<p class='curatedBarOrders'>"+
          "Orders"+
        "</p>"+
      "</div>"
      )
      for (var i = 0; i < self.curatedProjects.length; i++) {
        $('.designerDashList').append(
          "<div class='curatedCell' id='"+self.curatedProjects[i]._id+"'>"+
            "<div class='curatedCellImage' id='"+self.curatedProjects[i]._id+"'>"+
              "<img src='"+self.curatedProjects[i].images[0]+"'>"+
            "</div>"+
            "<div class='curatedCellName' id='"+self.curatedProjects[i]._id+"'>"+
              "<p class='curatedTitle' id='"+self.curatedProjects[i]._id+"'>"+self.curatedProjects[i].name+"</p>"+
              "<p class='curatedTime' id='"+self.curatedProjects[i]._id+"'>"+self.curatedProjects[i].TimeSinceCreation+"</p>"+
            "</div>"+
            "<div class='curatedCellStatus'>"+

            "</div>"+
            "<div class='curatedCellOrders'>"+
            "coming soon"+
            "</div>"+
          "</div>"
        )
        $('.curatedCell').on('mouseenter', function(){
          $(this).css({
            backgroundColor: '#D7D1D3'
            ,opacity: .8
          })
        })
        $('.curatedCell').on('mouseleave', function(){
          $(this).css({
            backgroundColor: '#efe9eb'
            ,opacity: 1
          })
        })
        $('.curatedCell').on('click', function(evt){
          var thisId = $(evt.target).attr('id');
          window.location.hash = "#/view/product/"+ thisId;
        })
      }
    }
    ////function for appending submitted list
    function loadSubmittedList(){
      var dataType = $('.dashDataType');
      dataType.text('Sent-for-Curation Products');
      for (var i = 0; i < self.submittedProjects.length; i++) {
        function timeSince(){
          var nowDate = new Date();
          var timeProj = self.submittedProjects[i].timestamp;
          var projYear = timeProj.split('-')[0];
          var projMonth = timeProj.split('-')[1];
          var projDay = timeProj.split('-')[2];
          var yearsSince = nowDate.getFullYear() - projYear;
          var monthsSince = nowDate.getMonth() - projMonth;
          var daysSince = nowDate.getDate() - projDay;
          if(yearsSince > 0){
            return yearsSince+" years";
          }
          else if(monthsSince > 0){
            return monthsSince+" months";
          }
          else if(daysSince > 0 ){
            return daysSince+" days"
          } else {
            return "Less Than 1 day";
          }
        }
        self.submittedProjects[i].TimeSinceCreation = timeSince();
      }
      for (var i = 0; i < self.submittedProjects.length; i++) {
          $('.designerDashList').append(
            "<div class='projectCell col-md-4 col-xs-12' id='"+self.submittedProjects[i]._id+"'>"+
              "<div class='projectCellInner'>"+
                "<div class='projectCellImageHolder'>"+
                  "<img class='projectCellImage' src='"+self.submittedProjects[i].images[0]+"'>"+
                "</div>"+
                "<div class='projectCellContent'>"+
                  "<p>"+self.submittedProjects[i].TimeSinceCreation+"</p>"+
                  "<p>"+self.submittedProjects[i].name+"--curated</p>"+
                "</div>"+
              "</div>"+
            "</div>"
          )
      }
      $('.designerDashList').append(
        "<div class='col-md-4 col-xs-12 projectCell projectCellNew'>"+
          "<div class='projectCellNewInner'>"+
            "<p>Build a New product</p>"+
          "</div>"+
        "</div>"
      )
      $('.projectCellNewInner').on('mouseenter', function(){
        $('.projectCellNewInner').animate({
          opacity: .6
        }, 100)
      })
      $('.projectCellNewInner').on('mouseleave', function(){
        $('.projectCellNewInner').animate({
          outline: 'none'
          ,opacity: 1
        }, 100)
      })
      $('.projectCellNewInner').on('click', function(){
        newProductPop();
      })
    }

    ////function for appending filtered lists from dropdown in realtime
    function loadFilteredList(filterType, filterValue, listToFilter){
      var productData = listToFilter[0];
      var productElemType = productData[filterType];///return string or array
      var filteredArray = [];
        //////check for filters with one value versus many
      if(typeof(productElemType) == 'string'){
        for (var i = 0; i < listToFilter.length; i++) {
          var productTypeData = listToFilter[i];
          var productType = productTypeData[filterType];
          ///adding for loop here
          if(filterValue == productType){
            filteredArray.push(listToFilter[i]);
          }
          ////ending for loop
        }
        self.filteredProjects = filteredArray;
      }
      ////filter for attributes that come in arrays
      else if(typeof(productElemType) == 'object'){
        for (var i = 0; i < listToFilter.length; i++) {
          var productDataArray = listToFilter[i];
          var productTypeArray = productDataArray[filterType];
          for (var j = 0; j < productTypeArray.length; j++) {
            if(productTypeArray[j] == filterValue){
              filteredArray.push(listToFilter[i]);
              self.filteredProjects = filteredArray;
            }else{
            }
          }
        }
      }
      //////begin if statement for self.filtered
      if(!self.filteredProjects || self.filteredProjects.length == 0){
        $('.designerDashList').html('');
      }
      else {
        for (var i = 0; i < self.filteredProjects.length; i++) {
          function timeSince(){
            var nowDate = new Date();
            var timeProj = self.filteredProjects[i].timestamp;
            var projYear = timeProj.split('-')[0];
            var projMonth = timeProj.split('-')[1];
            var projDay = timeProj.split('-')[2];
            var yearsSince = nowDate.getFullYear() - projYear;
            var monthsSince = nowDate.getMonth() - projMonth;
            var daysSince = nowDate.getDate() - projDay;
            if(yearsSince > 0){
              return yearsSince+" years";
            }
            else if(monthsSince > 0){
              return monthsSince+" months";
            }
            else if(daysSince > 0 ){
              return daysSince+" days"
            } else {
              return "Less Than 1 day";
            }
          }
          self.filteredProjects[i].TimeSinceCreation = timeSince();
        }
        for (var i = 0; i < self.filteredProjects.length; i++) {
          $('.designerDashList').append(
            "<div class='projectCell col-md-4 col-xs-12'>"+
              "<div class='projectCellInner'>"+
                "<div class='projectCellImageHolder'>"+
                  "<img class='projectCellImage' src='"+self.filteredProjects[i].images[0]+"'>"+
                "</div>"+
                "<div class='projectCellContent'>"+
                  "<p>"+self.filteredProjects[i].TimeSinceCreation+"</p>"+
                  "<p>"+self.filteredProjects[i].name+"</p>"+
                "</div>"+
              "</div>"+
            "</div>"
          )
        }
      //////end if statement for self.filtered
      }
      $('.designerDashList').append(
        "<div class='col-md-4 col-xs-12 projectCell projectCellNew'>"+
          "<div class='projectCellNewInner'>"+
            "<p>Build a New product</p>"+
          "</div>"+
        "</div>"
      )
      //////add hover events to 'addNew' box
      $('.projectCellImage').on('mouseenter', function(){
        $('.projectCellNewInner').animate({
          opacity: .6
        }, 100)
      })
      $('.projectCellIMage').on('mouseleave', function(){
        $('.projectCellNewInner').animate({
          outline: 'none'
          ,opacity: 1
        }, 100)
      })
      $('.projectCellImage').on('click', function(){
        window.location.hash = "#/create/project";
        window.location.reload();
      })
      addHoverToCell();
      self.filteredProjects = [];
    }


    ///////////////////////////
    //////Toggle Logic/////////

    ////see all curated projects
    function toggleCurated(){
      $('.designerDashList').html('');
      loadCuratedList();
      $('.sectionTitle').text('listing all curated projects')
    }
    ////see all curated projects
    function toggleSubmitted(){
      $('.designerDashList').html('');
      loadSubmittedList();
      $('.sectionTitle').text('listing all curated projects')
    }

    ////see all active projects
    function toggleActive(){
      $('.designerDashList').html('');
      loadInitialList(function(){console.log('boom')});
      $('.sectionTitle').text('listing all active projects')
    }

    /////////////////////////////////////////////////////////
    //////////click functions for toggling designer dashboard

    ////////toggle to curated view
    $('.designerDashCurated').on('click', function(){
      $('.designerDashCurated').css({
        backgroundColor: "#FEFDFA"
      })
      $('.designerDashSubmitted').css({
        backgroundColor: "#EBEBE9"
      })
      $('.designerDashActive').css({
        backgroundColor: "#EBEBE9"
      })
      self.curatedToggleCounter = 'curated';
      toggleCurated();
      addHoverToCuratedCell()
    })
    ////////toggle to submitted view
    $('.designerDashSubmitted').on('click', function(){
      $('.designerDashSubmitted').css({
        backgroundColor: "#FEFDFA"
      })
      $('.designerDashCurated').css({
        backgroundColor: "#EBEBE9"
      })
      $('.designerDashActive').css({
        backgroundColor: "#EBEBE9"
      })
      self.curatedToggleCounter = 'Submitted';
      toggleSubmitted();
      addHoverToCuratedCell()
    })

    ////////toggle to active view
    $('.designerDashActive').on('click', function(){
      $('.designerDashCurated').css({
        backgroundColor: "#EBEBE9"
      })
      $('.designerDashActive').css({
        backgroundColor: "#FEFDFA"
      })
      self.curatedToggleCounter = 'active';
      toggleActive();
      addHoverToCell();
    })
    //////////click functions for toggling designer dashboard
    /////////////////////////////////////////////////////////

    //////End Toggle Logic/////
    ///////////////////////////

    /////////////////////////////
    /////////Cell Hover effect///
    function addHoverToCell(){
      /////create mouseenter event listener to cause frontend changes
      $('.projectCellImage').on('mouseenter', function(evt){
        var $hoverTarget = $(evt.target);
        $hoverTarget.css({
          opacity: 0.08
        })
        ////we drill up in order to get the parent, so we can append the html buttons to it
        var parentContainer = $hoverTarget.parent().parent()[0];
        $(parentContainer).prepend(
          "<div class='projectCellHoverContainer'>"+
            "<div class='projectCellTrash'>X </div>"+
            "<div class='projectCellHoverContent'>"+
            "</div>" +
            '<div class="projectCellButton" id="projectCellButtonEdit">EDIT</div>"'+
          "</div>"
        )
        //////begin to call hover actions
        $('#projectCellButtonEdit').on('click', function(){
          var product = $(parentContainer);
          var productId = $($(product[0].children[1])[0].children[0])[0].id
          window.location.hash = "#/edit/project/"+productId;
          window.location.reload();
        })
        $('.projectCellTrash').on('click', function(){
          var product = $(parentContainer);
          var productId = $($(product[0].children[1])[0].children[0])[0].id
          $('.bodyview').prepend(
            '<div class="designerDashDeleteProduct col-md-4 col-md-offset-4 col-xs-8 col-xs-offset-2">'+
              "<p>Are you sure you want to delete this product?</p>"+
              "<button class='deleteButton deleteButtonNo'>No</button>"+
              "<button id='"+productId+"' class='deleteButton deleteButtonYes'>Yes</button>"+
            "</div>"
          )
          $('.deleteButtonYes').on('click', function(evt){
            var idToDelete = $(evt.target)[0].id;
            $http({
              method: "DELETE"
              ,url: "/api/product/"+idToDelete
            })
            .then(function(deletedObject){
              /////reload cells
              $('.designerDashList').html('');
              loadProjects(loadInitialList, addHoverToCell)
              $('.designerDashDeleteProduct').remove();
            })
          })
          $('.deleteButtonNo').on('click', function(){
            $('.designerDashDeleteProduct').remove();
          })
        })
        $('.projectCellHoverContainer').on('mouseleave', function(evt){
          $hoverTarget.css({
            opacity: 1
          })
          ////we drill up in order to get the parent, so we can append the html buttons to it
          // var parentContainer = $hoverTarget.parent().parent()[0];
          $('.projectCellHoverContainer').remove();
        })
      })
      //////function to restore cell to order when mouse leaves cell
    }
    function addHoverToCuratedCell(){
      /////create mouseenter event listener to cause frontend changes
      $('.projectCellImage').on('mouseenter', function(evt){
        var $hoverTarget = $(evt.target);
        $hoverTarget.css({
          opacity: 0.5
        })
        ////we drill up in order to get the parent, so we can append the html buttons to it
        var parentContainer = $hoverTarget.parent().parent()[0];
        $(parentContainer).prepend(
          "<div class='projectCellHoverContainer'>"+
            '<div class="projectCellButton projectCellButtonView" >VIEW</div>'+
          "</div>"
        )
        $('.projectCellButtonView').on('click', function(evt){
          // var product = $(evt.target);
          var productId = $($(parentContainer)[0].parentNode)[0].id;

          window.location.hash = "#/view/product/"+productId;
          window.location.reload();
        })
        $('.projectCellTrash').on('click', function(){
          var product = $(parentContainer);
          var productId = $($(product[0].children[1])[0].children[0])[0].id
          $('.bodyview').prepend(
            '<div class="designerDashDeleteProduct col-md-4 col-md-offset-4 col-xs-8 col-xs-offset-2">'+
              "<p>Are you sure you want to delete this product?</p>"+
              "<button class='deleteButtonNo deleteButton'>No</button>"+
              "<button id='"+productId+"' class='deleteButtonYes deleteButton'>Yes</button>"+
            "</div>"
          )
          $('.deleteButtonYes').on('click', function(evt){
            var idToDelete = $(evt.target)[0].id;
            $http({
              method: "DELETE"
              ,url: "/api/product/"+idToDelete
            })
            .then(function(deletedObject){
              /////reload cells
              $('.designerDashList').html('');
              loadProjects(loadInitialList, addHoverToCell)
              $('.designerDashDeleteProduct').remove();
            })
          })
          $('.deleteButtonNo').on('click', function(){
            $('.designerDashDeleteProduct').remove();
          })
        })
        $('.projectCellHoverContainer').on('mouseleave', function(evt){
          $hoverTarget.css({
            opacity: 1
          })
          ////we drill up in order to get the parent, so we can append the html buttons to it
          // var parentContainer = $hoverTarget.parent().parent()[0];
          $('.projectCellHoverContainer').remove();
        })
      })
      //////function to restore cell to order when mouse leaves cell
    }
    ////////End Cell Hover///////
    /////////////////////////////

    ////////////////////////////////
    //////Begin Filtering///////////

    ////////filter dropdown frontend html logic
    $('.designerDashColor').on('click', function(evt){
      $('.colorFilter').remove();
      $('.typeFilter').remove();
      $('.fabricFilter').remove();
      $('.seasonFilter').remove();
      $(evt.target).append(
        "<div class='colorFilter'>"+
          "<div  id='filterRed' class='colorFilterCell col-xs-4' style=background-color:"+allSwatches.colors.red+">"+
          "</div>"+
          "<div id='filterBlue' class='colorFilterCell col-xs-4' style=background-color:"+allSwatches.colors.blue+">"+
          "</div>"+
          "<div id='filterWhite' class='colorFilterCell col-xs-4' style=background-color:"+allSwatches.colors.white+">"+
          "</div>"+
          "<div id='filterBlack' class='colorFilterCell col-xs-4' style=background-color:"+allSwatches.colors.black+">"+
          "</div>"+
          "<div id='filterOrange' class='colorFilterCell col-xs-4' style=background-color:"+allSwatches.colors.orange+">"+
          "</div>"+
          "<div id='filterYellow' class='colorFilterCell col-xs-4' style=background-color:"+allSwatches.colors.yellow+">"+
          "</div>"+
          "<div id='filterMagenta' class='colorFilterCell col-xs-4' style=background-color:"+allSwatches.colors.magenta+">"+
          "</div>"+
          "<div id='filterAqua' class='colorFilterCell col-xs-4' style=background-color:"+allSwatches.colors.aqua+">"+
          "</div>"+
          "<div id='filterGreen' class='colorFilterCell col-xs-4' style=background-color:"+allSwatches.colors.green+">"+
          "</div>"+
        "</div>"
      )
      $('.colorFilter').on('mouseleave', function(){
        $('.colorFilter').remove();
      })

      $('.colorFilterCell').on('click', function(evt){
        var color = $(evt.target)[0].id.slice(6, 25);
        $('.designerDashList').html('');
        $('.colorFilter').remove();
        if(self.curatedToggleCounter == 'active'){
          loadFilteredList("colors", color, self.allProjects);
        }
        else if(self.curatedToggleCounter == 'curated'){
          loadFilteredList("colors", color, self.curatedProjects);
        }
      })
    })

    ////////filter dropdown frontend html logic
    $('.designerDashType').on('click', function(evt){
      $('.colorFilter').remove();
      $('.typeFilter').remove();
      $('.fabricFilter').remove();
      $('.seasonFilter').remove();
      $(evt.target).append(
        "<div class='typeFilter'>"+
          "<div  id='filterShirt' class='typeFilterCell col-xs-4'>"+
            "<img src='"+allSwatches.types.shirt+"'>" +
          "</div>"+
          "<div  id='filterPants' class='typeFilterCell col-xs-4'>"+
            "<img src='"+allSwatches.types.pants+"'>" +
          "</div>"+
          "<div  id='filterDress' class='typeFilterCell col-xs-4'>"+
            "<img src='"+allSwatches.types.dress+"'>" +
          "</div>"+
          "<div  id='filterJacket' class='typeFilterCell col-xs-4'>"+
            "<img src='"+allSwatches.types.jacket+"'>" +
          "</div>"+
          "<div  id='filterTee' class='typeFilterCell col-xs-4'>"+
            "<img src='"+allSwatches.types.tee+"'>" +
          "</div>"+
          "<div  id='filterSkirt' class='typeFilterCell col-xs-4'>"+
            "<img src='"+allSwatches.types.skirt+"'>" +
          "</div>"+
          "<div  id='filterShorts' class='typeFilterCell col-xs-4'>"+
            "<img src='"+allSwatches.types.shorts+"'>" +
          "</div>"+
          "<div  id='filterScarf' class='typeFilterCell col-xs-4'>"+
            "<img src='"+allSwatches.types.scarf+"'>" +
          "</div>"+
          "<div  id='filterHat' class='typeFilterCell col-xs-4'>"+
            "<img src='"+allSwatches.types.hat+"'>" +
          "</div>"+
        "</div>"
      )
      $('.typeFilter').on('mouseleave', function(){
        $('.typeFilter').remove();
      })

      $('.typeFilterCell').on('click', function(evt){
        var type = $($(evt.target)[0].parentNode)[0].id.slice(6, 25);
        $('.designerDashList').html('');
        $('.typeFilter').remove();
        if(self.curatedToggleCounter == 'active'){
          loadFilteredList("productType", type, self.allProjects);
        }
        else if(self.curatedToggleCounter == 'curated'){
          loadFilteredList("productType", type, self.curatedProjects);
        }
      })
    })

    ////////filter Fabric
    $('.designerDashFabric').on('click', function(evt){
      $('.colorFilter').remove();
      $('.typeFilter').remove();
      $('.fabricFilter').remove();
      $('.seasonFilter').remove();
      $(evt.target).append(
        "<div class='fabricFilter'>"+
          "<div  id='filterSeersucker' class='fabricFilterCell col-xs-4'>"+
            "<img src='"+allSwatches.fabrics.seersucker+"'>" +
          "</div>"+
          "<div  id='filterPleather' class='fabricFilterCell col-xs-4'>"+
            "<img src='"+allSwatches.fabrics.pleather+"'>" +
          "</div>"+
          "<div  id='filterDockers' class='fabricFilterCell col-xs-4'>"+
            "<img src='"+allSwatches.fabrics.dockers+"'>" +
          "</div>"+
          "<div  id='filterCamo' class='fabricFilterCell col-xs-4'>"+
            "<img src='"+allSwatches.fabrics.camo+"'>" +
          "</div>"+
          "<div  id='filterVeneer' class='fabricFilterCell col-xs-4'>"+
            "<img src='"+allSwatches.fabrics.veneer+"'>" +
          "</div>"+
          "<div  id='filterNylon' class='fabricFilterCell col-xs-4'>"+
            "<img src='"+allSwatches.fabrics.nylon+"'>" +
          "</div>"+
          "<div  id='filterLeather' class='fabricFilterCell col-xs-4'>"+
            "<img src='"+allSwatches.fabrics.leather+"'>" +
          "</div>"+
          "<div  id='filterCotton' class='fabricFilterCell col-xs-4'>"+
            "<img src='"+allSwatches.fabrics.cotton+"'>" +
          "</div>"+
          "<div  id='filterDenim' class='fabricFilterCell col-xs-4'>"+
            "<img src='"+allSwatches.fabrics.denim+"'>" +
          "</div>"+
        "</div>"
      )
      $('.fabricFilter').on('mouseleave', function(){
        $('.fabricFilter').remove();
      })

      $('.fabricFilterCell').on('click', function(evt){
        var fabric = $($(evt.target)[0].parentNode)[0].id.slice(6, 25);
        $('.designerDashList').html('');
        $('.fabricFilter').remove();
        if(self.curatedToggleCounter == 'active'){
          loadFilteredList("fabrics", fabric, self.allProjects);
        }
        else if(self.curatedToggleCounter == 'curated'){
          loadFilteredList("fabrics", fabric, self.curatedProjects);
        }
      })
    })

    ////////filter dropdown frontend html logic
    $('.designerDashSeason').on('click', function(evt){
      $('.colorFilter').remove();
      $('.typeFilter').remove();
      $('.fabricFilter').remove();
      $('.seasonFilter').remove();
      $(evt.target).append(
        "<div class='seasonFilter'>"+
          "<div  id='filterSpring' class='seasonFilterCell col-xs-6'>"+
            "<img src='"+allSwatches.seasons.spring+"'>" +
          "</div>"+
          "<div  id='filterSummer' class='seasonFilterCell col-xs-6'>"+
            "<img src='"+allSwatches.seasons.summer+"'>" +
          "</div>"+
          "<div  id='filterFall' class='seasonFilterCell col-xs-6'>"+
            "<img src='"+allSwatches.seasons.fall+"'>" +
          "</div>"+
          "<div  id='filterWinter' class='seasonFilterCell col-xs-6'>"+
            "<img src='"+allSwatches.seasons.winter+"'>" +
          "</div>"+
        "</div>"
      )
      $('.seasonFilter').on('mouseleave', function(){
        $('.seasonFilter').remove();
      })

      $('.seasonFilterCell').on('click', function(evt){
        var season = $($(evt.target)[0].parentNode)[0].id.slice(6, 25);
        $('.designerDashList').html('');
        $('.seasonFilter').remove();
        if(self.curatedToggleCounter == 'active'){
          loadFilteredList("seasons", season, self.allProjects);
        }
        else if(self.curatedToggleCounter == 'curated'){
          loadFilteredList("seasons", season, self.curatedProjects);
        }
      })
    })

    ////End Filtering///////////////
    ////////////////////////////////

    ///logout button functionality
    $('.logoutButton').on('click', function(){
      window.localStorage.hofbToken = "";
      window.location.hash = "#/signin"
    })

    ///////////////////////
    //////load collections/
    function loadCollection(collections){
      console.log('in the function');
      if(self.collectionCounter){
        console.log('adding');
        console.log(collections);
        for (var i = 0; i < collections.length; i++) {
          $('.designerDashCollectionDropdown').append(
            '<div class="designerDashCollectionCell" id="'+collections[i]+'">'+
              collections[i]+
            "</div>"
          )
        }
        $('.designerDashCollectionDropdown').append(
          "<div class='designerDashCollectionAddMore'>"+
            "<span class='glyphicon glyphicon-plus'>"+
              "<p class='designerDashCollectionAddText'>add collection</p>"+
            "</span>"+
          "</div>"
        )
        $('.designerDashCollectionAddMore').on('click', function(){
          $('.bodyview').append(
            "<div class='invisModal'>"+
              "<div class='collectionModalContainer'>"+
                "<input class='collectionModalName' placeholder='Enter New Collection Name'>"+
                "<p> Please Pick a Product to Add to Your Collection, to Get Started</p>"+
                "<div class='collectionModalPickContainer'>"+
                "</div>"+
                "<div class='submitModal'>"+
                  "Add Collection"+
                "</div>"+
              "</div>"+
            "</div>"
          )

          //////now we add the projects to the modal
          console.log(self.allProjects);
          var collectionProductCounters = [];
          for (var i = 0; i < self.allProjects.length; i++) {
            collectionProductCounters[i] = true;
            $('.collectionModalPickContainer').append(
              "<div class='collectionModalProductCell'>"+
                "<img class='modalProductImage "+self.allProjects[i]._id+"' id='modalProduct"+i+"' src='"+self.allProjects[i].images[0]+"'>"+
              "</div>"
            )
          }
          $('.submitModal').on('click', function(evt){
            //////add post request for the modal
            var allPickedModal = $('.collectionProdYes');
            for (var i = 0; i < allPickedModal.length; i++) {
              var newCollection = $('.collectionModalName').val();
              var productId = $(allPickedModal[i])[0].classList[1];
              console.log(productId);
              $http({
                method: "POST"
                ,url: "/api/product/update"
                ,data: {projectId: productId, collections: [newCollection]}
              })
              .then(function(updatedProduct){
                console.log(updatedProduct);
                if(updatedProduct){
                  // var newCollectionHtml =
                  // '<div class="designerDashCollectionCell" id="'+updatedProduct.data.collections[updatedProduct.data.collections.length - 1]+'">'+
                  //   updatedProduct.data.collections[updatedProduct.data.collections.length - 1]+
                  // "</div>"
                  // console.log(newCollectionHtml);
                  // $(newCollectionHtml).insertBefore('.designerDashCollectionAddMore');
                  self.allCollections.push(newCollection);
                  $('.invisModal').remove();
                }
                self.collectionCounter = true;
                var newColl = unique(self.allCollections);
                self.allCollections = newColl;
                console.log(self.allCollections);
                $('.designerDashCollectionDropdown').html('');
                loadCollection(newColl);
                self.collectionCounter = false;
              })
            }
            self.collectionCounter = true;
            var newColl = unique(self.allCollections);
            self.allCollections = newColl;
            console.log(self.allCollections);
            $('.designerDashCollectionDropdown').html('');
            loadCollection(newColl);
            // setTimeout(loadCollection(newColl), 2000)
          })

          $('.modalProductImage').on('click', function(evt){
            console.log(collectionProductCounters);
            var prodCount = $(evt.target).attr('id').split('t')[1];
            console.log(prodCount);
            if(collectionProductCounters[prodCount]){
              $(evt.target).css({
                border: "5px solid green"
              })
              $(evt.target).addClass('collectionProdYes')
              collectionProductCounters[prodCount] = false;
            }
            else {
              $(evt.target).css({
                border: "none"
              })
              $(evt.target).removeClass('collectionProdYes')
              collectionProductCounters[prodCount] = true;
            }
            console.log(collectionProductCounters);
          })
        })
        self.collectionCounter = false;///so that we only load collections once
      }

      ///////////////////////////////////////////////////
      ///////now we add the "add more collections logic"/
      $('.designerDashCollectionAddMore').on('mouseenter', function(evt){
          $('.designerDashCollectionAddMore').css({
              backgroundColor: '#BDBDBD'
          })
      })
      $('.designerDashCollectionAddMore').on('mouseleave', function(evt){
          $('.designerDashCollectionAddMore').css({
            backgroundColor: '#F9F7F5'
            ,color: "black"
          })
      })
      ////////////on click we popout a modal to enter your collection name




      //////end we add the "add more collections logic"/
      //////////////////////////////////////////////////
      $('.designerDashCollectionCell').on('mouseenter', function(evt){
          $(evt.target).css({
              backgroundColor: '#BDBDBD'
          })
      })
      $('.designerDashCollectionCell').on('mouseleave', function(evt){
          $(evt.target).css({
            backgroundColor: '#F9F7F5'
            ,color: "black"
          })
      })
      $('.designerDashCollectionCell').on('click', function(evt){
        var collections = $('.designerDashCollectionCell');
        for (var i = 0; i < collections.length; i++) {
          $(collections[i]).css({
            backgroundColor: '#F9F7F5'
            ,color: "black"
            ,border: 'none'
          })
        }
        var collectionValue = $($(evt.target)[0])[0].id;
        $($(evt.target)[0]).css({
          backgroundColor: "#1C1C1C"
          ,color: '#F9F7F5'
          ,border: '4px solid gray'
        })

        if(self.curatedToggleCounter == 'active'){
          if(collectionValue == 'All'){
            $('.designerDashList').html("");
            loadProjects(loadInitialList, addHoverToCell);
          }
          else {
            $('.designerDashList').html("");
            loadFilteredList('collections', collectionValue, self.allProjects);
          }
        }
        else if(self.curatedToggleCounter == 'curated'){
          if(collectionValue == 'All'){
            $('.designerDashList').html("");
            loadCuratedList();
          }
          else {
            $('.designerDashList').html("");
            loadFilteredList('collections', collectionValue, self.curatedProjects);
          }
        }
      })
    }
    //end load collections/
    ///////////////////////
    $(document).ready(function(){
        $('[data-toggle="popover"]').popover();
    });


    ///////////////////////////////////////////////////
    ///////Begin Logic for Dashboard Tour//////////////
    self.tourCounter = 0;
    function dashboardTour(){
      if(self.tourCounter == 0){
        $('.bodyview').prepend(
          '<div class="dashTour0 tourElem">'+
            "<div class='dashTourController'>"+
              '<div class="dashYesTour">'+
                "I'd like a tour"+
              "</div>"+
              '<div class="dashNoTour">'+
                "No Thanks"+
              "</div>"+
            "</div>"+
          '</div>'
        );
        $('.designerDashboardPage').css({
          opacity: 0.3
        });
        $('.dashYesTour').on('click', function(){
          self.tourCounter++;
          dashboardTour();
        });
        $('.dashNoTour').on('click', function(){
          $('.tourElem').remove();
          $('.designerDashboardPage').css({
            opacity: 1
          });
          self.tourCounter = 7;
        })
      }
      else if(self.tourCounter == 1){
        $('.tourElem').remove();
        $('.bodyview').prepend(
          '<div class="dashTour1 tourElem">'+
            "<div class='dashTourBack'>"+
              "Back"+
            "</div>"+
            "<div class='dashTourNext'>"+
              "Next"+
            "</div>"+
          "<h4>Build a new Product to submit to our Curators, start by clicking here</h4>"+
          "------------->>> ------------->>> ------------->>> ------------->>>"+
          '</div>'
        );
        $('.bodyview').prepend(
          "<div class='tourProjectCellNewInner'>"+
            "<p>Build a New Product</p>"+
          "</div>"
        );
        $('.projectCellNewInner').css({
          opacity: 0.0
        });
        $('.designerDashboardPage').css({
          opacity: 0.3
        });
        $('.projectCellNewInner').css({
          opacity: 0
        })
        var topOff = $('.projectCellNew').offset().top;
        var topLeft = $('.projectCellNew').offset().left;
        var width = $('.projectCellNew').css('width').split('').slice(0, $('.projectCellNew').css('width').split('').length - 2).join('');////this finds the width of the object without that pesky "px"
        var height = $('.projectCellNew').css('height').split('').slice(0, $('.projectCellNew').css('height').split('').length - 2).join('');////this finds the width of the object without that pesky "px"

        /////
        $('.tourProjectCellNewInner').css('top', topOff);
        $('.tourProjectCellNewInner').css('left', topLeft);
        $('.tourProjectCellNewInner').css('width', width);
        $('.tourProjectCellNewInner').css('height', height);

        $('.dashTour1').css('margin-top', topOff + 30);
        $('.dashTour1').css('margin-left', topLeft - width);

        /////add events to new elements
        $('.tourProjectCellNewInner').on('mouseenter', function(evt){
          $('.tourProjectCellNewInner').css({
            opacity: 0.7
          })
        });
        $('.tourProjectCellNewInner').on('mouseleave', function(evt){
          $('.tourProjectCellNewInner').css({
            opacity: 1
          })
        });
        ////////allows users to actually make a new product then and there
        $('.tourProjectCellNewInner').on('click', function(){
          newProductPop();
        })
        $('.dashTourNext').on('click', function(){
          $('.tourProjectCellNewInner').remove();
          $('.projectCellNewInner').css({
            opacity: 1
          });
          self.tourCounter++;
          dashboardTour();
        })
        $('.dashTourBack').on('click', function(){
          $('.tourProjectCellNewInner').remove();
          $('.projectCellNewInner').css({
            opacity: 1
          });
          self.tourCounter--;
          dashboardTour();
        })
      }
      else if (self.tourCounter == 2){
        $('.tourElem').remove();
        $('.bodyview').prepend(
          '<div class="dashTour1 tourElem">'+
            "<div class='dashTourBack'>"+
              "Back"+
            "</div>"+
            "<div class='dashTourNext'>"+
              "Next"+
            "</div>"+
            "<div>"+
              "<<<----------- <<<<---------- <<<<-------------"+
            "</div>"+
          "<h4>Look at Products you've already submitted for Curation by toggling your listview, here</h4>"+
          '</div>'
        );
        $('.bodyview').prepend(
          "<div class='tourDesignerDashCurated'>"+
            '<i class="fa fa-square" id="curatedTabIconSquare"></i>'+
                "CURATED"+
          "</div>"
        );
        $('.designerDashboardPage').css({
          opacity: 0.3
        });
        $('.designerDashCurated').css({
          opacity: 0
        })
        var topOff = $('.designerDashCurated').offset().top;
        var topLeft = $('.designerDashCurated').offset().left;
        var width = $('.designerDashCurated').css('width').split('').slice(0, $('.designerDashCurated').css('width').split('').length - 2).join('');////this finds the width of the object without that pesky "px"
        ////add new temporary element to show tutees
        $('.tourDesignerDashCurated').css('top', topOff);
        $('.tourDesignerDashCurated').css('left', topLeft);
        $('.tourDesignerDashCurated').css('width', width);

        $('.dashTour1').css('margin-top', topOff - 30);
        $('.dashTour1').css('margin-left', topLeft+parseInt(width)+15+'px');
      }
    }
    ///////End Logic for Dashboard Tour////////////////
    ///////////////////////////////////////////////////
    console.log($('.bodyview'));
  /////end dash controller
  ////////////////////////
  ////////////////////////
  }
