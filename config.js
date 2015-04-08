System.config({
  "baseURL": "/jspm-todo-app",
  "transpiler": "babel",
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"

  },
  "babelOptions": {
    "optional": [
      "runtime"
    ]
  }
});

System.config({
  "map": {
    "todo": "todo-systemjs",
    "angular": "github:angular/bower-angular@1.3.15",
    "babel": "npm:babel@4.7.16",
    "babel-runtime": "npm:babel-runtime@4.7.16",
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:babel-runtime@4.7.16": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

