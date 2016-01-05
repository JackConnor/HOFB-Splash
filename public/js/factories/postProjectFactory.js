angular.module('postProjectFactory', [])

  .factory('postProject', postProject);

  postProject.$inject = ['$http'];
  function postProject($http){

    function postProjectToDb(projectArray, callback){
      console.log('in factory');
      return $http({
        method: "POST"
        ,url: "/api/products"
        ,data: projectArray
      })
    }

    return {
      postProject: postProjectToDb
    }


  ////////end factory////
  ///////////////////////
  }
