// コアとなるサービスのモジュール
var userServices = angular.module("Sample", ["ngRoute"]);

function userRouteConfig($routeProvider){
    $routeProvider.
    when("/",{
        controller: LoginController,
        templateUrl: "login.html"
    }).
    when("/login",{
        controller: LoginController,
        templateUrl: "login.html"
    }).
    when("/access_token=:accessToken",{
    	controller: LoginSuccessController,
    	templateUrl: "access_ok.html"
    }).
    when("/error=:errorToken",{
    	controller: LoginFailController,
    	templateUrl: "access_ng.html"
    }).
    when("/test01",{
        controller: Test01Controller,
        templateUrl: "test01.html"
    }).
    when("/test02",{
        controller: Test02Controller,
        templateUrl: "test02.html"
    }).
    otherwise({
        redirectTo: "/"
    })
    ;
}

// サービスがルートを解釈できるようにするための設定
userServices.config(userRouteConfig);

function LoginController($scope) {
    //
}

function LoginSuccessController($scope, $rootScope, $location) {
	console.log("★LoginSuccessController")
	console.log("$location.path: " + $location.path());
	console.log("$location.absUrl(): " + $location.absUrl());

	var hash = $location.path().substr(1);
	console.log("hash: " + hash);

	var splitted = hash.split('&');
	var params = {};

	for (var i = 0; i < splitted.length; i++) {
	  var param  = splitted[i].split('=');
	  var key    = param[0];
	  var value  = param[1];
	  console.log("key: " + key + ", value: " + value);
	  params[key] = value;
	  $rootScope.accesstoken=params;
	}

	window.localStorage.setItem("access_token", params["access_token"]);
	console.log("localStorage: " + window.localStorage.getItem("access_token"));
	$rootScope.accesstokenstr = $rootScope.accesstoken["access_token"];

}

function LoginFailController($scope, $rootScope, $location) {
	console.log("★LoginFailController")
	console.log("$location.path: " + $location.path());
	console.log("$location.absUrl(): " + $location.absUrl());
}

function Test01Controller($scope, $rootScope, $location) {
	checkLogin($scope, $location);
}

function Test02Controller($scope, $rootScope, $location) {
	checkLogin($scope, $location);
}

function checkLogin($scope, $location){
	console.log("$location.path: " + $location.path());
	console.log("$location.absUrl(): " + $location.absUrl());

	console.log("$scope.$root.accesstoken: " + $scope.$root.accesstokenstr);
	console.log("window.localStorage.getItem('access_token'): " + window.localStorage.getItem("access_token"));
	if($scope.$root.accesstokenstr == null ||
			$scope.$root.accesstokenstr == undefined ||
			window.localStorage.getItem("access_token") == null ||
			window.localStorage.getItem("access_token") == undefined ||
			$scope.$root.accesstokenstr != window.localStorage.getItem("access_token")){
		if(window.confirm('ログインしてください。')){
			$location.path("/login");
		}
		else{
			$location.path("/login");
		}
	}
}

userServices.controller("OAuth2LoginController", function ($scope, $http, $location){

    // ログインボタン押下
    $scope.login = function(){
        console.log("★登録ボタン押下");

        var client_id="789086735509-lhn2hfpm3sef9pa7ov3gvemdv13a46r1.apps.googleusercontent.com";
        var scope="https://www.googleapis.com/auth/plus.me";
        var redirect_uri="http://localhost:18080/oauth2_hotpans";
        var response_type="token";
        var url="https://accounts.google.com/o/oauth2/auth?scope=" + scope
        	+ "&client_id=" + client_id
        	+ "&redirect_uri=" + redirect_uri
        	+ "&response_type=" + response_type;
        window.location.replace(url);

    };
});
