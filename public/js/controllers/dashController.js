angular.module('dashController', ['allProjectsFactory'])

  .controller('dashCtrl', dashCtrl)

  dashCtrl.$inject = ['$http', 'allProjects'];
  function dashCtrl($http, allProjects){
    var self = this;

    ///////////////////////////////////////////////////////////////////
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
      for (var i = 0; i < self.allProjects.length; i++) {
        $('.designerDashList').append(
          "<div class='col-md-4 col-xs-12 projectCell'>"+
            "<div class='projectCellInner'>"+
              "<div class='projectCellImageHolder'>"+
                "<img src='"+self.allProjects[i].images[0]+"'>"+
              "<div>"+
              "<div class='projectCellContent'>"+
                "<p>"+self.allProjects[i].name+"</p>"+
              "<div>"+
            "<div>"+
          "<div>"
        )
      }
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
              "<div>"+
              "<div class='projectCellContent'>"+
                "<p>"+self.curatedProjects[i].name+"--curated</p>"+
              "<div>"+
            "<div>"+
          "<div>"
        )
      }
    }

    ////function for appending filtered lists from dropdown in realtime
    function loadFilteredList(filterType, filterValue){
      console.log(filterType);
      console.log(filterValue);
      var filteredArray = [];
      for (var i = 0; i < self.allProjects.length; i++) {
        var productTypeData = self.allProjects[i];
        console.log(productTypeData);
        var productType = productTypeData[filterType];
        console.log(productType);
        if(filterValue == productType){
          console.log(filterValue +" should equal "+productType+" for this one to work");
          filteredArray.push(self.allProjects[i]);
        }
        self.filteredProjects = filteredArray;
        console.log(self.filteredArray);
      }
      console.log(self.filteredProjects);
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
      $('.projectCellImageHolder').on('mouseenter', function(evt){
        var $hoverTarget = $(evt.target);
        $hoverTarget.css({
          opacity: 0.5
        })
        ////we drill up in order to get the parent, so we can append the html buttons to it
        var parentContainer = $hoverTarget.parent().parent()[0];
        $(parentContainer).prepend(
          "<div class='projectCellHoverContainer'>"+
            "<div class='projectCellTrash'>X </div>"+
            '<div class="projectCellButton">Edit'+
            "<div>"+
          "<div>"
        )
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
    $('.designerDashProductType').change(function(){
      console.log('ahhhhhh yeaaaaa');
      $('.designerDashList').html('');
      loadFilteredList("productType", $('.designerDashProductType').val())
    })

    ////End Filtering///////////////
    ////////////////////////////////

  /////end dash controller
  ////////////////////////
  ////////////////////////
  }
