angular.module('dashController', ['allProjectsFactory'])

  .controller('dashCtrl', dashCtrl)

  dashCtrl.$inject = ['$http', 'allProjects'];
  function dashCtrl($http, allProjects){
    var self = this;
    //////counter to keep track of active or curated list being shown
    self.curatedToggleCounter = 'active'
    self.collectionCounter = true;///so we only load collections once

    /////////////////////////////////////////////////////
    /////////onload event to add initial list of repeated projects
    function loadProjects(callback, arg){
      ///////decode user to pull data
      $http({
        method: "GET"
        ,url: '/api/checkstatus/'+ window.localStorage.hofbToken
      })
      .then(function(decodedToken){
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
          for (var i = 0; i < allProjects.length; i++) {
            if(allProjects[i].status == "saved"){
              allProjectsSaved.push(allProjects[i]);
            }
            else if(allProjects[i].status == "submitted to curator" || "curated"){
              curatedProjectsArray.push(allProjects[i]);
            }
            self.allProjects = allProjectsSaved;
            self.curatedProjects = curatedProjectsArray;
          }
          //////add time-since-creation field
          var collectionName = ["All"];
          for (var i = 0; i < self.allProjects.length; i++) {
            function timeSince(){
              var nowDate = new Date();
              var timeProj = self.allProjects[i].timestamp;
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
            self.allProjects[i].TimeSinceCreation = timeSince();
            /////get all collections
            for (var j = 0; j < self.allProjects[i].collections.length; j++) {
              collectionName.push(self.allProjects[i].collections[j])
            }
            self.allCollectionsRaw = collectionName;
          }
          //////must make sure there are no duplicates
          self.allCollections = [];
          for (var i = 0; i < self.allCollectionsRaw.length; i++) {
            var passBool = true;
            for (var j = 0; j < self.allCollections.length; j++) {
              if(self.allCollectionsRaw[i] == self.allCollections[j]){
                passBool = false;
              }
            }
            if(passBool && self.allCollectionsRaw[i] != ""){
              self.allCollections.push(self.allCollectionsRaw[i])
            }
          }
          self.allCollections;
          if(self.collectionCounter){
            loadCollection(self.allCollections);
          }
          callback(arg)
        })
      })
    }

    /////load all active projects into the dashboard view
    function loadInitialList(arg){
      var dataType = $('.dashDataType');
      dataType.text('Active Products, which have not been sent to curation');
      for (var i = 0; i < self.allProjects.length; i++) {
        if(((i+1)%6) != 0 || i == 0){
          $('.designerDashList').append(
            "<div class='col-md-2 col-xs-12 projectCell'>"+
              "<div class='projectCellInner'>"+
                "<div class='projectCellImageHolder'>"+
                  "<img class='projectCellImage' id='"+self.allProjects[i]._id+"'"+
                "src='"+self.allProjects[i].images[0]+"'>"+
                "</div>"+
                "<div class='projectCellContent'>"+
                  "<p>"+self.allProjects[i].TimeSinceCreation+"</p>"+
                  "<p>"+self.allProjects[i].name+"</p>"+
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
      $('.designerDashList').append(
        "<div class='col-md-2 col-xs-12 projectCell projectCellNew'>"+
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
        window.location.hash = "#/create/project";
        window.location.reload();
      })
      arg();
    }
    ///////will set self.allProjects as all our projects
    loadProjects(loadInitialList, addHoverToCell);

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
      for (var i = 0; i < self.curatedProjects.length; i++) {
        if(((i+1)%6) != 0 || i == 0){
          $('.designerDashList').append(
            "<div class='projectCell col-md-2 col-xs-12'>"+
              "<div class='projectCellInner'>"+
                "<div class='projectCellImageHolder'>"+
                  "<img class='projectCellImage' src='"+self.curatedProjects[i].images[0]+"'>"+
                "</div>"+
                "<div class='projectCellContent'>"+
                  "<p>"+self.curatedProjects[i].TimeSinceCreation+"</p>"+
                  "<p>"+self.curatedProjects[i].name+"--curated</p>"+
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
      $('.designerDashList').append(
        "<div class='col-md-2 col-xs-12 projectCell projectCellNew'>"+
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
        window.location.hash = "#/create/project";
        window.location.reload();
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
      $('.designerDashList').append(
        "<div class='col-md-2 col-xs-12 projectCell projectCellNew'>"+
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
          opacity: 0.5
        })
        ////we drill up in order to get the parent, so we can append the html buttons to it
        var parentContainer = $hoverTarget.parent().parent()[0];
        $(parentContainer).prepend(
          "<div class='projectCellHoverContainer'>"+
            "<div class='projectCellTrash'>X </div>"+
            '<div class="projectCellButton" id="projectCellButtonEdit">Edit</div>"'+
          "</div>"
        )
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
              "<button class='deleteButton'>No</button>"+
              "<button id='"+productId+"' class='deleteButton'>Yes</button>"+
            "</div>"
          )
          $('.deleteButton').on('click', function(evt){
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
          loadFilteredList("colors", color, self.allProjects);
        }
        else if(self.curatedToggleCounter == 'curated'){
          loadFilteredList("colors", color, self.curatedProjects);
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
          loadFilteredList("productType", type, self.allProjects);
        }
        else if(self.curatedToggleCounter == 'curated'){
          loadFilteredList("productType", type, self.curatedProjects);
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
          loadFilteredList("fabrics", fabric, self.allProjects);
        }
        else if(self.curatedToggleCounter == 'curated'){
          loadFilteredList("fabrics", fabric, self.curatedProjects);
        }
      })
    })

    ////////filter dropdown frontend html logic
    $('.designerDashSeason').on('click', function(evt){
      console.log('season');
      $(evt.target).append(
        "<div class='seasonFilter'>"+
          "<div  id='filterSpring' class='seasonFilterCell col-xs-6'>"+
            "<img src='http://secretenergy.com/wp-content/uploads/2014/07/SOUL-WARS-shirt-21.jpg'>" +
          "</div>"+
          "<div  id='filterSummer' class='seasonFilterCell col-xs-6'>"+
            "<img src='https://bonobos-prod-s3.imgix.net/products/10163/original/PNT_Golf_Maide_HighlandPant_Blackwatch_category.jpg?1423867714&w=300&q=74&h=300&fit=crop'>" +
          "</div>"+
          "<div  id='filterFall' class='seasonFilterCell col-xs-6'>"+
            "<img src='http://www.kirnazabete.com/media/catalog/product/cache/1/image/300x/5e06319eda06f020e43594a9c230972d/1/1/11218940_5802764_1000/KirnaZabete-Dolce-and-Gabbana-Rose-Print-Dress-31.jpg'>" +
          "</div>"+
          "<div  id='filterWinter' class='seasonFilterCell col-xs-6'>"+
            "<img src='http://images.motorcycle-superstore.com/productimages/300/2016-dainese-womens-michelle-leather-jacket-mcss.jpg'>" +
          "</div>"+
        "</div>"
      )
      $('.seasonFilter').on('mouseleave', function(){
        $('.seasonFilter').remove();
      })

      $('.seasonFilterCell').on('click', function(evt){
        var season = $($(evt.target)[0].parentNode)[0].id.slice(6, 25);
        console.log(season);
        $('.designerDashList').html('');
        $('.seasonFilter').remove();
        console.log('yo');
        if(self.curatedToggleCounter == 'active'){
          loadFilteredList("seasons", season, self.allProjects);
        }
        else if(self.curatedToggleCounter == 'curated'){
          loadFilteredList("seasons", season, self.curatedProjects);
        }
      })
    })


    ////filter by productType
    // $('.designerDashProductType').change(function(evt){
    //   $('.designerDashList').html('');
    //   if(self.curatedToggleCounter == 'active'){
    //     loadFilteredList("productType", $('.designerDashProductType').val(), self.allProjects);
    //   }
    //   else if(self.curatedToggleCounter == 'curated'){
    //     loadFilteredList("productType", $('.designerDashProductType').val(), self.curatedProjects);
    //   }
    // })

    ////filter by color
    // $('.designerDashColor').change(function(){
    //   $('.designerDashList').html('');
    //   if(self.curatedToggleCounter == 'active'){
    //     loadFilteredList("colors", $('.designerDashColor').val(), self.allProjects);
    //   }
    //   else if(self.curatedToggleCounter == 'curated'){
    //     loadFilteredList("colors", $('.designerDashColor').val(), self.curatedProjects);
    //   }
    // })

    ////filter by fabric
    // $('.designerDashFabric').change(function(){
    //   $('.designerDashList').html('');
    //   if(self.curatedToggleCounter == 'active'){
    //     loadFilteredList("fabrics", $('.designerDashFabric').val(), self.allProjects);
    //   }
    //   else if(self.curatedToggleCounter == 'curated'){
    //     loadFilteredList("fabrics", $('.designerDashFabric').val(), self.curatedProjects);
    //   }
    // })

    ////filter by season
    $('.designerDashSeason').change(function(){
      $('.designerDashList').html('');
      if(self.curatedToggleCounter == 'active'){
        loadFilteredList("seasons", $('.designerDashSeason').val(), self.allProjects);
      }
      else if(self.curatedToggleCounter == 'curated'){
        loadFilteredList("seasons", $('.designerDashSeason').val(), self.curatedProjects);
      }
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
            collections[i]+
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


  /////end dash controller
  ////////////////////////
  ////////////////////////
  }
