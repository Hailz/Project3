angular.module('AppCtrl', ['AppServices'])
.controller('SignupCtrl', ['$scope', '$http', '$state', 'Auth', function($scope, $http, $state, Auth) {
    $scope.user = {
        email: '',
        password: '',
        name: '',
        number: ''
    };
    $scope.userSignup = function() {
        $http.post('/api/users', $scope.user).then(function success(res) {
            Auth.saveToken(res.data.token);
            $state.go("home");
        }, function error(err) {
        console.log("Error", err)
        })
    };
}])
.controller('LoginCtrl', ['$scope', '$http', '$state', 'Auth', function($scope, $http, $state, Auth) {
    $scope.user = {
        email: '',
        password: ''
    };
    $scope.userLogin = function() {
        $http.post("/api/auth", $scope.user).then(function success(res) {
            Auth.saveToken(res.data.token);
            $state.go("home")
        }, function error(err) {
            console.log("Uh oh. Login Failed.")
        })
        }
}])
// .controller('AlertsCtrl', ['$scope', 'Alerts', function($scope, Alerts){
//     $scope.alerts = Alerts.getAll();
// }])
.controller('ProfileCtrl', ['$scope', '$http', '$state', 'Auth', 'UsersAPI', function($scope, $http, $state, Auth, UsersAPI){
    $scope.isLoggedIn = function() {
        return Auth.isLoggedIn();
    }

    $scope.tempUser = Auth.currentUser();
    var curUser = $scope.tempUser.id;
    console.log("User id " + curUser)
    console.log(UsersAPI.getUser(curUser))
    UsersAPI.getUser(curUser).then(function(user){
        console.log("Get dat user id: " + user.data.id)
        $scope.user = user.data
    })


}])
.controller('FavoritesCtrl', ['$scope', '$http', '$state', 'Auth', 'UsersAPI', 'ExcusesAPI', 'FavoritesAPI', function($scope, $http, $state, Auth, UsersAPI, ExcusesAPI, FavoritesAPI){
    $scope.allExcuses = [];
    $scope.allFavorites = [];
    $scope.excuses = [];
    $scope.favorites = [];

    $scope.isLoggedIn = function() {
        return Auth.isLoggedIn();
    }

    $scope.tempUser = Auth.currentUser();
    $scope.userId = $scope.tempUser.id;
    console.log("User id " + $scope.userId)

    FavoritesAPI.getFavorites()
    .then(function success(res){
        console.log('All the favs are here...', res)
        $scope.allFavorites = res.data
        console.log($scope.allFavorites[0].userId)
        for (var i = 0; i < $scope.allFavorites.length; i++){
            if ($scope.allFavorites[i].userId == $scope.userId){
                $scope.favorites.push($scope.allFavorites[i])
            }
        }
        ExcusesAPI.getAllExcuses()
        .then(function success(res) {
            console.log('All the excuses are here now...', res)
            $scope.allExcuses = res.data;
            for (var i = 0; i < $scope.allExcuses.length; i++) {
                for (var j = 0; j < $scope.favorites.length; j++) {
                    if ($scope.allExcuses[i]._id == $scope.favorites[j].excuseId){
                        $scope.excuses.push($scope.allExcuses[i])
                    }
                }
            }
            console.log("These should be the excuses that match the user favs ",$scope.excuses)
        }, function error(err) {
            console.log("Error", err);
    })
    }, function error(err){
        console.log("Boooooo", err)
    })

}])


.controller('NavCtrl', ['$scope', 'Auth', '$location', function($scope, Auth, $location) {
  $scope.isLoggedIn = function() {
    return Auth.isLoggedIn();
  }
  $scope.logout = function() {
    console.log("Before Logout", Auth.getToken());
    Auth.removeToken();
    console.log("After Logout", Auth.getToken());
    $location.path("/login");
  };
}])
.controller('HomeCtrl', ['$scope', '$location', '$http', 'Message', 'ExcusesAPI', 'Auth', 'UsersAPI', function($scope, $location, $http, Message, ExcusesAPI, Auth, UsersAPI) {
    $scope.allExcuses = [];
    $scope.excuses = [];
    $scope.searchTerm;

    ExcusesAPI.getAllExcuses()
    .then(function success(res) {
        console.log('in excuses API then promise', res)
        $scope.allExcuses = res.data;
        $scope.temp = $scope.allExcuses.sort(function(){
            return 0.5 - Math.random()
        })
        $scope.excuses = [$scope.temp[0], $scope.temp[1], $scope.temp[2]];
    }, function error(err) {
        console.log("Error", err);
    })

    $scope.reDraw = function(){
        console.log('Shuffle click')
         $scope.temp = $scope.allExcuses.sort(function(){
            return 0.5 - Math.random()
        })
         $scope.excuses = [$scope.temp[0], $scope.temp[1], $scope.temp[2]];
    }

    $scope.tempUser = Auth.currentUser();
    var curUser = $scope.tempUser.id;
    console.log("User id " + curUser)
    console.log(UsersAPI.getUser(curUser))
    UsersAPI.getUser(curUser).then(function(user){
        console.log("Get dat user " + user.data.name, "phone number: " + user.data.number)
        $scope.number = user.data.number
    })

    $scope.sendMsg = function(message, number) {
        Message.sendMessage(message, number).then(function success(res) {
            console.log("it's working, people " + res)
        },
        function error(err){
            console.log("it's not working, people " + err)
        })
    }
    $scope.searchExcuses = function() {
        console.log("here")
        ExcusesAPI.getAllExcuses($scope.searchTerm).then(function (res) {
            console.log(res)
            $scope.excuses = res.config.data;
        }, function error(err) {
            console.log("Nooo", err)
        })
    }
}])
.controller('CommentCtrl', ['$scope', '$location', '$http', 'Auth', 'ExcusesAPI', 'CommentsAPI', 'UsersAPI', 'FavoritesAPI', '$stateParams', function($scope, $location, $http, Auth, ExcusesAPI, CommentsAPI, UsersAPI, FavoritesAPI,  $stateParams){
    $scope.excuse = {};
    $scope.user = Auth.currentUser()
    $scope.comments = {};
 // $scope.loading = false; 

    ExcusesAPI.getExcuse($stateParams.id)
    .then(function success(res){
        $scope.excuse = res.data
        $scope.newComment = {
            excuseId: $scope.excuse._id,
            comment: '',
            commentAuthor: $scope.user.name,
            userId: $scope.user.id
        }  
    }, function error(err){
        console.log(err)
    })

    CommentsAPI.getAllComments()
    .then(function success(res) {
        $scope.comments = res.data;
    }, function error(err) {
        console.log("Error", err);
    });

    $scope.like = function(){
       rating = $scope.excuse.rating++
       ExcusesAPI.updateExcuse($scope.excuse).then(function success(res){
        console.log('update it ' + res)
       }, function error(err){
        console.log("Faaaaail " + err)
       })
    }
    $scope.dislike = function(){
        rating= $scope.excuse.rating--
        ExcusesAPI.updateExcuse($scope.excuse).then(function success(res){
        console.log('update it ' + res)
       }, function error(err){
        console.log("Faaaaail " + err)
       })
    }

    $scope.addFavorite = function(){
        console.log("Excuse id: " + $scope.excuse._id, "User id: " + $scope.user.id)
        $scope.newFavorite = {
            userId: $scope.user.id,
            excuseId: $scope.excuse._id
        }
        console.log($scope.newFavorite)
        FavoritesAPI.addFavorite($scope.newFavorite).then(function success(res){
            console.log("Add favorite " + res)
            $location.path('/')
        }, function error(err){
            console.log('You terrible failure you. No favorites for you. ' + err.body)
        })
    }

    $scope.createComment = function() {    
        CommentsAPI.createComment($scope.newComment)
        .then(function success(res) {
            console.log("Comment added!", $scope.newComment, res.data, $scope.comments, $scope.comments._id);
            
        }, function error(err) {
            console.log("Create Comment Error", err);
            });
    };

    $scope.deleteComment = function(commentId, $index) {
        console.log(commentId);
        CommentsAPI.deleteComment(commentId).then(function success(res) {
            $scope.comments.splice($index, 1);
            console.log("Comment deleted!");
        }, function error(err) {
            console.log("Delete Comment Error", err);
            });
    };
}])
