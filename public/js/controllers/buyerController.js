angular.module('buyerController', ['allProjectsFactory', 'checkPwFactory'])

  .controller('buyerCtrl', buyerCtrl)

  buyerCtrl.$inject = ['$http', 'allProjects', 'checkPw'];
  function buyerCtrl($http, allProjects, checkPw){
    var self = this;
    //////counter to keep track of active or curated list being shown
    self.curatedToggleCounter = 'active'
    self.collectionCounter = true;///so we only load collections once
    checkPw.checkPassword();
    /////////////////////////////////////////////////////
    /////////onload event to add initial list of repeated projects

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
        if(((i+1)%6) != 0 || i == 0){
          $('.designerDashList').append(
            "<div class='col-md-2 col-xs-12 projectCell'>"+
              "<div class='projectCellInner'>"+
                "<div class='projectCellImageHolder'>"+
                  "<img class='projectCellImage' id='"+self.alreadyCurated[i]._id+"'"+
                "src='"+self.alreadyCurated[i].images[0]+"'>"+
                "</div>"+
                "<div class='projectCellContent'>"+
                  "<p>"+self.alreadyCurated[i].TimeSinceCreation+"</p>"+
                  "<p>"+self.alreadyCurated[i].name+"</p>"+
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
            '<div class="projectCellButton" id="projectCellButtonEdit">Edit</div>"'+
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
      $(evt.target).append(
        "<div class='colorFilter'>"+
          "<div  id='filterRed' class='colorFilterCell col-xs-4'>"+
          "</div>"+
          "<div id='filterBlue' class='colorFilterCell col-xs-4'>"+
          "</div>"+
          "<div id='filterWhite' class='colorFilterCell col-xs-4'>"+
          "</div>"+
          "<div id='filterBlack' class='colorFilterCell col-xs-4'>"+
          "</div>"+
          "<div id='filterOrange' class='colorFilterCell col-xs-4'>"+
          "</div>"+
          "<div id='filterYellow' class='colorFilterCell col-xs-4'>"+
          "</div>"+
          "<div id='filterMagenta' class='colorFilterCell col-xs-4'>"+
          "</div>"+
          "<div id='filterAqua' class='colorFilterCell col-xs-4'>"+
          "</div>"+
          "<div id='filterGreen' class='colorFilterCell col-xs-4'>"+
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
      console.log('yoyoyo');
      $(evt.target).append(
        "<div class='typeFilter'>"+
          "<div  id='filterShirt' class='typeFilterCell col-xs-4'>"+
            "<img src='http://secretenergy.com/wp-content/uploads/2014/07/SOUL-WARS-shirt-21.jpg'>" +
          "</div>"+
          "<div  id='filterPants' class='typeFilterCell col-xs-4'>"+
            "<img src='https://bonobos-prod-s3.imgix.net/products/10163/original/PNT_Golf_Maide_HighlandPant_Blackwatch_category.jpg?1423867714&w=300&q=74&h=300&fit=crop'>" +
          "</div>"+
          "<div  id='filterDress' class='typeFilterCell col-xs-4'>"+
            "<img src='http://www.kirnazabete.com/media/catalog/product/cache/1/image/300x/5e06319eda06f020e43594a9c230972d/1/1/11218940_5802764_1000/KirnaZabete-Dolce-and-Gabbana-Rose-Print-Dress-31.jpg'>" +
          "</div>"+
          "<div  id='filterJacket' class='typeFilterCell col-xs-4'>"+
            "<img src='http://images.motorcycle-superstore.com/productimages/300/2016-dainese-womens-michelle-leather-jacket-mcss.jpg'>" +
          "</div>"+
          "<div  id='filterTee' class='typeFilterCell col-xs-4'>"+
            "<img src='http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=140393304'>" +
          "</div>"+
          "<div  id='filterSkirt' class='typeFilterCell col-xs-4'>"+
            "<img src='http://stylishcurves.com/wp-content/uploads/2014/01/burnt-orange-godet-skirt-300x300.jpg'>" +
          "</div>"+
          "<div  id='filterShorts' class='typeFilterCell col-xs-4'>"+
            "<img src='https://images.bigcartel.com/bigcartel/product_images/163340455/-/shorts-0175.jpg'>" +
          "</div>"+
          "<div  id='filterScarf' class='typeFilterCell col-xs-4'>"+
            "<img src='http://onwardpullzone.onwardreserve.netdna-cdn.com/media/catalog/product/cache/1/image/1800x/040ec09b1e35df139433887a97daa66f/o/r/or-camel-check-reversible-cashmere-scarf.jpg'>" +
          "</div>"+
          "<div  id='filterHat' class='typeFilterCell col-xs-4'>"+
            "<img src='http://ep.yimg.com/ay/oaklandraiders/oakland-raiders-girls-tailsweep-hat-3.jpg'>" +
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
      console.log('yoyoyo');
      $(evt.target).append(
        "<div class='fabricFilter'>"+
          "<div  id='filterSeersucker' class='fabricFilterCell col-xs-4'>"+
            "<img src='http://cdn.shopify.com/s/files/1/0400/5101/products/FFseernavy_grande.jpg?v=1437514918'>" +
          "</div>"+
          "<div  id='filterPleather' class='fabricFilterCell col-xs-4'>"+
            "<img src='http://i.ebayimg.com/images/g/EB8AAOSwk5FUvXtS/s-l300.jpg'>" +
          "</div>"+
          "<div  id='filterDockers' class='fabricFilterCell col-xs-4'>"+
            "<img src='https://dtpmhvbsmffsz.cloudfront.net/posts/2015/05/08/554d8bdbbcd4a73a1d00565b/s_554d8bdbbcd4a73a1d00565c.jpg'>" +
          "</div>"+
          "<div  id='filterCamo' class='fabricFilterCell col-xs-4'>"+
            "<img src='http://wiganhydroprinting.co.uk/wp-content/uploads/2014/04/clear-camo-300x3001.jpg'>" +
          "</div>"+
          "<div  id='filterVeneer' class='fabricFilterCell col-xs-4'>"+
            "<img src='http://www.arrow.gb.net/images/pages/finish-colours/material-finishes/veneer/walnut-r.jpg'>" +
          "</div>"+
          "<div  id='filterNylon' class='fabricFilterCell col-xs-4'>"+
            "<img src='http://static1.squarespace.com/static/52965deee4b0f580c1fe0b7d/52c88375e4b03b30610b4a0a/52c8845be4b0268360ddfb8c/1388874157418/LightRoyalNylon.jpg?format=300w'>" +
          "</div>"+
          "<div  id='filterLeather' class='fabricFilterCell col-xs-4'>"+
            "<img src='https://s-media-cache-ak0.pinimg.com/736x/8b/c3/bf/8bc3bf43297bc2bc9983996ee8ed4cdb.jpg'>" +
          "</div>"+
          "<div  id='filterCotton' class='fabricFilterCell col-xs-4'>"+
            "<img src='http://d6lw7to1547c3.cloudfront.net/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/308744.jpg'>" +
          "</div>"+
          "<div  id='filterDenim' class='fabricFilterCell col-xs-4'>"+
            "<img src='https://www.shoponeonline.com/wp-content/uploads/denim-swatch.png'>" +
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
      $(evt.target).append(
        "<div class='seasonFilter'>"+
          "<div  id='filterSpring' class='seasonFilterCell col-xs-6'>"+
            "<img src='http://organically.server276.com/blog/wp-content/uploads/2014/03/18_spring-300x300.jpg'>" +
          "</div>"+
          "<div  id='filterSummer' class='seasonFilterCell col-xs-6'>"+
            "<img src='http://r2rdesigns.com/wp-content/uploads/2014/06/summer-beach-hd-desktop-wallpaper-300x300.jpg'>" +
          "</div>"+
          "<div  id='filterFall' class='seasonFilterCell col-xs-6'>"+
            "<img src='http://img.thrfun.com/img/083/036/autumn_trees_s1.jpg'>" +
          "</div>"+
          "<div  id='filterWinter' class='seasonFilterCell col-xs-6'>"+
            "<img src='http://pixelshok.com/wp-content/uploads/2011/01/Winter-300x300.png'>" +
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

  /////end admin controller
  ////////////////////////
  ////////////////////////
  }
