angular.
module('librarian.controller', ['librarian.web-service', 'librarian']).
controller(
    'CategoryController', 
    ['$rootScope', '$scope', '$timeout', 
    '$location', 'CategoryService', '$routeParams', CategoryController]).
controller(
    'UserController', 
    ['$rootScope', '$scope', '$timeout', '$location', 
    'UserService', 'LendingService', 'CopyService', '$routeParams', UserController]).
controller(
    'BookController', 
    ['$rootScope', '$scope', '$timeout', 
    '$location', 'BookService', 'CategoryService', 
    'CopyService', 'LendingService', '$route', '$routeParams', BookController]).
controller(
    'LendingController',
    ['$scope', 'LendingService', LendingController]);

function CategoryController($rootScope, $scope, $timeout, $location, service, $routeParams) {
    var controller = GenericController($rootScope, $scope, $timeout, $location, service);
    controller.redirectTo = '/category/list';

    const editURL = /category\/[a-z0-9]{24}\/edit/;

    if($location.path().match(editURL)){
        service.getById($routeParams.catId, (response) => {
            console.log('Retrieving book info to edit.');
            $scope.dataToUpdate = response.data;
        });

    }

    controller.init();
}

function UserController(
    $rootScope, $scope, $timeout, $location, 
    userService, lendingService, copyService, $routeParams) {
    var controller = GenericController($rootScope, $scope, $timeout, $location, userService);

    var multipartConfig  = {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
    }

    controller.create = () => {
        angular.element('#wait-modal').modal('show');
        const data = new FormData(angular.element('#new-user-form')[0]);
        userService.create(data, controller.succesCallbackToCreate, controller.errorCallback, multipartConfig);
    };

    controller.update = () => {
        angular.element('#wait-modal').modal('show');

        const data = new FormData(angular.element('#edit-user-form')[0]);
        const elementId = $scope.dataToUpdate._id;
        userService.update(elementId, data, controller.succesCallbackToUpdate, controller.errorCallback, multipartConfig);
    };

    controller.resetCreateForm = () => {
        $scope.$apply(() => {
            angular.element('#preview-img,#prof-photo-edit-prev').attr('src', '/public/images/profile-photos/default.png');
            $scope.newData = {profilePhoto: '/public/images/profile-photos/default.png'};
        });
        console.log('Reseting create form');
    };

    controller.redirectTo = "/user/list";


    const infoURL = /user\/[a-z0-9]{24}\/info/;
    const editURL = /user\/[a-z0-9]{24}\/edit/;
    const lendingURL = /user\/[a-z0-9]{24}\/lend/;

    //If we are controlling the book/:bookId/info view
    if($location.path().match(infoURL)){
        // Check for book info in the routeScope
        if($rootScope.userInfo){
            $scope.userInfo = angular.copy($rootScope.userInfo);
            lendingService.getByReader($scope.userInfo._id, (response) => {
                $scope.userInfo.copies =  response.data;
            });
        } else if ($routeParams.userId){
            userService.getById($routeParams.userId, (response) => {
                $scope.userInfo = response.data;
                lendingService.getByReader($scope.userInfo._id, (response) => {
                    $scope.userInfo.copies =  response.data;
                });
            });
        }

     //If we are controlling the book/:bookId/edit view
    } else if($location.path().match(editURL)){
        userService.getById($routeParams.userId, (response) => {
            console.log('Retrieving book info to edit.');
            $scope.dataToUpdate = response.data;
        });
     } else if($location.path().match(lendingURL)){
    
        function initUser(user ) {
            $scope.userToLend = user;
            user.completeName = user.name + " " + user.lastname;
            user.borrowedBooks = 0;
            user.lendingsExpired = 0;
            $scope.userOk = true;
            $scope.lending = {};
            $scope.lending.authorizatedAt = new Date();
            $scope.copyAvailable = true;
        }

        if($rootScope.userToLend){
            console.log('There is a user to lend a book');
            var user = angular.copy($rootScope.userToLend);
            initUser(user);
        }else if ($routeParams.userId){
            userService.getById($routeParams.userId, (response) => {
                var user = response.data;
                initUser(user);
            });
        }

        
     }

    

    $scope.newData = {profilePhoto: '/public/images/profile-photos/default.png'};
    
    $scope.showPreviewImg = (target, input) =>{
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                angular.element('#' + target).attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    };

    $scope.showInfo = (user) => {
        $rootScope.userInfo = user;
    };

    $scope.setupToLend = (user) => {
        $rootScope.userToLend = user;
    };

    $scope.changeCopyId = () => {
        copyService.getById($scope.copyToLend._id, (response) => {
            var data = response.data;
            $scope.copyToLend = data;
            $scope.copyAvailable = (data.availability == 'available');
        },(response) =>{
            $scope.copyToLend = {_id : $scope.copyToLend._id};
        })
    };

    $scope.registerLending = () => {
        var lending = $scope.lending;
        lending.reader = $scope.userToLend._id;
        lending.copy = $scope.copyToLend._id;
        lendingService.create(lending, (response) => {
            console.log('Lending maded');

            var copyToUpdate = $scope.copyToLend;

            copyToUpdate.availability = 'unavailable';
            copyService.update(copyToUpdate._id, copyToUpdate, (resp) => {
                console.log('Copy availability updated');

                angular.element('#wait-modal').modal('hide');
                controller.showResponseMessage('Success!', 'The lending was recorded successfully.', () => {
                    $timeout(() => {
                        $scope.$apply(()=>{
                            $location.path('/user/list');
                        });
                    }, 500);
                });

            });

        },(response) =>{
            
        })
    };

    controller.init();
}


function BookController(
    $rootScope, $scope, $timeout, $location, booksService, 
    catsService, copiesService, lendingsService, $route, $routeParams) {
    var controller = GenericController($rootScope, $scope, $timeout, $location, booksService);

    //Configuration required to send images through the angular ajax request.
    var multipartConfig  = {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
    }

    //***********  Modifications to GenericController functions ********************************************

    controller.create = () => {
        angular.element('#wait-modal').modal('show');
        const data = new FormData(angular.element('#new-book-form')[0]);
        booksService.create(data, controller.succesCallbackToCreate, controller.errorCallback, multipartConfig);
    };

    controller.update = () => {
        angular.element('#wait-modal').modal('show');

        const data = new FormData(angular.element('#edit-book-form')[0]);
        const elementId = $scope.dataToUpdate._id;
        booksService.update(elementId, data, controller.succesCallbackToUpdate, controller.errorCallback, multipartConfig);
    };

    controller.resetCreateForm = () => {
        $scope.$apply(() => {
            console.log('Reseting cover image');
            $scope.newData = {cover: '/public/images/covers/generic-book-cover.jpg'};
            $scope.newData = {cover2: '/public/images/autos/default.jpg'};
            angular.element('#preview-img').attr('src', '/public/images/covers/generic-book-cover.jpg');
            angular.element('#preview-img2').attr('src', '/public/images/autos/default.jpg');
            $timeout(() => {
                angular.element('#category-select').selectpicker('refresh');
            });
        });
    };



    controller.setupToDelete = (elementId) => {
            $scope.elementToDelete = elementId;
            $scope.deleteMessage = 'All the data related to this book will be deleted.';
    };

    controller.delete = () => {
            booksService.delete($scope.elementToDelete, 
                controller.succesCallbackToDelete, 
                controller.errorCallback
            );
            $scope.deleteMessage = '';
        }

    controller.redirectTo = "/book/list";

    //***********  Scope initialization ********************************************

    $scope.newData = {cover: '/public/images/covers/generic-book-cover.jpg'};

    $scope.newData = {cover2: '/public/images/autos/default.jpg'};

    const infoURL = /book\/[a-z0-9]{24}\/info/;
    const editURL = /book\/[a-z0-9]{24}\/edit/;
    const copyURL = /book\/[a-z0-9]{24}\/copy/;
    const newURL = /book\/new/;

    //If we are controlling the book/:bookId/info view
    if($location.path().match(infoURL)){
        // Check for book info in the routeScope
        if($rootScope.bookInfo){
            $scope.bookInfo = angular.copy($rootScope.bookInfo);
            copiesService.getByBook($scope.bookInfo._id, (response) => {
                $scope.bookInfo.copies =  response.data;
            });
        // If not, request the book info with the routeParam "bookId"
        } else if ($routeParams.bookId){
            booksService.getById($routeParams.bookId, (response) => {
                $scope.bookInfo = response.data;
                copiesService.getByBook($scope.bookInfo._id, (response) => {
                    $scope.bookInfo.copies =  response.data;
                });
            });
        }

     //If we are controlling the book/:bookId/edit view
    } else if($location.path().match(editURL) || $location.path().match(newURL)){
        catsService.getList((resp) => {
            $scope.categories = resp.data;
            $timeout(() => {
                angular.element('#category-select').selectpicker('refresh');
            }, 0);
        });

        if($location.path().match(editURL)){
            booksService.getById($routeParams.bookId, (response) => {
                console.log('Retrieving book info to edit.');
                $scope.dataToUpdate = response.data;
            });
        }

     } else if($location.path().match(copyURL)){

        function initDefaultCopy(bookId){
            $scope.defaultCopy = {
                book: bookId,
                edition : '',
                state : '... ',
                pages: 1000,
                availability: '...',
                language: '...'
            };
        }

        if($rootScope.bookToCopy){
            $scope.bookToCopy = angular.copy($rootScope.bookToCopy);
            initDefaultCopy($scope.bookToCopy._id);
            $scope.copy = angular.copy($scope.defaultCopy);
        }else{
            booksService.getById($routeParams.bookId, (response) => {
                console.log('Retrieving book info to create a copy.');
                $scope.bookToCopy = response.data;
                initDefaultCopy($scope.bookToCopy._id);
                $scope.copy = angular.copy($scope.defaultCopy);
            });
        }
     }


    $scope.showPreviewImg = (target, input) =>{
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                angular.element('#' + target).attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    };

    $scope.showPreviewImg2 = (target, input) =>{
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                angular.element('#' + target).attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    };

    $scope.cutAbstract = (abstract) => {
        return abstract.substr(0, 100) + '...';
    }


    $scope.showInfo = (book) => {
        $rootScope.bookInfo = book;
    };

    $scope.setBookToCopy = (book) => {
        $rootScope.bookToCopy = book;
    };
    
    $scope.createCopy = () =>{
        angular.element('#wait-modal').modal('show');
        var copy = angular.copy($scope.copy);
        copiesService.create(copy, (response) => {
            angular.element('#wait-modal').modal('hide');
            controller.showResponseMessage('Hecho!', 'Auto Registrado.', () => {
                $scope.$apply(()=>{
                    $scope.copy = angular.copy($scope.defaultCopy);
                });
            });
        });
    };

    $scope.returnBook = (copyId) => {
        lendingsService.returnCopy(copyId, (response) => {
            alert('Copy ' + copyId + ' returned');
            $route.reload();
        });
    };

    $scope.deleteCopy = (copyId) => {
        copiesService.delete(copyId, (response) => {
            alert('Copy ' + copyId + ' deleted');
            $route.reload();
        });
    };

    controller.init();
}

function LendingController($scope, lendingsService){
    lendingsService.getList((response) => {
        $scope.lendings = response.data;
    });

}


function GenericController($rootScope, $scope, $timeout, $location, service) {


    var controller = {
        redirectTo: '/',

        loadData: () => {
            service.getList((response) => {
                $scope.dataList = response.data;
            });
        },

        create: () => {
            angular.element('#wait-modal').modal('show');
            service.create($scope.newData, controller.succesCallbackToCreate, controller.errorCallback);
        },

        update: () => {
            angular.element('#wait-modal').modal('show');
            const data = $scope.dataToUpdate;
            service.update(data._id, data, controller.succesCallbackToUpdate, controller.errorCallback);
        },

        delete: () => {
            service.delete($scope.elementToDelete, 
                controller.succesCallbackToDelete, 
                controller.errorCallback
            );
        },

        setupToUpdate: (data) => {
            $rootScope.dataToUpdate = angular.copy(data);        
        },

        setupToDelete: (elementId) => {
            $scope.elementToDelete = elementId;
        },

        succesCallbackToCreate: (response) => {
            controller.showResponseMessage('Hecho!', 'Elemento Creado Correctamente!.', ()=>{
                angular.element('#wait-modal').modal('hide');
                controller.resetCreateForm();
            });
        },

        errorCallback: (response) =>{
            controller.showResponseMessage('Sorry!', 'The\'re some troubles with the server, Try again later.', () => {
                angular.element('#wait-modal').modal('hide');
            });
        },

        succesCallbackToUpdate: (response) => {
            angular.element('#wait-modal').modal('hide');
            controller.showResponseMessage('Hecho!', 'Elemento Actualizado Correctamente .', () => {
                $timeout(() => {
                    $scope.$apply(()=>{
                        $location.path(controller.redirectTo);
                    });
                }, 500);
            });
        },

        succesCallbackToDelete: (response) => {
            controller.showResponseMessage('Hecho!', 'Elemento Eliminado Correctamente.', controller.loadData);
        },

        resetCreateForm : () => {
            $scope.$apply(() => {
                $scope.newData = {};
            });
        },

        showResponseMessage:  (title, message, handler) =>{
            console.log('Showing response message')
            angular.element('#wait-modal').modal('hide');
            const modal = angular.element('#response-modal');

            modal.modal('show');

            const response = {};
            response.title = title;
            response.message = message;

            $timeout(() => {
                $scope.$apply(()=>{
                    $scope.response = response;
                });
            }, 0);

            modal.find('button').off();
            modal.find('button').click(handler);
        }

    };


    controller.init = () => {

        $scope.dataToUpdate = angular.copy($rootScope.dataToUpdate);

        controller.loadData();

        $scope.create = controller.create;
        $scope.update = controller.update;
        $scope.delete = controller.delete;
        $scope.setupToUpdate = controller.setupToUpdate;
        $scope.setupToDelete = controller.setupToDelete;
    }

    return controller;
}
