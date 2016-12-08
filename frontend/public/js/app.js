

angular.module(
	'librarian', 
	['ngRoute', 'librarian.web-service', 'librarian.controller']
	).
	
	constant('BACKEND_ENDPOINT', 'http://localhost:3000').
	constant('LIB_API_ENDPOINT', 'http://localhost:3000/api/v1/').
/*
	config(function($locationProvider) {
	  $locationProvider.html5Mode(false);
	}).
*/
	config(function($routeProvider, $locationProvider) {
		$locationProvider.html5Mode(false);

		$routeProvider

		.when('/', {
			redirectTo: '/book/list'
		})

		.when("/category/list", {
			templateUrl : "category-list",
			controller : "CategoryController"
		})
		.when("/category/new", {
			templateUrl : "category-create",
			controller: "CategoryController"
		})
		.when("/category/:catId/edit", {
			templateUrl : "category-update",
			controller: "CategoryController",
			controllerAs: 'CatCont'
		})


		.when("/user/list", {
			templateUrl : "user-list",
			controller : "UserController"
		})
		.when("/user/new", {
			templateUrl : "user-create",
			controller: "UserController"
		})
		.when("/user/:userId/edit", {
			templateUrl : "user-update",
			controller: "UserController"
		})
		.when("/user/:userId/info", {
			templateUrl : "user-info",
			controller: "UserController"
		})
		.when("/user/:userId/lend", {
			templateUrl : "book-lend",
			controller: "UserController"
		})


		.when("/book/list", {
			templateUrl : "book-list",
			controller : "BookController"
		})
		.when("/book/:bookId/info", {
			templateUrl : "book-info",
			controller : "BookController"
		})
		.when("/book/new", {
			templateUrl : "book-create",
			controller: "BookController"
		})
		.when("/book/:bookId/copy", {
			templateUrl : "book-copy",
			controller: "BookController"
		})
		.when("/book/:bookId/edit", {
			templateUrl : "book-update",
			controller: "BookController"
		})


		.when("/lendings/list", {
			templateUrl : "lendings-list",
			controller: "LendingController"
		});
	})


	.filter('filterByTitle', function() {
         return function(items,val) {
               var output=[];
              //Do filter work here
              if(!val) return items;

              val = val.toLowerCase();

			  for(book of items) {
			  	if (book.title.toLowerCase().indexOf(val) != -1) {
					output.push(book);
				}
			  }
              return output;
        }
    })

	.run(['$rootScope', 'BACKEND_ENDPOINT', function($rootScope, endpoint) {
        $rootScope.imageFromBackend = function(imgURL) {
            return endpoint + imgURL;
        };
    }]);