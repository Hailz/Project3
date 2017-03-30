angular.module('AppCtrl', ['AppServices'])
.controller('SignupCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.user = {
        email: '',
        password: ''
    };
    $scope.userSignup = function() {
        $http.post('/api/users', $scope.user).then(function success(res) {
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
        console.log(res.data);
    }, function error(err) {
        console.log("Error", err);
    })

    $scope.tempUser = Auth.currentUser();
    var curUser = $scope.tempUser.id;
    UsersAPI.getUser(curUser).then(function(user){
        // $scope.currentU = user.data.name;
        console.log(user.data)
    })

    $scope.sendMsg = function(message) {
        Message.sendMessage(message).then(function success(res) {
            console.log("it's working, people ")
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
.controller('CommentCtrl', ['$scope', '$location', '$http', 'Auth', 'ExcusesAPI', 'CommentsAPI', 'UsersAPI', '$stateParams', function($scope, $location, $http, Auth, ExcusesAPI, CommentsAPI, UsersAPI, $stateParams){
    $scope.excuse = {};
    $scope.user = Auth.currentUser();
    $scope.temp = Auth.currentUser();
    $scope.comments = {};

    ExcusesAPI.getExcuse($stateParams.id)
    .then(function success(res){
        $scope.excuse = res.data
        $scope.newComment = {
            excuseId: $scope.excuse._id,
            comment: '',
            commentAuthor: $scope.user.name,
            userId: $scope.user.id
        };

    }, function error(err){
        console.log(err)
    });

    CommentsAPI.getAllComments()
    .then(function success(res) {
        $scope.comments = res.data;
    }, function error(err) {
        console.log("Error", err);
    });

    $scope.like = function(excuse){
        $scope.excuse.rating++
    };
    $scope.dislike = function(excuse){
        $scope.excuse.rating--
    };  

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
        CommentsAPI.deleteComment(commentId)
        .then(function success(res) {
            $scope.comments.splice($index, 1);
            console.log("Comment deleted!");
        }, function error(err) {
            console.log("Delete Comment Error", err);
            });
    };

    $scope.updateComment = function(commentId, $index) {
    CommentsAPI.updateComment(commentId)
        .then(function success(res) {
            $state.go("comment", {id: $stateParams.id});
            console.log("Comment Updated", res);
            }, function error(err) {
            console.log("Update Comment Error", err);
        });
    };

}]);
