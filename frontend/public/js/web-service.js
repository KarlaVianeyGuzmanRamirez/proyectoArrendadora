function GenericService ($http, url) {

  var WebService = {
    getList:  (onSuccess, onError) => {
      $http.get(url).then(onSuccess, onError);
    },

    getById: (id, onSuccess, onError) => {
      $http.get(url + '/' + id).then(onSuccess, onError);
    },

    create: (data, onSuccess, onError, config) => {
      $http.post(url, data, config).then(onSuccess, onError);
    },

    update: (id, data, onSuccess, onError, config) => {
      $http.put(url + "/" + id, data, config).then(onSuccess, onError);
    },

    delete: (id, onSuccess, onError) => {
      $http.delete(url + "/" + id).then(onSuccess, onError);
    }
  };

  return WebService;
}

function CategoryService ($http, apiEndpoint) {
  return GenericService($http, apiEndpoint + 'categories');
}

function UserService ($http, apiEndpoint) {
  return GenericService($http, apiEndpoint + 'users');
}

function BookService ($http, apiEndpoint) {
  return GenericService($http, apiEndpoint + 'books');
}

function CopyService ($http, apiEndpoint) {
  var url = apiEndpoint + 'copies';
  var service = GenericService($http, url);

  service.getByBook = (bookId, onSuccess, onError) => {
    $http.get(url + '?bookId=' + bookId).then(onSuccess, onError);
  };

  return service;
}

function LendingService ($http, apiEndpoint) {
  var url = apiEndpoint + 'lendings';
  var service = GenericService($http, url);

  service.getByReader = (readerId, onSuccess, onError) => {
    $http.get(url + '?readerId=' + readerId).then(onSuccess, onError);
  };

  service.deleteByCopy = (copyId, onSuccess, onError) => {
    $http.delete(url + '?copyId=' + copyId).then(onSuccess, onError);
  };

  service.returnCopy = (copyId, onSuccess, onError) => {
    var copy = { availability : 'available'};
    var copyService = CopyService($http, apiEndpoint);
    console.log('Deleting the lending')
    service.deleteByCopy(copyId, () => {
       copyService.update(copyId, copy, onSuccess, onError);
    });
  };

  return service;
}

angular.
	module('librarian.web-service', ['librarian']).
  factory('CategoryService',  ['$http', 'LIB_API_ENDPOINT', CategoryService]).
  factory('BookService',      ['$http', 'LIB_API_ENDPOINT', BookService]).
  factory('LendingService',   ['$http', 'LIB_API_ENDPOINT', LendingService]).
  factory('CopyService',      ['$http', 'LIB_API_ENDPOINT', CopyService]).
  factory('UserService',      ['$http', 'LIB_API_ENDPOINT', UserService]).
  factory('LendingService',   ['$http', 'LIB_API_ENDPOINT', LendingService]);