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
        self.allProjects = allProjectsData.data;
        return allProjectsData.data;
      })
    }

    return {
      allprojects: getAllProjects
    }
  }
