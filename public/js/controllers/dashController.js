angular.module('dashController', ['allProjectsFactory'])

  .controller('dashCtrl', dashCtrl)

  dashCtrl.$inject = ['$http', 'allProjects'];
  function dashCtrl($http, allProjects){
    var self = this;

    /////////////////////////////////////////////////////
    /////////onload event to add initial list of repeated projects

    function loadProjects(callback, arg){
      ///////decode user to pull data
      console.log(window.localStorage.hofbToken);
      $http({
        method: "GET"
        ,url: '/api/checkstatus/'+ window.localStorage.hofbToken
      })
      .then(function(decodedToken){
        console.log(decodedToken);
        $http({
          method: "GET"
          ,url: '/api/'+decodedToken.data.name+'/products'
        })
        .then(function(products){
          var allProjects = products.data;
          console.log(allProjects);
          var allProjectsSaved = [];
          var curatedProjectsArray = [];
          for (var i = 0; i < allProjects.length; i++) {
            if(allProjects[i].status == "saved"){
              console.log('got on ');
              console.log(allProjects[i]);
              allProjectsSaved.push(allProjects[i]);
            }
            else if(allProjects[i].status == "submitted to curator"){
              curatedProjectsArray.push(allProjects[i]);
            }
            self.allProjects = allProjectsSaved;
            self.curatedProjects = curatedProjectsArray;
          }
          console.log(self.allProjects);
          //////add time-since-creation field
          for (var i = 0; i < self.allProjects.length; i++) {
            function timeSince(){
              var nowDate = new Date();
              var timeProj = self.allProjects[i].timestamp;
              console.log(timeProj);
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
          }
          console.log(self.allProjects);

          var collectionName = ["All"];
          self.allCollectionsRaw = collectionName;
          //////must make sure there are no duplicates
          self.allCollections = [];
          for (var i = 0; i < self.allCollectionsRaw.length; i++) {
            var passBool = true;
            for (var j = 0; j < self.allCollections.length; j++) {
              if(self.allCollectionsRaw[i] == self.allCollections[j]){
                console.log('double');
                passBool = false;
              }
            }
            if(passBool){
              self.allCollections.push(self.allCollectionsRaw[i])
            }
          }
          console.log(self.allCollections);
          callback(arg)
        })
      })
    }

    /////load all active projects into the dashboard view
    function loadInitialList(arg){
      for (var i = 0; i < self.allProjects.length; i++) {
        if((i%5) != 0 || i == 0){
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
        else if ((i%5) == 0 && i != 0){
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
      for (var i = 0; i < self.curatedProjects.length; i++) {
        $('.designerDashList').append(
          "<div class='projectCell col-md-2 col-xs-12'>"+
            "<div class='projectCellInner'>"+
              "<div class='projectCellImageHolder'>"+
                "<img src='"+self.curatedProjects[i].images[0]+"'>"+
              "</div>"+
              "<div class='projectCellContent'>"+
                "<p>"+self.curatedProjects[i].name+"--curated</p>"+
              "</div>"+
            "</div>"+
          "</div>"
        )
      }
    }

    ////function for appending filtered lists from dropdown in realtime
    function loadFilteredList(filterType, filterValue){
      console.log(filterType);
      console.log(filterValue);
      var productTypeData = self.allProjects[1];
      var productType = productTypeData[filterType];
      console.log(productType);
      console.log(typeof(productType));
      var filteredArray = [];
        //////check for filters with one value versus many
      if(typeof(productType) == 'string'){
        for (var i = 0; i < self.allProjects.length; i++) {
          var productTypeData = self.allProjects[i];
          console.log(productTypeData);
          var productType = productTypeData[filterType];
          console.log(typeof(productType));
          console.log(productType);
          ///adding for loop here
          if(filterValue == productType){
            console.log(filterValue +" string should equal "+productType+" for this one to work");
            filteredArray.push(self.allProjects[i]);
          }
          self.filteredProjects = filteredArray;
          console.log(self.filteredArray);
          ////ending for loop
          }
        }
        ////filter for attributes that come in arrays
        else if(typeof(productType) == 'object'){
          for (var i = 0; i < self.allProjects.length; i++) {
            var productTypeDataArray = self.allProjects[i];
            var productTypeArray = productTypeDataArray[filterType];
            console.log(productTypeArray);
            console.log(productTypeArray.length);
            console.log(filterValue);
            for (var j = 0; j < productTypeArray.length; j++) {
              console.log(productTypeArray[j]);
              console.log(filterValue);
              if(productTypeArray[j] == filterValue){
                console.log(filterValue +" object should equal "+productTypeArray[j]+" for this one to work");
                console.log(filteredArray);
                filteredArray.push(self.allProjects[i]);
                self.filteredProjects = filteredArray;
                console.log(self.filteredProjects);
              }else{
                console.log('nope');
              }
            }
          }
        }
      console.log(self.filteredProjects);
      /////end for loop
      for (var i = 0; i < self.filteredProjects.length; i++) {
        $('.designerDashList').append(
          "<div class='projectCell col-md-2 col-xs-12'>"+
            "<div class='projectCellInner'>"+
              "<div class='projectCellImageHolder'>"+
                "<img src='"+self.filteredProjects[i].images[0]+"'>"+
              "<div>"+
              "<div class='projectCellContent'>"+
                "<p>"+self.filteredProjects[i].name+"</p>"+
              "<div>"+
            "<div>"+
          "<div>"
        )
      }
      addHoverToCell();
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
        backgroundColor: "#E0F8F7"
      })
      $('.designerDashActive').css({
        backgroundColor: "white"
      })
      console.log('to curated');
      toggleCurated();
      addHoverToCell();
    })

    ////////toggle to active view
    $('.designerDashActive').on('click', function(){
      console.log('to active');
      $('.designerDashCurated').css({
        backgroundColor: "white"
      })
      $('.designerDashActive').css({
        backgroundColor: "#E0F8F7"
      })
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
            console.log($(evt.target)[0].id);
            var idToDelete = $(evt.target)[0].id;
            $http({
              method: "DELETE"
              ,url: "/api/product/"+idToDelete
            })
            .then(function(deletedObject){
              console.log(deletedObject);
              console.log('just deleted '+deletedObject.data.name);
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

    ////filter by productType
    $('.designerDashProductType').change(function(evt){
      $('.designerDashList').html('');
      loadFilteredList("productType", $('.designerDashProductType').val())
    })

    ////filter by color
    $('.designerDashColor').change(function(){
      $('.designerDashList').html('');
      loadFilteredList("colors", $('.designerDashColor').val())
    })

    ////filter by fabric
    $('.designerDashFabric').change(function(){
      $('.designerDashList').html('');
      loadFilteredList("fabrics", $('.designerDashFabric').val())
    })

    ////filter by button
    $('.designerDashButton').change(function(){
      $('.designerDashList').html('');
      loadFilteredList("buttons", $('.designerDashButton').val())
    })

    ////filter by season
    $('.designerDashSeason').change(function(){
      $('.designerDashList').html('');
      loadFilteredList("season", $('.designerDashSeason').val())
    })
    ////End Filtering///////////////
    ////////////////////////////////

    ///logout button functionality
    $('.logoutButton').on('click', function(){
      window.localStorage.hofbToken = "";
      window.location.hash = "#/signin"
    })
  /////end dash controller
  ////////////////////////
  ////////////////////////
  }
