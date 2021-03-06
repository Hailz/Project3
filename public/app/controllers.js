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
            $http.post("/api/auth", $scope.user).then(function success(res) {
                Auth.saveToken(res.data.token);
                $state.go("home")
            }, function error(err) {
                console.log("Login Failed.")
            })
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
            console.log("Login Failed.")
        })
        }
}])
// .controller('AlertsCtrl', ['$scope', 'Alerts', function($scope, Alerts){
//     $scope.alerts = Alerts.getAll();
// }])
.controller('ProfileCtrl', ['$scope', '$http', '$state', '$location', 'Auth', 'UsersAPI', function($scope, $http, $state, $location, Auth, UsersAPI){
    $scope.isLoggedIn = function() {
        return Auth.isLoggedIn();
    }

    $scope.tempUser = Auth.currentUser();
    var curUser = $scope.tempUser.id;
    UsersAPI.getUser(curUser).then(function(user){
        $scope.user = user.data
    })

    $scope.updateProfile =function(){
        UsersAPI.updateProfile($scope.user).then(function success(res){
            console.log(res)
            $location.path('/profile')
        }, function error(err){
            console.log(err);
        })
    }

    $scope.deleteProfile = function(id){
        UsersAPI.deleteProfile(id).then(function success(res){
            Auth.removeToken();
            $location.path('/');
        }, function error(err){
            console.log(err)
        })
    }

}])
.controller('FavoritesCtrl', ['$scope', '$http', '$state', '$location', 'Message', 'Auth', 'UsersAPI', 'ExcusesAPI', 'FavoritesAPI', function($scope, $http, $state, $location, Message, Auth, UsersAPI, ExcusesAPI, FavoritesAPI){
    $scope.allExcuses = [];
    $scope.allFavorites = [];
    $scope.excuses = [];
    $scope.favorites = [];

    $scope.isLoggedIn = function() {
        return Auth.isLoggedIn();
    }

    $scope.tempUser = Auth.currentUser();
    $scope.userId = $scope.tempUser.id;

    UsersAPI.getUser($scope.userId).then(function(user){
        $scope.number = user.data.number
    })

    FavoritesAPI.getFavorites()
    .then(function success(res){
        $scope.allFavorites = res.data
        for (var i = 0; i < $scope.allFavorites.length; i++){
            if ($scope.allFavorites[i].userId == $scope.userId){
                $scope.favorites.push($scope.allFavorites[i])
            }
        }
        ExcusesAPI.getAllExcuses()
        .then(function success(res) {
            $scope.allExcuses = res.data;
            for (var i = 0; i < $scope.allExcuses.length; i++) {
                for (var j = 0; j < $scope.favorites.length; j++) {
                    if ($scope.allExcuses[i]._id == $scope.favorites[j].excuseId){
                        $scope.excuses.push($scope.allExcuses[i])
                    }
                }
            }
        }, function error(err) {
            console.log("Error", err);
    })
    }, function error(err){
        console.log("Error", err)
    })

    $scope.deleteFav = function(id){
      
        FavoritesAPI.deleteFavorite(id).then(function success(res){
            $location.path('/');
        }, function error(err){
            console.log("Delete favorite failed. "+err);
        })
    }

    $scope.sendMsg = function(message, number) {
        Message.sendMessage(message, number).then(function success(res) {
            console.log("Message sent. " + res)
        },
        function error(err){
            console.log("Message not sent. " + err)
        })
    }
}])
.controller('NavCtrl', ['$scope', 'Auth', '$location', 'UsersAPI', function($scope, Auth, $location, UsersAPI) {
    $scope.number


    $scope.isLoggedIn = function() {
        return Auth.isLoggedIn();
    }
    $scope.logout = function() {
        console.log("Before Logout", Auth.getToken());
        Auth.removeToken();
        console.log("After Logout", Auth.getToken());
        $location.path("/login");
    };
    $scope.tempUser = Auth.currentUser();
    var curUser = $scope.tempUser.id;
    
    UsersAPI.getUser(curUser).then(function(user){
        $scope.number = user.data.number
    });
    $scope.Admin = function(){
        if (($scope.number == +14252238606) || ($scope.number == +12063840852)){
            return true;
        } else {
            return false;
        }
    };

}])
.controller('HomeCtrl', ['$scope', '$location', '$http', 'Message', 'ExcusesAPI', 'Auth', 'UsersAPI', function($scope, $location, $http, Message, ExcusesAPI, Auth, UsersAPI) {
    $scope.allExcuses = [];
    $scope.excuses = [];

    ExcusesAPI.getAllExcuses()
    .then(function success(res) {
        $scope.allExcuses = res.data;
        $scope.temp = $scope.allExcuses.sort(function(){
            return 0.5 - Math.random()
        })
        $scope.excuses = [$scope.temp[0], $scope.temp[1], $scope.temp[2]];
    }, function error(err) {
        console.log("Error", err);
    })

    $scope.isLoggedIn = function() {
        return Auth.isLoggedIn();
    }

    $scope.reDraw = function(){
         $scope.temp = $scope.allExcuses.sort(function(){
            return 0.5 - Math.random()
        })
         $scope.excuses = [$scope.temp[0], $scope.temp[1], $scope.temp[2]];
    }

    $scope.tempUser = Auth.currentUser();
    var curUser = $scope.tempUser.id;
    UsersAPI.getUser(curUser).then(function(user){
        $scope.number = user.data.number
    })
    $scope.sendMsg = function(message, number) {
        Message.sendMessage(message, number).then(function success(res) {
            console.log("Message sent. " + res)
        },
        function error(err){
            console.log("Message not sent. " + err)
        })
    }
}])
.controller('WriteCtrl', ['$scope', '$location', '$http', 'Message', 'Auth', 'UsersAPI', function($scope, $location, $http, Message, Auth, UsersAPI){
    $scope.userExcuse = '';
    $scope.tempUser = Auth.currentUser();
    var curUser = $scope.tempUser.id;

    $scope.isLoggedIn = function() {
        return Auth.isLoggedIn();
    }
  
    UsersAPI.getUser(curUser).then(function(user){
        $scope.number = user.data.number
    })
    $scope.writeExcuse = function() {
        Message.sendMessage($scope.userExcuse, $scope.number).then(function success(res) {
            console.log("Message made! " + res)
        },
        function error(err){
            console.log("Message not made. " + err)
        })
    }


}])
.controller('CommentCtrl', ['$scope', '$location', '$http', 'Auth', 'ExcusesAPI', 'CommentsAPI', 'UsersAPI', 'FavoritesAPI', '$stateParams', function($scope, $location, $http, Auth, ExcusesAPI, CommentsAPI, UsersAPI, FavoritesAPI,  $stateParams){
    $scope.excuse = {};
    $scope.user = Auth.currentUser();
    $scope.comments = [];
    $scope.allFavorites = [];
    $scope.favorites = [];
    $scope.favoritedAlready = [];

    $scope.isLoggedIn = function() {
        return Auth.isLoggedIn();
    }

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
        $scope.tempcomments = res.data;
         for(var i = 0; i < $scope.tempcomments.length; i++) {
                if ($scope.tempcomments[i].excuseId == $scope.excuse._id) {
                    $scope.comments.push($scope.tempcomments[i]);
                    $scope.comments = $scope.comments.reverse(); 
                }
            }
    }, function error(err) {
        console.log("Error", err);
    });

    FavoritesAPI.getFavorites().then(function success(res){
        $scope.allFavorites = res.data
        for (var i = 0; i < $scope.allFavorites.length; i++){
            if ($scope.allFavorites[i].userId == $scope.user.id){
                $scope.favorites.push($scope.allFavorites[i])
            }
        }
        for (var i = $scope.favorites.length - 1; i >= 0; i--) {
            if ($scope.favorites[i].excuseId == $scope.excuse._id){
                $scope.favoritedAlready.push($scope.favorites[i])
            }
        }
    }, function error(err){
        console.log("Failed to get favorites.", err)
    })

    $scope.isFavorite = function(){
        console.log($scope.favoritedAlready)
        if ($scope.favoritedAlready.length > 0){
            return true;
        }
    }

    $scope.like = function(){
       rating = $scope.excuse.rating++
       ExcusesAPI.updateExcuse($scope.excuse).then(function success(res){
        console.log('update it ' + res)
       }, function error(err){
        console.log("Fail " + err)
       })
    };
    $scope.dislike = function(){
        rating= $scope.excuse.rating--
        ExcusesAPI.updateExcuse($scope.excuse).then(function success(res){
        console.log('update it ' + res)
       }, function error(err){
        console.log("Fail " + err)
       })
    };

    $scope.addFavorite = function(){
        console.log("Excuse id: " + $scope.excuse._id, "User id: " + $scope.user.id)
        $scope.newFavorite = {
            userId: $scope.user.id,
            excuseId: $scope.excuse._id
        }
        console.log($scope.newFavorite)
        FavoritesAPI.addFavorite($scope.newFavorite)
        .then(function success(res){
            console.log("Add favorite " + res)
            $location.path('/favorites');
        }, function error(err){
            console.log("Favorite add failed.")
        });
    };

    $scope.deleteFav = function(id){
        console.log("Excuse ID is: ", id)
        FavoritesAPI.deleteFavorite(id).then(function success(res){
            $location.path('/favorites');
        }, function error(err){
            console.log("Nope "+err);
        });
    };

    $scope.createComment = function() {  
        console.log($scope.excuse._id );
        CommentsAPI.createComment($scope.newComment)
        .then(function success(res) {
            $scope.comments.push(res.data);
            $scope.comments = $scope.comments.reverse(); 
            $scope.newComment = {
                excuseId: $scope.excuse._id,
                comment: '',
                commentAuthor: $scope.user.name,
                userId: $scope.user.id
            }
            $location.path("/excuse/" + $scope.excuse._id);
        }, function error(err) {
            console.log("Create Comment Error", err);
        });
    };

    $scope.deleteComment = function(commentId, $index) {
        CommentsAPI.deleteComment(commentId)
        .then(function success(res) {
            $scope.comments.splice($index, 1);
            console.log("Comment deleted!");
        }, function error(err) {
            console.log("Delete Comment Error", err);
        });
    };
}])
.controller('EditCommentCtrl', ['$scope', '$state', 'Auth', '$location', 'ExcusesAPI', 'CommentsAPI', 'UsersAPI', 'FavoritesAPI', '$stateParams', function($scope, $state, Auth, $location, ExcusesAPI, CommentsAPI, UsersAPI, FavoritesAPI,  $stateParams){
    $scope.comment = {
        comment: ''
    };
    $scope.excuse = 
 
    CommentsAPI.getComment($stateParams.id)
    .then(function success(res){
        console.log(res);
        $scope.comment = res.data; 
    }, function error(err){
        console.log(err)
    })

    $scope.updateComment = function() {
    CommentsAPI.updateComment($stateParams.id, $scope.comment)
    .then(function success(res){
        $scope.comment = res.data; 
        $location.path("/excuse/" + $scope.comment.excuseId);
    }, function error(err) {
        console.log("Error", err);
        });
    }
}])
.controller('AdminCtrl', ['$scope', '$state', 'Auth', 'UsersAPI', 'ExcusesAPI', function($scope, $state, Auth, UsersAPI, ExcusesAPI){
    $scope.newExcuse = {
        excuse: '',
        excuseMsg: '',
        rating: 0
    }

    $scope.addExcuse = function(){
        ExcusesAPI.addExcuse($scope.newExcuse)
        .then(function success(res){
            console.log("Yaaaas", res);
            $scope.newExcuse = {
                excuse: '',
                excuseMsg: '',
                rating: 0
            }
        }, function error(err){
            console.log("Fudge. ", err);
        });
    }

    $scope.tempUser = Auth.currentUser();
    var curUser = $scope.tempUser.id;
    
    UsersAPI.getUser(curUser).then(function(user){
        $scope.number = user.data.number
        $scope.Admin = function(){
            if (($scope.number == +14252238606) || ($scope.number ==  +12063840852)){
                return true;
            } else {
                return false;
            }
        };
    });

}]);
