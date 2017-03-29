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

.controller('OneExcuseCtrl', ['$scope', '$location', '$http', 'Auth', 'ExcusesAPI', 'CommentsAPI', '$stateParams', function($scope, $location, $http, Auth, ExcusesAPI, CommentsAPI, $stateParams){
    // $scope.excuse = {};
    // $scope.user = Auth.currentUser()

    // ExcusesAPI.getExcuse($stateParams.id)
    // .then(function success(res){
    // // $scope.excuse = res.data
    //     console.log(res.data)
    // }, function error(err){
    //     console.log(err)
    // })
}])
.controller('CommentCtrl', ['$scope', '$location', '$http', 'Auth', 'ExcusesAPI', 'CommentsAPI', 'UsersAPI', '$stateParams', function($scope, $location, $http, Auth, ExcusesAPI, CommentsAPI, UsersAPI, $stateParams){
    $scope.excuse = {};
    $scope.user = Auth.currentUser()

    ExcusesAPI.getExcuse($stateParams.id)
    .then(function success(res){
        $scope.excuse = res.data
        console.log("~~~~this ish " + res.data)
    }, function error(err){
        console.log(err)
    })

}])
.controller('CommentCtrl', ['$scope', '$location', '$stateParams', '$http', 'Auth', 'CommentsAPI', 'UsersAPI', function($scope, $location, $stateParams, $http, Auth, CommentsAPI, UsersAPI){
    $scope.comments = [];
    $scope.currentUserId = user.data.id;
    $scope.currentUser = user.data.name;
    $scope.newComment = {
            excuseId: '',
            comment: '',
            commentAuthor: currentUser,
            userId: currentUserId
        }  
    $scope.loading = false; 
    $scope.temp = Auth.currentUser();

    CommentsAPI.getAllComments()
    .then(function success(response) {
        $scope.loading = true; 
        $scope.comments = response.data;
        $scope.loading = false; 
        
        CommentsAPI.createComment($scope.comment)
        .then(function success(response) {
            $location.path('/');
        }, function error(err) {
            console.log("Error", err);
            })
        
        CommentsAPI.deleteComment($stateParams.id)
        .then(function success(response) {
            $location.path('/excuse');
        }, function error(err) {
            console.log("Error", err);
            })
        
        CommentsAPI.updateComment($scope.comment)
        .then(function success(response) {
            console.log("success", response);
            $location.path('/comment/' + $scope.comment._id);
        }, function error(err) {
            console.log("Error", err);
            })

    }, function error(err) {
        console.log("Error", err);
        $scope.loading = false; 
        }
    )
}])




// .controller('CommentController', function(){
//     this.comment = {};
//     this.addComment = function(post){
//       this.comment.createdOn = Date.now();
//       post.comments.push(this.comment);
//       this.comment ={};
//     };
//   });

