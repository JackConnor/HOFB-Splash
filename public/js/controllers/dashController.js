angular.module('dashController', ['allProjectsFactory'])

  .controller('dashCtrl', dashCtrl)

  dashCtrl.$inject = ['$http', 'allProjects'];
  function dashCtrl($http, allProjects){
    var self = this;

    /////////onload event to add initial list of repeated projects
    var projects = allProjects.allprojects();
    console.log(projects);
    function loadProjects(){

    }
  /////end dash controller
  ////////////////////////
  ////////////////////////
  }
