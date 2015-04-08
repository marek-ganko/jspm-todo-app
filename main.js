import 'angular';
import todoModule from 'todo-module';

var app = angular.module('app', ["TodoModules"]);

angular.element(document).ready(function () {
    angular.bootstrap(document, [app.name]);
});
