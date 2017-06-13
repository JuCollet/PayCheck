/*global angular,UIkit*/

'use strict';

angular.module('app', ["ngRoute"])

    .config(function($routeProvider) {
        $routeProvider
        .when("/confirmation", {
        templateUrl : "confirmation.html"
        })
        .otherwise({
        templateUrl : "form.html"
        });
    })
    
    .controller('form', ['$scope', '$location', 'formFactory', function($scope, $location, formFactory){
        
        $scope.users = [{name:"Loading..."}];
        
        const getUsersInfos = function(){
            formFactory.getUsers().then(function(res){
                $scope.users = res.data;
                $scope.username = res.data[0].name;
            });
        }();
        
        $scope.providers = ["Print24", "PixInk"];
        $scope.provider = null;
        
        $scope.products = [
            {
                description: "",
                amount: 1,
                price: null
            }
        ];
        
        $scope.newUser = {
            name: "",
            email: ""
        };
        $scope.comment = "";
        $scope.visa = true;
        $scope.emergency = false;
        $scope.manon = true;
        $scope.totalPrice = function(){
            let total = 0;
            for(let i = 0; i < $scope.products.length; i++){
                total += $scope.products[i].price*$scope.products[i].amount;
            }
            return total;
        };
        
        $scope.addProduct = function(){
            if($scope.products.length < 5){
                $scope.products.push({
                    description: "",
                    amount: 1,
                    price: ""
                });
            }else{
                UIkit.notification('Maximum de produits atteint...', {status:'danger'});
            }
        };
        
        $scope.addUser = function(){
            formFactory.addUser($scope.newUser).then(function(){
                formFactory.getUsers().then(function(res){
                    $scope.users = res.data;
                    $scope.username = res.data[res.data.length-1].name;
                });
            });
            UIkit.notification('Bienvenue, '+$scope.newUser.name+" !");
            $scope.newUser = {name:"",email:""};
        };

        $scope.sendRequest = function(){
            formFactory.sendRequest({
                user: $scope.username,
                request : {
                    provider: $scope.provider,
                    products: $scope.products,
                    comment: $scope.comment,
                    budget: $scope.budget,
                    visa: $scope.visa,
                    emergency: $scope.emergency,
                    manon: $scope.manon,
                    totalPrice: $scope.totalPrice()
                }
            }).then(function(){
                $location.path( "/confirmation" );
            });
        };
        
    }])
    
    .factory('formFactory', ['$http', function($http){
        
        var sendRequest = function(request){return $http.post('/requests', request);},
            addUser = function(user){return $http.post('/users', user);},
            getUsers = function(){return $http.get('/users');};
        
        return {
            sendRequest : sendRequest,
            addUser : addUser,
            getUsers : getUsers
        };
        
    }]);