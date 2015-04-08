var app = angular.module('app', ["todoModules"]);
angular.element(document).ready(function () {
    angular.bootstrap(document, [app.name]);
});
