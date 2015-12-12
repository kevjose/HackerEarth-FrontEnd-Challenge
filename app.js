angular.module('hackerApp', [])
  .filter('spaceless',function() {
    return function(input) {
        if (input) {
            return input.replace(/\s+/g, '-');    
        }
    }
  })


  .directive('starRating', function () {
    return {
      restrict: 'A',
      template: '<ul class="rating">' +
        '<li ng-repeat="star in stars" ng-class="star">' +
        '\u2605' +
        '</li>' +
        '</ul>',
      scope: {
        ratingValue: '=',
        max: '='
      },
      link: function (scope, elem, attrs) {
        scope.stars = [];
        for (var i = 0; i < scope.max; i++) {
          scope.stars.push({
            filled: i < scope.ratingValue
          });
        }
      }
    }
  })

  .controller('PageController', function($scope, $http) {
    $scope.apiHits = 0;
    $scope.problems = [];
    $scope.problems.likes =[];
    $scope.likeCount = 0;
    $scope.searchText ={};
    $scope.sortingCriteria ="-rating";
    /*Getting api Hits */
    $http.get("http://hackerearth.0x10.info/api/problems?type=json&query=api_hits")
    .then(function(response){
      $scope.apiHits = response.data.api_hits;
    })
    .catch(function(error){
      console.log(error);
    });
    
    /*Getting Problems*/
    $http.get("http://hackerearth.0x10.info/api/problems?type=json&query=list_problems")
    .then(function(response){
      console.log(response);
      $scope.problems = response.data.problems
      if(localStorage.getItem("Likes")){
        $scope.problems.likes = JSON.parse(localStorage.getItem("Likes"));
        $scope.likeCount = $scope.totalLikes($scope.problems.likes);
        for(j in $scope.problems){
          $scope.problems[j].like = $scope.problems.likes[j];
        }
      } 
    })
    .catch(function(error){
      console.log(error);
    });
    
    /*Likes*/
   /* var movies = ["Reservoir Dogs", "Pulp Fiction", "Jackie Brown", 
              "Kill Bill", "Death Proof", "Inglourious Basterds"];
 
    localStorage.setItem("Likes", JSON.stringify(movies));
    var retrievedData = localStorage.getItem("Likes");*/

    var like =[];
    if(localStorage.getItem("Likes")){
      like = JSON.parse(localStorage.getItem("Likes"));
    }
    $scope.enterLikes = function(index){
      if(!like[index]){
        like[index] = 0;
      }
      like[index]++;
      localStorage.setItem("Likes", JSON.stringify(like));
      $scope.problems.likes[index] = like[index];
      $scope.problems[index].like = like[index];
      $scope.likeCount = $scope.totalLikes(like);
    }
    $scope.totalLikes = function(dataArray){
      var sum = 0 ;
      for(i in dataArray){
        sum = sum + dataArray[i];
      }
      return sum ; 
    }
  });
