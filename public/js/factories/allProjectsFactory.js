angular.module('allProjectsFactory', [])

  .factory('allProjects', allProjects);

  allProjects.$inject = ['$http'];
  function allProjects($http){

    function getAllProjects(){
      return $http({
        method: "GET"
        ,url: "/api/projects"
      })
      .then(function(allProjectsData){
        console.log(allProjectsData);
        return allProjectsData;
      })
    }

    return {
      allprojects: getAllProjects
    }
    // return 5555;
  }
