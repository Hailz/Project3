angular.module('AppServices', ['ngResource'])
.factory('Recipe', ['$resource', function($resource) {
    return $resource('/api/recipes/:id');
}])
.factory("Auth", ["$window", function($window) {
    return {
        saveToken: function(token) {
        $window.localStorage['secretrecipes-token'] = token;
        },
        removeToken: function() {
        $window.localStorage.removeItem('secretrecipes-token');
        },
        getToken: function() {
        return $window.localStorage['secretrecipes-token'];
        },
        isLoggedIn: function() {
        var token = this.getToken();
        return token ? true : false;
        },
        currentUser: function() {
        if(this.isLoggedIn()){
            var token = this.getToken();

            try {
            // vuln code
            var payload = JSON.parse($window.atob(token.split(".")[1]));
            console.log("payload decoded: " + payload);
            return payload;
            }
            catch (err){ 
            // graceful err handling
            console.log(err)
            return false;
            }
        } else {
            return false;
        }
        }
    }
}])
.factory("AuthInterceptor", ["Auth", function(Auth) {
    return {
        request: function(config) {
        var token = Auth.getToken();
        if(token) {
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
        }
    }
}]);