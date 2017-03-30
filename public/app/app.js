var app = angular.module('App', ['ui.router', 'AppCtrl']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/404');

        $stateProvider
    .state('home', {
        url: '/',
        templateUrl: 'app/views/home.html',
        controller: 'HomeCtrl'
    })
    .state('signup', {
        url: '/signup',
        templateUrl: 'app/views/userSignup.html',
        controller: 'SignupCtrl'
    })
    .state('login', {
        url: '/login',
        templateUrl: 'app/views/userLogin.html',
        controller: 'LoginCtrl'
    })
    .state('404', {
        url: '/404',
        templateUrl: 'app/views/404.html'
    })
    .state('profile',{
        url: '/profile',
        templateUrl: 'app/views/profile.html',
        controller: 'ProfileCtrl'
    })
    .state('favorites', {
        url: '/favorites',
        templateUrl: 'app/views/favorites.html',
        controller: 'FavoritesCtrl'
    })
    .state('excuse', {
        url: '/excuse/:id',
        templateUrl: 'app/views/excuse.html',
        controller: 'CommentCtrl'
    });
    $locationProvider.html5Mode(true);
    }])
    .config(["$httpProvider", function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor')
}])
