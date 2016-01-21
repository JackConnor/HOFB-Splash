angular.module('buyerController', ['allProjectsFactory', 'checkPwFactory', 'getSwatchesFactory', 'getProductFactory'])

  .controller('buyerCtrl', buyerCtrl)

  buyerCtrl.$inject = ['$http', 'allProjects', 'checkPw', 'allSwatches', 'getProduct'];
  function buyerCtrl($http, allProjects, checkPw, allSwatches, getProduct){
    var self = this;
    //////counter to keep track of active or curated list being shown
    self.curatedToggleCounter = 'active'
    self.userSamples = [];
    self.collectionCounter = true;///so we only load collections once
    // window.localStorage.checkPw = false;
    // checkPw.checkPassword();
    /////////////////////////////////////////////////////
    //////////////////////////////////
    //////////////////////////////////
    ////Order Purchase Only///////////

    self.order = {
      totalItems: 0
      ,totalItemsDivided: {}
    }
    self.colorToggle = '';
    function addColorsToOrder(prodId){
      getProduct(prodId)
        .then(function(product){
          var allColors = product.data.colors;
          for (var i = 0; i < allColors.length; i++) {
            $('.purchaseColorRow').append(
              "<div class='purchaseColor' id='"+allColors[i]+"'>"+
              "</div>"
            )
            //////add color to the master array

            for(color in allSwatches.colors){
              if(color == allColors[i].toLowerCase()){
                $('#'+allColors[i]).css({
                  backgroundColor: allSwatches.colors[color]
                })
              }
            }

            self.order.totalItemsDivided[allColors[i]] = {xs: 0, sm: 0, md: 0, lg: 0, xl: 0};
          }
          $('.purchaseColor').on('click', function(evt){
            for (var i = 0; i < $('.purchaseColor').length; i++) {
              $($('.purchaseColor')[i]).css({
                outline: '1px solid gold'
              })
            }
            $(evt.target).css({
              outline: '4px solid green'
            })
            ///update toggle to register sizes properly
            self.colorToggle = $(evt.target)[0].id;
            for (var i = 0; i < $('.purchaseSizeSlider').length; i++) {
              var size = $('.purchaseSizeSlider')[i].classList[0].slice(0,2);
              var sliderVal = self.order.totalItemsDivided[self.colorToggle][size];
              $($('.purchaseSizeSlider')[i]).slider('value', sliderVal);
            }
          })
        })
    }

    /////////////////////////////////////////
    ////////////////////activate all sliders
    function activatePurchaseSliders(){
      $('#slider').slider({
        max: 5000
        ,step: 10
      })

      $('#slider').on('slide', function(evt){
        var totalItems = $(evt.target).slider('value');
        $('.purchaseStatTotal').text(totalItems);
        $('.purchaseStatCost').text("$"+totalItems*25)
        for(key in self.order.totalItemsDivided){
          for(size in key){
            size = 0;
          }
        }
        self.order.totalItems = totalItems;
        returnRemaining();

      })

      $('#slider').on('slidechange', function(evt){
        var totalItems = $(evt.target).slider('value');
        self.order.totalItems = totalItems;
        $('.purchaseStatTotal').text(totalItems);
        $('.purchaseSizeSlider').slider('option', 'max', self.order.totalItems);
        $('.purchaseSizeSlider').slider('value', 0);
        returnRemaining();
      })

      $('.purchaseSizeSlider').slider({
        max: self.order.totalItems
        ,step: 10
      })

      $('.purchaseSizeSlider').on('slide', function(evt){
        var totalSizeItems = $(evt.target).slider('value');
        var itemColor = self.colorToggle;
        var itemSize = $(evt.target)[0].classList[0].slice(0, 2);
        self.order.totalItemsDivided[itemColor][itemSize] = totalSizeItems;
        $(evt.target)[0].nextElementSibling.innerText = totalSizeItems;
        returnRemaining();
      })
      $('.purchaseSizeSlider').on('slidechange', function(evt){
        var totalSizeItems = $(evt.target).slider('value');
        var itemColor = self.colorToggle;
        var itemSize = $(evt.target)[0].classList[0].slice(0, 2);
        self.order.totalItemsDivided[itemColor][itemSize] = totalSizeItems;
        $(evt.target)[0].nextElementSibling.innerText = totalSizeItems;
        returnRemaining();
      })

      /////function to return value of all items remaining
      function returnRemaining(){
        var getAllSliderFunc = function(){
          var totalFromSizes = 0;
          for (var key in self.order.totalItemsDivided){
            ///////now we have to get each size from each color, so we do another iteration
            totalFromSizes += self.order.totalItemsDivided[key].xs;
            totalFromSizes += self.order.totalItemsDivided[key].sm;
            totalFromSizes += self.order.totalItemsDivided[key].md;
            totalFromSizes += self.order.totalItemsDivided[key].lg;
            totalFromSizes += self.order.totalItemsDivided[key].xl;
          }
          var totalRemaining = self.order.totalItems - totalFromSizes;
          return totalRemaining;
        }
        var remainingItems = getAllSliderFunc();
        $('.purchaseTotalRemaining').text(remainingItems);
        if(parseInt($('.purchaseTotalRemaining').text()) < 0){
          $('.purchaseTotalRemaining').css({
            color: "tomato"
            ,fontSize: '25px'
          })
        }
        else {
          $('.purchaseTotalRemaining').css({
            color: "black"
            ,fontSize: '21px'
          })
        }
        /////reset all sliders to new max
        for (var i = 0; i < $('.purchaseSizeSlider').length; i++) {
          // $($('.purchaseSizeSlider')[i]).slider('option', 'max', remainingItems);
        }
      }
    }

    /////////activate all sliders/////////////
    //////////////////////////////////////////

    ////Order Purchase Only///////////
    //////////////////////////////////
    //////////////////////////////////
    function loadProjects(callback, arg){
      ///////decode user to pull data
      $http({
        method: "GET"
        ,url: '/api/checkstatus/'+ window.localStorage.hofbToken
      })
      .then(function(decodedToken){
        var tier = decodedToken.data.aud.split("-")[1];
        self.buyerId = decodedToken.data.name;
        getBoughtList();/////run on load in order for list to be set on toggle
        if(decodedToken.data.aud.split('-')[0] != "buyer"){
          window.location.hash = '#/designer/loginportal';
          window.location.reload();
        }
        $http({
          method: "GET"
          ,url: '/api/buyer/products'
        })
        .then(function(products){
          /////look up user, get samples list, push to array, nest everything else inside
          $http({
            method: "GET"
            ,url: "/api/users/"+self.buyerId
          })
          .then(function(currentUser){
            self.currentUser = currentUser.data;
            for (var i = 0; i < self.currentUser.samplesRequested.length; i++) {
              self.userSamples.push(self.currentUser.samplesRequested[i])
            }
            var allProjects = products.data;
            var allProjectsAlreadyCurated = [];
            for (var i = 0; i < allProjects.length; i++) {
              if((allProjects[i].status == "curated" || allProjects[i].status == "sampleRequested") && (allProjects[i].name != 'Curated Demo Product' && allProjects[i].name != 'Curated Sample Product')){
                allProjectsAlreadyCurated.push(allProjects[i]);
              }
              self.alreadyCurated = allProjectsAlreadyCurated;
            }
            //////add time-since-creation field
            var collectionName = ["All"];
            for (var i = 0; i < self.alreadyCurated.length; i++) {
              function timeSince(){
                var nowDate = new Date();
                var timeProj = self.alreadyCurated[i].timestamp;
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
              self.alreadyCurated[i].TimeSinceCreation = timeSince();
            }
            callback(arg)
          })
        })
      })
    }

    /////load all active projects into the dashboard view
    function loadInitialList(arg){
      var dataType = $('.dashDataType');
      dataType.text('Curated, fed to your Tier');
      $http({
        method: "GET"
        ,url: "/api/users/"+self.buyerId
      })
      .then(function(user){
        self.allFavorites = user.data.favorites;
        //////load based on the curated list
        for (var i = 0; i < self.alreadyCurated.length; i++) {
          $('.designerDashList').append(
            "<div class='col-md-4 col-xs-12 projectCell'>"+
              "<div class='projectCellInner'>"+
                "<div class='projectCellImageHolder'>"+
                  "<img class='projectCellImage' id='"+self.alreadyCurated[i]._id+"'"+
                "src='"+self.alreadyCurated[i].images[0]+"'>"+
                "</div>"+
                "<div class='projectCellMinis' id='mini"+i+"'>"+
                "</div>"+
                "<div class='projectCellContent'>"+
                  "<span class='glyphicon glyphicon-heart projectCellHeart boomHeart"+i+"' id='"+self.alreadyCurated[i]._id+"'></span>"+
                  "<p class='projectCellContentName'>"+self.alreadyCurated[i].name+"</p>"+
                  "<p class='projectCellContentTime'>"+self.alreadyCurated[i].TimeSinceCreation+"</p>"+
                "</div>"+
              "</div>"+
            "</div>"
            )
            var allImages = self.alreadyCurated[i].images;
            for (var j = 0; j < allImages.length; j++) {
              $('#mini'+i).append(
                "<img src='"+allImages[j]+"' class='projectCellMiniImage'/>"
              )
            }
            for (var k = 0; k < self.allFavorites.length; k++) {
              console.log(self.allFavorites[k]);
              if(self.allFavorites[k] == self.alreadyCurated[i]._id){
                console.log('got one');
                $('.boomHeart'+i).addClass('favorited');
                $('.boomHeart'+i).css({
                  color: "#292D36"
                })
              }
            }
        }
        // moveDashMinis();
        addFavorites(self.buyerId);
        arg();
      })
    }
    ///////will set self.allProjects as all our projects
    loadProjects(loadInitialList, addHoverToCell);


    ////function for appending active list
    function loadSampleList(){
      console.log(self.userSamples);
      for (var i = 0; i < self.userSamples.length; i++) {
        if(self.userSamples[i]!=null){
          $http({
            method: "GET"
            ,url: "/api/product/"+self.userSamples[i]
          })
          .then(function(productToSample){
            console.log(productToSample.data);
            if(productToSample.data != null){
              var source = productToSample.data.images[0];
              console.log(source);
              $('.designerDashList').append(
                "<div class='curatedCell' id='"+productToSample.data._id+"'>"+
                  "<div class='sampleCellImage' id='"+productToSample.data._id+"'>"+
                    "<img src='"+source+"' id='"+productToSample.data._id+"'>"+
                  "</div>"+
                  "<div class='sampleCellOrders'>"+
                    productToSample.data.name+
                  "</div>"+
                  "<div class='samplePlaceOrder'>"+
                    "PURCHASE ORDER"+
                  "</div>"+
                  "<div class='curatedCellStatus'>"+
                    "processing"+
                  "</div>"+
                "</div>"
              )
              clickPurchaseModal($('.samplePlaceOrder'));
            }
          })
        }
      }
      ///////add in soon
    }
    function getBoughtList(){
      $http({
        method: "GET"
        ,url: "/api/bought/products/"+ self.buyerId
      })
      .then(function(boughtProducts){
        self.boughtProducts = boughtProducts.data;
      })
    }

    ////function for appending filtered lists from dropdown in realtime
    function loadFilteredList(filterType, filterValue, listToFilter){
      var dataType = $('.dashDataType');
      dataType.text('Filtered');
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
            "<div class='col-md-4 col-xs-12 projectCell'>"+
              "<div class='projectCellInner'>"+
                "<div class='projectCellImageHolder'>"+
                  "<img class='projectCellImage' id='"+self.filteredProjects[i]._id+"'"+
                "src='"+self.filteredProjects[i].images[0]+"'>"+
                "</div>"+
                "<div class='projectCellMinis' id='mini"+i+"'>"+
                "</div>"+
                "<div class='projectCellContent'>"+
                  "<span class='glyphicon glyphicon-heart projectCellHeart'></span>"+
                  "<p class='projectCellContentName'>"+self.filteredProjects[i].name+"</p>"+
                  "<p class='projectCellContentTime'>"+self.filteredProjects[i].TimeSinceCreation+"</p>"+
                "</div>"+
              "</div>"+
            "</div>"
          )
        }
        addFavorites(self.buyerId);
      //////end if statement for self.filtered
      }
      addHoverToCell();
      self.filteredProjects = [];
    }


    ///////////////////////////
    //////Toggle Logic/////////

    ////see all curated projects
    function toggleSample(){
      console.log('about ot lad the sample listing');
      $('.designerDashList').html('');
      loadSampleList();
    }

    ////see all active projects
    function toggleActive(){
      $('.designerDashList').html('');
      loadInitialList(addHoverToCell);
    }

    /////////////////////////////////////////////////////////
    //////////click functions for toggling designer dashboard

    ////////toggle to curated view
    $('.designerDashSample').on('click', function(){
      $('.designerDashSample').css({
        backgroundColor: "#FEFDFA"
        ,borderTop: "1px solid #EFEEEC"
        ,borderLeft: '1px solid #EFEEEC'
        ,borderRight: '1px solid #EFEEEC'

      })
      $('.designerDashActive').css({
        backgroundColor: "#EBEBE9"
        ,borderTop: "0px solid #EFEEEC"
        ,borderLeft: '0px solid #EFEEEC'
        ,borderRight: '0px solid #EFEEEC'
      })
      self.curatedToggleCounter = 'curated';
      toggleSample();
      addHoverToCell();
    })

    ////////toggle to active view
    $('.designerDashActive').on('click', function(){
      $('.designerDashSample').css({
        backgroundColor: "#EBEBE9"
        ,borderTop: "0px solid #EFEEEC"
        ,borderLeft: '0px solid #EFEEEC'
        ,borderRight: '0px solid #EFEEEC'

      })
      $('.designerDashActive').css({
        backgroundColor: "#FEFDFA"
        ,borderTop: "1px solid #EFEEEC"
        ,borderLeft: '1px solid #EFEEEC'
        ,borderRight: '1px solid #EFEEEC'

      })
      self.curatedToggleCounter = 'active';
      toggleActive();
      addHoverToCell();
    })

    $('.designerDashAll').on('click', function(){
      $('.designerDashCurated').css({
        backgroundColor: "#EBEBE9"
        ,borderTop: "0px solid #EFEEEC"
        ,borderLeft: '0px solid #EFEEEC'
        ,borderRight: '0px solid #EFEEEC'

      })
      $('.designerDashActive').css({
        backgroundColor: "#FEFDFA"
        ,borderTop: "1px solid #EFEEEC"
        ,borderLeft: '1px solid #EFEEEC'
        ,borderRight: '1px solid #EFEEEC'

      })
      self.curatedToggleCounter = 'active';
      toggleActive();
      addHoverToCell();
    })

    $()

    /////////////////////////////
    /////////Cell Hover effect///

    function addHoverToCell(){
      /////create mouseenter event listener to cause frontend changes
      $('.projectCellImage').on('mouseenter', function(evt){
        var $hoverTarget = $(evt.target);
        $hoverTarget.css({
          opacity: 0.5
        })
        ////////
        if(self.curatedToggleCounter == 'active'){
          var orderType = "Order";
        }
        else {
          var orderType = "Re-order";
        }
        ////we drill up in order to get the parent, so we can append the html buttons to it
        var parentContainer = $hoverTarget.parent().parent()[0];
        $(parentContainer).prepend(
          "<div class='projectCellHoverContainer' id='"+$(evt.target)[0].id+"'>"+
            '<div class="projectCellButtonSample">Request A Sample'+
            '</div>'+
            '<div class="projectCellButtonOrder">Place an '+orderType+'</div>'+
            '<div class="projectCellMore">Learn More</div>'+
          "</div>"
        )
        $('.projectCellMore').on('click', function(evt){
          var productId = $(evt.target)[0].parentNode.id;
          console.log(productId);
          window.location.hash = "#/view/product/"+productId;
        })
        ////activate purchase modal on click
        clickPurchaseModal($('.projectCellButtonOrder'));
        $('.projectCellButtonSample').on('click', function(evt){
          var productId = $(evt.target)[0].parentNode.id;
          console.log(productId);
          $('.bodyview').prepend(
            "<div class='invisModal'>"+
              "<div class='orderSampleModalContainer'>"+
                "<div class='orderSampleDelete'><i class='fa fa-times'></i></div>"+
                "<div class='orderSampleModalTextBox'>"+
                  "<h2>Order Free Sample</h2>"+
                  "<p>Before We Send a Sample, We Need Some Information<p>"+
                  "<p><p>"+
                  "<h4>One Sample Product</h4>"+
                "</div>"+
                "<div class='orderSampleModalInputBox'>"+
                  "<input type='text' placeholder='Full Name' class='sampleName'>"+
                  "<input type='text' placeholder='Company Name' class='sampleCompany'>"+
                  "<input type='text' placeholder='Address' class='sampleAddress'>"+
                  "<input type='text' placeholder='State' class='sampleState'>"+
                  "<input type='text' placeholder='Zip Code' class='sampleZip'>"+
                  "<input type='text' placeholder='Phone Number' class='samplePhone'>"+
                  "<div class='submitSampleModal' id='"+productId+"'>"+
                    "Order Sample"+
                  "</div>"+
                "</div>"+
              "</div>"
          )
          ///////////////////////////////////////
          //////begin events for the sample modal
          $('.orderSampleDelete').on('click', function(){
            console.log('deleting');
            $('.invisModal').remove();
          })
          $('.invisModal').on('click', function(evt){
            if($(evt.target)[0].classList[0] == "invisModal"){
              $('.invisModal').remove();
            }
          })
          ///////we change the status on the product
          $('.submitSampleModal').on('click', function(){
            if($('.sampleName').val() == "" || $('.sampleCompany').val() == "" || $('.sampleAddress').val() == '' || $('.sampleState').val() == '' || $('.sampleZip').val() == '' || $('.samplePhone').val() == ''){
              alert('missing a field')
            }
            else {
              $http({
                method: "POST"
                ,url: "/api/product/update"
                ,data: {projectId: productId, status: "sampleRequested"}
              })
              .then(function(updatedProd){
                console.log(updatedProd);
                $http({
                  url: '/api/new/sample'
                  ,method: "POST"
                  ,data: {requesterId: self.buyerId, productId: updatedProd.data._id, status: "sampleRequest"}
                })
                .then(function(updatedSample){
                  //////now we need to update the user's array of samples requsted
                  console.log(updatedSample);
                  console.log(self.buyerId);
                  $http({
                    method: "POST"
                    ,url: "/api/users/update"
                    ,data: {userId: self.buyerId, samplesRequested: updatedProd.data._id}
                  })
                  .then(function(updatedUser){
                    console.log(updatedUser);
                    self.userSamples.push(updatedProd.data._id);
                    console.log(self.userSamples);
                  })
                $('.invisModal').remove();
                  window.location.reload();
                })
              })
            }
          })
          //////////submit the sample request, changing the product's status
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
          loadFilteredList("colors", color, self.alreadyCurated);
        }
        else if(self.curatedToggleCounter == 'curated'){
          loadFilteredList("colors", color, self.boughtProducts);
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
          loadFilteredList("productType", type, self.alreadyCurated);

        }
        else if(self.curatedToggleCounter == 'curated'){
          loadFilteredList("productType", type, self.boughtProducts);
          loadCorrectHoverState();
        }
      })
    })

function loadCorrectHoverState(){
  ////we drill up in order to get the parent, so we can append the html buttons to it
  var parentContainer = $hoverTarget.parent().parent()[0];
  $(parentContainer).prepend(
    "<div class='projectCellHoverContainer' id='"+$(evt.target)[0].id+"'>"+
      '<div class="projectCellButtonSample">Request A Sample'+
      '</div>'+
    "</div>"
  )
}

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
          loadFilteredList("fabrics", fabric, self.alreadyCurated);
        }
        else if(self.curatedToggleCounter == 'curated'){
          loadFilteredList("fabrics", fabric, self.boughtProducts);
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
          loadFilteredList("seasons", season, self.alreadyCurated);
        }
        else if(self.curatedToggleCounter == 'curated'){
          loadFilteredList("seasons", season, self.boughtProducts);
        }
      })
    })

    ////End Filtering///////////////
    ////////////////////////////////

    // logout button functionality
    $('.logoutButton').on('click', function(){
      window.localStorage.hofbToken = "";
      window.location.hash = "#/designer/loginportal"
    })

    ///////////////////////
    //////load collections/
    function loadCollection(collections){
      self.collectionCounter = false;///so that we only load collections once
      for (var i = 0; i < collections.length; i++) {

        $('.designerDashCollectionDropdown').append(
          '<div class="designerDashCollectionCell" id="'+collections[i]+'">'+
            // "<p>"+
            collections[i]+
            // "</p>"+
          "</div>"
        )
      }
      $('.designerDashCollectionCell').on('mouseenter', function(evt){
        var color = $(evt.target).css('backgroundColor');
        if( color != 'rgb(28, 28, 28)'){
          $($(evt.target)[0]).css({
              backgroundColor: '#BDBDBD'
          })
        }
      })
      $('.designerDashCollectionCell').on('mouseleave', function(evt){
        var color = $(evt.target).css('backgroundColor');
        if( color != 'rgb(28, 28, 28)'){
          $($(evt.target)[0]).css({
            backgroundColor: 'white'
            ,color: "black"
          })
        }
      })
      $('.designerDashCollectionCell').on('click', function(evt){
        var collections = $('.designerDashCollectionCell');
        for (var i = 0; i < collections.length; i++) {
          $(collections[i]).css({
            backgroundColor: 'white'
            ,color: "black"
          })
        }
        var collectionValue = $($(evt.target)[0])[0].id;
        $($(evt.target)[0]).css({
          backgroundColor: "#1C1C1C"
          ,color: 'white'
        })
        if(self.curatedToggleCounter == 'active'){
          if(collectionValue == 'All'){
            $('.designerDashList').html("");
            loadProjects(loadInitialList, addHoverToCell);
          }
          else {
            $('.designerDashList').html("");
            loadFilteredList('collections', collectionValue, self.alreadyCurated);
          }
        }
        else if(self.curatedToggleCounter == 'sample'){
          if(collectionValue == 'All'){
            $('.designerDashList').html("");
            loadSampleList();
          }
          else {
            $('.designerDashList').html("");
            loadFilteredList('collections', collectionValue, self.boughtProjects);
          }
        }

      })
    }
    //end load collections/
    ///////////////////////


    //////function to load modal which allows buyer to make a purchase
    function clickPurchaseModal($element){
      $element.on('click', function(evt){
        $('.bodyview').append(
          "<div class='purchaseModal'>"+
            '<div class="purchaseHolder">'+
              '<div class="purchaseCloseModal fa fa-times">'+
              "</div>"+
              '<div class="purchaseStatistics">'+
                '<div class="col-xs-3 purchaseStat">'+
                  "<p class='purchaseStatTop'>"+
                    'Total Items'+
                  "</p>"+
                  "<p class='purchaseStatTotal purchaseStatBottom'>"+
                    '0'+
                  '</p>'+
                "</div>"+
                '<div class="col-xs-3 purchaseStat">'+
                  "<p class='purchaseStatTop'>"+
                    'Order Total'+
                  "</p>"+
                  "<p class='purchaseStatBottom purchaseStatCost'>"+
                    '$00'+
                  "</p>"+
                "</div>"+
                '<div class="col-xs-3 purchaseStat">'+
                  "<p class='purchaseStatTop'>"+
                    'Price per Item'+
                  "</p>"+
                  "<p class='purchaseStatBottom'>"+
                    "$25/item"+
                  "</p>"+
                "</div>"+
                '<div class="col-xs-3 purchaseStat">'+
                  "<p class='purchaseStatTop'>"+
                    'Turnaround'+
                  "</p>"+
                  "<p class='purchaseStatBottom'>"+
                    '20 days'+
                  "</p>"+
                "</div>"+
              "</div>"+
              '<div class="purchaseSelectionHolder">'+
                "<p class='purchaseOne'>"+
                  '1) How Many?'+
                '</p>'+
                "<p class='purchaseOneContent'>"+
                  "minimum order is 250 with price break at quantities"+
                "</p>"+
                '<div class="purchaseTotalSliderContainer">'+
                  "<span class='purchaseTotalSliderText col-xs-2'>Total: </span>"+
                  "<div class='purchaseTotalSlider col-xs-9' id='slider'></div>"+
                  "<span class='col-xs-1'>5000</span>"+
                  "<p class='purchaseOther'>"+
                    'Larger Quantities are Available Here'+
                  '</p>'+
                "</div>"+
                '<div class="purchaseColorsContainer">'+
                  "<p class='purchaseOne'>"+
                    "2) Choose Your Color Options"+
                  "</p>"+
                  "<p class='purchaseOneContent'>"+
                    "Sizing charts are available for download: Sizing Charts"+
                  "</p>"+
                  '<div class="purchaseColorRow"></div>'+
                '</div>'+
                '<div class="purchaseSizesContainer">'+
                  '<div class="row">'+
                    '<div class="col-xs-8">'+
                      "<p class='purchaseOne'>"+
                        '3) Choose Your Sizing for Each Color'+
                      "</p>"+
                      "<p class='purchaseOneContent'>"+
                        "sizing charts are available for download: Sizing Charts"+
                      "</p>"+
                    "</div>"+
                    '<div class="col-xs-4">'+
                      "<span class='purchaseTotalRemaining'></span>"+
                      "<span>Items Remaining</span>"+
                    "</div>"+
                  "</div>"+
                  '<div class="purchaseSizeSliders">'+
                    '<div class="purchaseSizeSliderHolder row">'+
                      '<div class="purchaseSizeName col-xs-2">'+
                        "<p>"+
                          "Extra Small:"+
                        "</p>"+
                      "</div>"+
                      '<div class="xsSlider purchaseSizeSlider col-xs-8" ></div>'+
                      '<div class="col-xs-1">0</div>'+
                    '</div>'+
                    '<div class="purchaseSizeSliderHolder row">'+
                      '<div class="purchaseSizeName col-xs-2">'+
                        '<p>'+
                          'Small:'+
                        '</p>'+
                      '</div>'+
                      '<div class="smSlider purchaseSizeSlider col-xs-8"></div>'+
                      '<div class="col-xs-1">0</div>'+
                    '</div>'+
                    '<div class="purchaseSizeSliderHolder row">'+
                      '<div class="purchaseSizeName col-xs-2">'+
                        '<p>'+
                          'Medium:'+
                        '</p>'+
                      '</div>'+
                      '<div class="mdSlider purchaseSizeSlider col-xs-8"></div>'+
                      '<div class="col-md-1">0</div>'+
                    '</div>'+
                    '<div class="purchaseSizeSliderHolder row">'+
                      '<div class="purchaseSizeName col-xs-2">'+
                        '<p>'+
                          'Large:'+
                        '</p>'+
                      '</div>'+
                      '<div class="lgSlider purchaseSizeSlider col-xs-8"></div>'+
                      '<div class="col-lg-1">0</div>'+
                    '</div>'+
                    '<div class="purchaseSizeSliderHolder row">'+
                      '<div class="purchaseSizeName col-xs-2">'+
                        '<p>'+
                          'Extra Large:'+
                        '</p>'+
                      '</div>'+
                      '<div class="xlSlider purchaseSizeSlider col-xs-8"></div>'+
                      '<div class="col-xs-1">  0</div>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
              '</div>'+
              '<div class="purchaseOrderButton">Order</div>'+
            '</div>'+
          "</div>"
        )
        $('.purchaseOrderButton').on('mouseenter', function(){
          $('.purchaseOrderButton').css({
            border: "5px solid #999"
            ,opacity: 0.4
            ,fontSize: '19px'
          })
          $('.purchaseOrderButton').html("COMING SOON");
        })
        $('.purchaseOrderButton').on('mouseleave', function(){
          $('.purchaseOrderButton').css({
            border: ""
            ,opacity: 1
            ,fontSize: '24px'
          })
          $('.purchaseOrderButton').html("ORDER");
        })
        activatePurchaseSliders();
        var prodId = $($(evt.target)[0].parentNode)[0].id;
        addColorsToOrder(prodId);
        console.log($($(evt.target)[0].parentNode)[0].id);
        $('.purchaseCloseModal').on('click', function(){
          $('.purchaseModal').remove();
        })
        $('.purchaseModal').on('click', function(evt){
          console.log('yoyoy');
          console.log($(evt.target));
          if($(evt.target)[0].classList[0] == "purchaseModal"){
            $('.purchaseModal').remove();
          }
        })
        /////////function to collect and submit purchase

      })
    }
    /////start of navbar dropdown logic/////////////
    ////////////////////////////////////////////////
    $(".dropbtn").on('click', function(){
      console.log('dropbtn is working');
            myFunction();
            // location.reload();
      });
      $('.navTitle').on('click', function(){
        window.location.hash = "#/buyer/dashboard";
      });
      $('#navBarEnvelopeIcon').on('click', function(){
        ///////////////////////////////////
        ///////messages temporary popup///
        $('.bodyview').prepend(
            "<div class='messageMessageContainer'>"+
              "<h3>Coming Soon</h3>"+
              "<div class='messageMessageDescription'>"+
                "<h4>Feedback on your designs is an important part of your experience at HOFB. We are in the process of providing a platform for real communication with our professional fashion experts, please check back soon."+
              "</div>"+
              "<div class='messageMessageButton'>"+
                "BACK TO HOFB"+
              "</div>"+
            "</div>"
        )
        // window.location.hash = "#/messages";
        $('body').keypress(function(evt){
          if($('.messageMessageContainer') && $(evt)[0].charCode == 13){
            $('.messageMessageContainer').remove();
          }
        });
        $('.messageMessageButton').on('click', function(){
          $('.messageMessageContainer').remove();
        })
      })

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

    /////////////////////////////////////////////////
    /////////////logic for favorites////////////////
    function loadFavorites(){
      if(self.curatedToggleCounter == 'favorites'){

      }
      else {
        var buyerId = self.buyerId;
        console.log(buyerId);
        $('.designerDashList').html('');
        console.log('hettin');
        $http({
          method: "GET"
          ,url: "/api/users/"+buyerId
        })
        .then(function(user){
          console.log(user);
          self.allFavorites = [];
          var allFavorites = [];
          for (var i = 0; i < user.data.favorites.length; i++) {
            console.log(user.data.favorites[i]);
            if(user.data.favorites[i] != null){
              $http({
                method: 'GET'
                ,url: "/api/product/"+user.data.favorites[i]
              })
              .then(function(fave){
                allFavorites.push(fave.data);
                self.allFavorites = allFavorites;
                console.log(self.allFavorites);
                var dataType = $('.dashDataType');
                dataType.text('Curated, fed to your Tier');
                $('.designerDashList').append(
                  "<div class='col-md-4 col-xs-12 projectCell'>"+
                    "<div class='projectCellInner'>"+
                      "<div class='projectCellImageHolder'>"+
                        "<img class='projectCellImage' id='"+fave.data._id+"'"+
                      "src='"+fave.data.images[0]+"'>"+
                      "</div>"+
                      "<div class='projectCellMinis' id='mini"+fave.data._id+"'>"+
                      "</div>"+
                      "<div class='projectCellContent'>"+
                        "<span class='glyphicon glyphicon-heart projectCellHeart boomHeart"+fave.data._id+"' id='"+fave.data._id+"'></span>"+
                        "<p class='projectCellContentName'>"+fave.data.name+"</p>"+
                        "<p class='projectCellContentTime'>"+fave.data.TimeSinceCreation+"</p>"+
                      "</div>"+
                    "</div>"+
                  "</div>"
                  )
                  var allImages = fave.data.images;
                  for (var k = 0; k < allImages.length; k++) {
                    $('#mini'+fave.data._id).append(
                      "<img src='"+allImages[k]+"' class='projectCellMiniImage'/>"
                    )
                  }
                  $('.boomHeart'+fave.data._id).addClass('favorited');
                  $('.boomHeart'+fave.data._id).css({
                    color: "#292D36"
                  })
                  // moveDashMinis();
                  addFavorites(self.buyerId)
                  addHoverToCell();
                  self.curatedToggleCounter = 'favorites'
              })
            }
          }
        })
      }
    }

    $('.designerDashFavorites').on('click', loadFavorites);

    function addFavorites(buyerId){
      $('.projectCellHeart').on('click', function(evt){
        var favorite = $(evt.target)[0].id;
        console.log(favorite);
        console.log('old favorite');
        if($(evt.target).hasClass('favorited')){
          $(evt.target).removeClass('favorited');
          $(evt.target).css({
            color: "#CCCCCC"
          })
          $http({
            method: "POST"
            ,url: "/api/users/update"
            ,data: {userId: buyerId, removeFavorite: favorite}
          })
          .then(function(updatedUser){
            console.log(updatedUser);
          })
        }
        else {
          console.log('new favorite');
          $(evt.target).addClass('favorited');
          console.log(favorite);
          $(evt.target).css({
            color: "#292D36"
          })
          $http({
            method: "POST"
            ,url: "/api/users/update"
            ,data: {userId: self.buyerId, favorite: favorite}
          })
          .then(function(updatedUser){
            console.log(updatedUser);
          })
        }
      })
    }
    ///////////end favorites////////////////////////
    ////////////////////////////////////////////////
    // function moveDashMinis() {
    //   //////We create the logic for the mini photos. these run on an interval, that switches to the photos being move (margin-left being added)
    //   setInterval(function(){
    //     if(self.intervalCounter == 0){
    //       self.miniMarg = 0;
    //     }
    //     else {
    //       var imageCount = $(self.activeMinis)[0].children.length;
    //       var totalLengthPhotos = ((imageCount+.3)*64);
    //       var viewWindow = $('.projectCellImageHolder').width();
    //       var maxMovement = (-totalLengthPhotos) + viewWindow;
    //       if(self.miniMarg >= maxMovement && maxMovement < 0){
    //         $(self.activeMinis).css({
    //           marginLeft: self.miniMarg
    //         })
    //         self.miniMarg += -1;
    //       }
    //       else {
    //       }
    //     }
    //   }, 20)
    //   $('.projectCellMinis').on('mouseenter', function(evt){
    //     self.intervalCounter = 1;
    //     if($(evt.target)[0].classList[0] == 'projectCellMinis'){
    //       self.activeMinis = $(evt.target)[0];
    //     }
    //     else {
    //       self.activeMinis = $(evt.target)[0].parentNode;
    //     }
    //   })
    //   $('.projectCellMinis').on('mouseleave', function(){
    //     self.intervalCounter = 0;
    //     self.activeMinis = "none";
    //   })
    // }
  /////end admin controller
  ////////////////////////
  ////////////////////////
  }
