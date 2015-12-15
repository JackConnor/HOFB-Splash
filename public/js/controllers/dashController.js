angular.module('dashController', ['allProjectsFactory'])

  .controller('dashCtrl', dashCtrl)

  dashCtrl.$inject = ['$http', 'allProjects'];
  function dashCtrl($http, allProjects){
    var self = this;

    /////////////////////////////////////////////////////
    /////////onload event to add initial list of repeated projects
    function loadProjects(callback, arg){
      allProjects.allprojects().then(function(allP){
        self.allProjects = allP;
        var curatedProjectsArray = [];
        for (var i = 0; i < self.allProjects.length; i++) {
          if(self.allProjects[i].status == "curated"){
            console.log('theres one');
            curatedProjectsArray.push(self.allProjects[i])
          }
          self.curatedProjects = curatedProjectsArray;//list of all user's curated projects
        }
        var curatedProjects =
        callback(arg);
      });
    }

    /////load all active projects into the dashboard view
    function loadInitialList(arg){
      console.log(self.allProjects[i]);
      for (var i = 0; i < self.allProjects.length; i++) {
        console.log(self.allProjects[i]);
        $('.designerDashList').append(
          "<div class='col-md-4 col-xs-12 projectCell'>"+
            "<div class='projectCellInner'>"+
              "<div class='projectCellImageHolder'>"+
                "<img class='projectCellImage' id='"+self.allProjects[i]._id+"'"+
              "src='"+self.allProjects[i].images[0]+"'>"+
              "</div>"+
              "<div class='projectCellContent'>"+
                "<p>"+self.allProjects[i].name+"</p>"+
              "</div>"+
            "</div>"+
          "</div>"
        )
      }
      $('.designerDashList').append(
        "<div class='col-md-4 col-xs-12 projectNewCell'>"+
          "<div class='projectCellNewInner'>"+
            "<h2>Build a New product</h2>"+
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
          "<div class='projectCell col-md-4 col-xs-12'>"+
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
          "<div class='projectCell col-md-4 col-xs-12'>"+
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
            '<div class="projectCellButton projectCellButtonShow">See</div>'+
            '<div class="projectCellButton" id="projectCellButtonEdit">Edit</div>"'+
          "</div>"
        )
        $('.projectCellButtonShow').on('click', function(){
          var product = $(parentContainer);
          var productId = $($(product[0].children[1])[0].children[0])[0].id
          window.location.hash = "#/view/product/"+productId;
          window.location.reload();
        });
        $('#projectCellButtonEdit').on('click', function(){
          var product = $(parentContainer);
          var productId = $($(product[0].children[1])[0].children[0])[0].id
          window.location.hash = "#/edit/project/"+productId;
          window.location.reload();
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

  /////end dash controller
  ////////////////////////
  ////////////////////////
  }
