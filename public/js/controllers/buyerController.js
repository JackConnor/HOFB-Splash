angular.module('buyerController', ['allProjectsFactory', 'checkPwFactory', 'getSwatchesFactory', 'getProductFactory'])

  .controller('buyerCtrl', buyerCtrl)

  buyerCtrl.$inject = ['$http', 'allProjects', 'checkPw', 'allSwatches', 'getProduct'];
  function buyerCtrl($http, allProjects, checkPw, allSwatches, getProduct){
    var self = this;
    //////counter to keep track of active or curated list being shown
    self.curatedToggleCounter = 'active'
    self.collectionCounter = true;///so we only load collections once
    // window.localStorage.checkPw = false;
    // checkPw.checkPassword();
    /////////////////////////////////////////////////////
    /////////onload event to add initial list of repeated projects

    //////////////////////////////////
    //////////////////////////////////
    ////Order Purchase Only///////////

    if(window.location.hash.split('/')[1] == 'purchase'){
      self.order = {
        totalItems: 0
        ,totalItemsDivided: {}
      }
      self.colorToggle = '';
      function addColorsToOrder(){
        var prodToBuy = window.location.hash.split('/')[2];
        getProduct(prodToBuy)
          .then(function(product){
            var allColors = product.data.colors;
            for (var i = 0; i < allColors.length; i++) {
              $('.purchaseColorRow').append(
                "<div class='purchaseColor' id='"+allColors[i]+"'>"+
                  allColors[i]+
                "</div>"
              )
              //////add color to the master array
              console.log(self.order);
              self.order.totalItemsDivided[allColors[i]] = {xs: 0, sm: 0, md: 0, lg: 0, xl: 0};
            }
            console.log(self.order.totalItemsDivided);
            console.log(self.order);
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
            })
          })
      }
      addColorsToOrder();

      /////////////////////////////////////////
      ////////////////////activate all sliders
      $('#slider').slider({
        max: 5000
      })

      $('#slider').on('slidechange', function(evt){
        var totalItems = $(evt.target).slider('value');
        $('.purchaseStatTotal').text(totalItems);
        self.order.totalItems = totalItems;
        console.log(self.order);
        $('.purchaseSizeSlider').slider('option', 'max', self.order.totalItems)
        returnRemaining();
      })

      $('.purchaseSizeSlider').slider({
        max: self.order.totalItems
      })

      $('.purchaseSizeSlider').on('slidechange', function(evt){
        var totalSizeItems = $(evt.target).slider('value');
        var itemColor = self.colorToggle;
        console.log(itemColor);
        var itemSize = $(evt.target)[0].classList[0].slice(0, 2);
        console.log(itemSize);
        console.log(totalSizeItems);
        self.order.totalItemsDivided[itemColor][itemSize] = totalSizeItems;
        console.log(self.order);
        $(evt.target)[0].nextElementSibling.innerText = totalSizeItems;
        returnRemaining();
      })

      /////function to return value of all items remaining
      function returnRemaining(){
        var getAllSliderFunc = function(){
          var totalFromSizes = 0;
          for (var i = 0; i < self.order.totalItemsDivided.length; i++) {
            ///////now we have to get each size from each color, so we do another iteration
            for (var j = 0; j < self.order.totalItemsDivided[i].sizes.length; j++) {
              totalFromSizes += self.order.totalItemsDivided[i].sizes[j];
            }
          }
          console.log(totalFromSizes);
          return totalFromSizes;
        }
        var sizeItems = getAllSliderFunc();
        console.log();
        $('.purchaseTotalRemaining').text(self.order.totalItems - sizeItems);
      }
      /////////activate all sliders/////////////
      //////////////////////////////////////////
    }

    ////Order Purchase Only///////////
    //////////////////////////////////
    //////////////////////////////////
    else {

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
            window.location.hash = '#/signin'
          }
          $http({
            method: "GET"
            ,url: '/api/buyer/products/'+tier
          })
          .then(function(products){
            var allProjects = products.data;
            var allProjectsAlreadyCurated = [];
            for (var i = 0; i < allProjects.length; i++) {
              if(allProjects[i].status == "curated"){
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
      }

      /////load all active projects into the dashboard view
      function loadInitialList(arg){
        console.log(self.alreadyCurated);
        var dataType = $('.dashDataType');
        dataType.text('Curated, fed to your Tier');
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
                  "<span class='glyphicon glyphicon-heart projectCellHeart'></span>"+
                  "<p class='projectCellContentName'>"+self.alreadyCurated[i].name+"</p>"+
                  "<p class='projectCellContentTime'>"+self.alreadyCurated[i].TimeSinceCreation+"</p>"+
                "</div>"+
              "</div>"
            )
            var allImages = self.alreadyCurated[i].images;
            console.log(allImages);
            for (var j = 0; j < allImages.length; j++) {
              $('#mini'+i).append(
                "<img src='"+allImages[j]+"' class='projectCellMiniImage'/>"
              )
            }
        }
        arg();
      }
      ///////will set self.allProjects as all our projects
      loadProjects(loadInitialList, addHoverToCell);

      ////function for appending active list
      function loadBoughtList(){
        var dataType = $('.dashDataType');
        dataType.text('Products which you have purchased');
        var buyerId = self.buyerId;
        for (var i = 0; i < self.boughtProducts.length; i++) {
          function timeSince(){
            var nowDate = new Date();
            var timeProj = self.boughtProducts[i].timestamp;
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
          self.boughtProducts[i].TimeSinceCreation = timeSince();
        }
        for (var i = 0; i < self.boughtProducts.length; i++) {
          if(((i+1)%6) != 0 || i == 0){
            $('.designerDashList').append(
              "<div class='projectCell col-md-2 col-xs-12'>"+
                "<div class='projectCellInner'>"+
                  "<div class='projectCellImageHolder'>"+
                    "<img class='projectCellImage' src='"+self.boughtProducts[i].images[0]+"'>"+
                  "</div>"+
                  "<div class='projectCellContent'>"+
                    "<p>"+self.boughtProducts[i].TimeSinceCreation+"</p>"+
                    "<p>"+self.boughtProducts[i].name+"--bought</p>"+
                  "</div>"+
                "</div>"+
              "</div>"
            )
          }
          else if (((i+1)%6) == 0 && i != 0){
            $('.designerDashList').append(
              "<div class='blankDiv projectCell col-md-2 col-xs-0'>"+
              "</div>"
            )
          }
        }
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
            if(((i+1)%6) != 0 || i == 0){
              $('.designerDashList').append(
                "<div class='projectCell col-md-2 col-xs-12'>"+
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
            else if (((i+1)%6) == 0 && i != 0){
              $('.designerDashList').append(
                "<div class='blankDiv projectCell col-md-2 col-xs-0'>"+
                "</div>"
              )
            }
          }
        //////end if statement for self.filtered
        }
        addHoverToCell();
        self.filteredProjects = [];
      }


      ///////////////////////////
      //////Toggle Logic/////////

      ////see all curated projects
      function toggleCurated(){
        $('.designerDashList').html('');
        loadBoughtList();
        $('.sectionTitle').text('listing all bought projects')
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
          backgroundColor: "#F9F7F5"
        })
        $('.designerDashActive').css({
          backgroundColor: "#EBEBE9"
        })
        self.curatedToggleCounter = 'curated';
        toggleCurated();
        addHoverToCell();
      })

      ////////toggle to active view
      $('.designerDashActive').on('click', function(){
        $('.designerDashCurated').css({
          backgroundColor: "#EBEBE9"
        })
        $('.designerDashActive').css({
          backgroundColor: "#F9F7F5"
        })
        self.curatedToggleCounter = 'active';
        toggleActive();
        addHoverToCell();
      })

      /////////////////////////////
      /////////Cell Hover effect///

      function addHoverToCell(){
        /////create mouseenter event listener to cause frontend changes
        $('.projectCellImage').on('mouseenter', function(evt){
          var $hoverTarget = $(evt.target);
          $hoverTarget.css({
            opacity: 0.5
          })
          ////we drill up in order to get the parent, so we can append the html buttons to it
          var parentContainer = $hoverTarget.parent().parent()[0];
          $(parentContainer).prepend(
            "<div class='projectCellHoverContainer' id='"+$(evt.target)[0].id+"'>"+
              '<div class="projectCellButtonSample">Request A Sample'+
              '</div>'+
              '<div class="projectCellButtonOrder">Place an Order</div>'+
            "</div>"
          )
          $('#projectCellButtonEdit').on('click', function(evt){
            var prodIdToUpdate = $($(evt.target)[0].parentNode)[0].id;
            $('.bodyview').prepend(
              '<div class="curatePopup">'+
                "<h2>Purchase or request a sample?</h2>"+
                "<br>"+
                '<button>no thanks</button>'+
                '<button class="addToPurchased bought" id="'+prodIdToUpdate+'">Purchase an order</button>'+
                '<button class="addToPurchased sample" id="'+prodIdToUpdate+'">Request a Sample</button>'+
              '</div>'
            )
            $('.addToPurchased').on('click', function(evt){
              var prodId = $(evt.target)[0].id;
              var purchaseType = $(evt.target)[0].classList[1];
              var purchaserInformation = [{"purchaserId": self.buyerId, "companyName":"Dummy Company"}]
              $http({
                method: "POST"
                ,url: "/api/product/update"
                ,data: {status: purchaseType, projectId: prodId, purchaserInformation: purchaserInformation}
              })
              .then(function(updatedProduct){
                if (updatedProduct) {
                  window.location.reload();
                }
              })
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
          console.log('yo');
          console.log(color);
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
        console.log('yoyoyo');
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
          console.log(type);
          $('.designerDashList').html('');
          $('.typeFilter').remove();
          console.log('yo');
          if(self.curatedToggleCounter == 'active'){
            loadFilteredList("productType", type, self.alreadyCurated);
          }
          else if(self.curatedToggleCounter == 'curated'){
            loadFilteredList("productType", type, self.boughtProducts);
          }
        })
      })

      ////////filter Fabric
      $('.designerDashFabric').on('click', function(evt){
        $('.colorFilter').remove();
        $('.typeFilter').remove();
        $('.fabricFilter').remove();
        $('.seasonFilter').remove();
        console.log('yoyoyo');
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
          console.log(fabric);
          $('.designerDashList').html('');
          $('.fabricFilter').remove();
          console.log('yo');
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
            console.log(' curated list');
            console.log(self.curatedProjects);
            loadFilteredList("seasons", season, self.boughtProducts);
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
          // console.log(evt.target);
          // console.log($($(evt.target)[0]));
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
          else if(self.curatedToggleCounter == 'curated'){
            if(collectionValue == 'All'){
              $('.designerDashList').html("");
              loadboughtList();
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
    }
  /////end admin controller
  ////////////////////////
  ////////////////////////
  }
