var app = angular.module('contactsApp', [])
app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);
app.controller('contactCtrl', ['$scope', '$http', function ($scope, $http) {
    console.log('hello from console');

    const refresh = () => {
        $http.get('/api/contacts').then((data) => {
            console.log('data received');
            $scope.contactlist = data.data;
            $scope.contact = null;
            console.log(data);
        });
    };

    refresh();

    $scope.addContact = () => {
        console.log($scope.contact);
        $http.post('/api/contacts/addcontact', JSON.stringify($scope.contact)).then(function (data) {
            console.log(data);
            alert('data added!');
            refresh();
        });
    };

    $scope.edit = (id) => {
        console.log('You have selected user with ID of ' + id);
        $http.get('/api/contacts/' + id).then(function (data) {
            return $scope.contact = data.data;
        });
    };
    $scope.remove = function (id) {
        console.log(id);
        $http.delete('/api/contacts/deletecontact/' + id).then(function (data) {
            alert('Data deleted successfully');
            refresh();
        });
    };

    $scope.update = () => {
        console.log($scope.contact._id);
        const contactId = $scope.contact._id;
        $http.put('/api/contacts/updatecontact/' + contactId, JSON.stringify($scope.contact))
            .then(function (data) {
                alert('Data was updated Successfully');
                refresh();
            });
    };

    $scope.deselect = function () {
        $scope.contact = null;
    }

}]);