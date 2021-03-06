"format register";




System.register("src/utils/register", [], function (_export) {
    var _applyConstructor;

    /**
     * A helper class to simplify registering Angular components and provide a consistent syntax for doing so.
     */

    _export("default", register);

    function register(appName, dependencies) {

        var app = safeRegister(appName, dependencies);

        return {
            name: appName,
            directive: directive,
            controller: controller,
            service: service,
            provider: provider,
            factory: factory
        };

        function safeRegister(appName, dependencies) {
            try {
                return angular.module(appName);
            } catch (e) {
                return angular.module(appName, dependencies || []);
            }
        }

        function directive(name, constructorFn) {

            constructorFn = _normalizeConstructor(constructorFn);

            if (!constructorFn.prototype.compile) {
                // create an empty compile function if none was defined.
                constructorFn.prototype.compile = function () {};
            }

            var originalCompileFn = _cloneFunction(constructorFn.prototype.compile);

            // Decorate the compile method to automatically return the link method (if it exists)
            // and bind it to the context of the constructor (so `this` works correctly).
            // This gets around the problem of a non-lexical "this" which occurs when the directive class itself
            // returns `this.link` from within the compile function.
            _override(constructorFn.prototype, "compile", function () {
                return function () {
                    originalCompileFn.apply(this, arguments);

                    if (constructorFn.prototype.link) {
                        return constructorFn.prototype.link.bind(this);
                    }
                };
            });

            var factoryArray = _createFactoryArray(constructorFn);

            app.directive(name, factoryArray);
            return this;
        }

        function controller(name, contructorFn) {
            app.controller(name, contructorFn);
            return this;
        }

        function service(name, contructorFn) {
            app.service(name, contructorFn);
            return this;
        }

        function provider(name, constructorFn) {
            app.provider(name, constructorFn);
            return this;
        }

        function factory(name, constructorFn) {
            constructorFn = _normalizeConstructor(constructorFn);
            var factoryArray = _createFactoryArray(constructorFn);
            app.factory(name, factoryArray);
            return this;
        }

        /**
         * If the constructorFn is an array of type ['dep1', 'dep2', ..., constructor() {}]
         * we need to pull out the array of dependencies and add it as an $inject property of the
         * actual constructor function.
         * @param input
         * @returns {*}
         * @private
         */
        function _normalizeConstructor(input) {
            var constructorFn;

            if (input.constructor === Array) {
                //
                var injected = input.slice(0, input.length - 1);
                constructorFn = input[input.length - 1];
                constructorFn.$inject = injected;
            } else {
                constructorFn = input;
            }

            return constructorFn;
        }

        /**
         * Convert a constructor function into a factory function which returns a new instance of that
         * constructor, with the correct dependencies automatically injected as arguments.
         *
         * In order to inject the dependencies, they must be attached to the constructor function with the
         * `$inject` property annotation.
         *
         * @param constructorFn
         * @returns {Array.<T>}
         * @private
         */
        function _createFactoryArray(constructorFn) {
            // get the array of dependencies that are needed by this component (as contained in the `$inject` array)
            var args = constructorFn.$inject || [];
            var factoryArray = args.slice(); // create a copy of the array
            // The factoryArray uses Angular's array notation whereby each element of the array is the name of a
            // dependency, and the final item is the factory function itself.
            factoryArray.push(function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                return _applyConstructor(constructorFn, args);
            });

            return factoryArray;
        }

        /**
         * Clone a function
         * @param original
         * @returns {Function}
         */
        function _cloneFunction(original) {
            return function () {
                return original.apply(this, arguments);
            };
        }

        /**
         * Override an object's method with a new one specified by `callback`.
         * @param object
         * @param methodName
         * @param callback
         */
        function _override(object, methodName, callback) {
            object[methodName] = callback(object[methodName]);
        }
    }

    return {
        setters: [],
        execute: function () {
            "use strict";

            _applyConstructor = function (Constructor, args) { var instance = Object.create(Constructor.prototype); var result = Constructor.apply(instance, args); return result != null && (typeof result == "object" || typeof result == "function") ? result : instance; };
        }
    };
});
System.register("npm:jade@1.9.1/lib/runtime", ["@empty"], true, function(require, exports, module) {
    var global = System.global,
        __define = global.define;
    global.define = undefined;
    'use strict';
    exports.merge = function merge(a, b) {
        if (arguments.length === 1) {
            var attrs = a[0];
            for (var i = 1; i < a.length; i++) {
                attrs = merge(attrs, a[i]);
            }
            return attrs;
        }
        var ac = a['class'];
        var bc = b['class'];
        if (ac || bc) {
            ac = ac || [];
            bc = bc || [];
            if (!Array.isArray(ac))
                ac = [ac];
            if (!Array.isArray(bc))
                bc = [bc];
            a['class'] = ac.concat(bc).filter(nulls);
        }
        for (var key in b) {
            if (key != 'class') {
                a[key] = b[key];
            }
        }
        return a;
    };
    function nulls(val) {
        return val != null && val !== '';
    }
    exports.joinClasses = joinClasses;
    function joinClasses(val) {
        return (Array.isArray(val) ? val.map(joinClasses) : (val && typeof val === 'object') ? Object.keys(val).filter(function(key) {
            return val[key];
        }) : [val]).filter(nulls).join(' ');
    }
    exports.cls = function cls(classes, escaped) {
        var buf = [];
        for (var i = 0; i < classes.length; i++) {
            if (escaped && escaped[i]) {
                buf.push(exports.escape(joinClasses([classes[i]])));
            } else {
                buf.push(joinClasses(classes[i]));
            }
        }
        var text = joinClasses(buf);
        if (text.length) {
            return ' class="' + text + '"';
        } else {
            return '';
        }
    };
    exports.style = function(val) {
        if (val && typeof val === 'object') {
            return Object.keys(val).map(function(style) {
                return style + ':' + val[style];
            }).join(';');
        } else {
            return val;
        }
    };
    exports.attr = function attr(key, val, escaped, terse) {
        if (key === 'style') {
            val = exports.style(val);
        }
        if ('boolean' == typeof val || null == val) {
            if (val) {
                return ' ' + (terse ? key : key + '="' + key + '"');
            } else {
                return '';
            }
        } else if (0 == key.indexOf('data') && 'string' != typeof val) {
            if (JSON.stringify(val).indexOf('&') !== -1) {
                console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' + 'will be escaped to `&amp;`');
            }
            ;
            if (val && typeof val.toISOString === 'function') {
                console.warn('Jade will eliminate the double quotes around dates in ' + 'ISO form after 2.0.0');
            }
            return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
        } else if (escaped) {
            if (val && typeof val.toISOString === 'function') {
                console.warn('Jade will stringify dates in ISO form after 2.0.0');
            }
            return ' ' + key + '="' + exports.escape(val) + '"';
        } else {
            if (val && typeof val.toISOString === 'function') {
                console.warn('Jade will stringify dates in ISO form after 2.0.0');
            }
            return ' ' + key + '="' + val + '"';
        }
    };
    exports.attrs = function attrs(obj, terse) {
        var buf = [];
        var keys = Object.keys(obj);
        if (keys.length) {
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i],
                    val = obj[key];
                if ('class' == key) {
                    if (val = joinClasses(val)) {
                        buf.push(' ' + key + '="' + val + '"');
                    }
                } else {
                    buf.push(exports.attr(key, val, false, terse));
                }
            }
        }
        return buf.join('');
    };
    exports.escape = function escape(html) {
        var result = String(html).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        if (result === '' + html)
            return html;
        else
            return result;
    };
    exports.rethrow = function rethrow(err, filename, lineno, str) {
        if (!(err instanceof Error))
            throw err;
        if ((typeof window != 'undefined' || !filename) && !str) {
            err.message += ' on line ' + lineno;
            throw err;
        }
        try {
            str = str || require('@empty').readFileSync(filename, 'utf8');
        } catch (ex) {
            rethrow(err, null, lineno);
        }
        var context = 3,
            lines = str.split('\n'),
            start = Math.max(lineno - context, 0),
            end = Math.min(lines.length, lineno + context);
        var context = lines.slice(start, end).map(function(line, i) {
            var curr = i + start + 1;
            return (curr == lineno ? '  > ' : '    ') + curr + '| ' + line;
        }).join('\n');
        err.path = filename;
        err.message = (filename || 'Jade') + ':' + lineno + '\n' + context + '\n\n' + err.message;
        throw err;
    };
    global.define = __define;
    return module.exports;
});



System.register("npm:todomvc-common@1.0.1/base", [], true, function(require, exports, module) {
    var global = System.global,
        __define = global.define;
    global.define = undefined;
    "format cjs";
    (function() {
        'use strict';
        var _ = (function(_) {
            _.defaults = function(object) {
                if (!object) {
                    return object;
                }
                for (var argsIndex = 1,
                         argsLength = arguments.length; argsIndex < argsLength; argsIndex++) {
                    var iterable = arguments[argsIndex];
                    if (iterable) {
                        for (var key in iterable) {
                            if (object[key] == null) {
                                object[key] = iterable[key];
                            }
                        }
                    }
                }
                return object;
            };
            _.templateSettings = {
                evaluate: /<%([\s\S]+?)%>/g,
                interpolate: /<%=([\s\S]+?)%>/g,
                escape: /<%-([\s\S]+?)%>/g
            };
            var noMatch = /(.)^/;
            var escapes = {
                "'": "'",
                '\\': '\\',
                '\r': 'r',
                '\n': 'n',
                '\t': 't',
                '\u2028': 'u2028',
                '\u2029': 'u2029'
            };
            var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
            _.template = function(text, data, settings) {
                var render;
                settings = _.defaults({}, settings, _.templateSettings);
                var matcher = new RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g');
                var index = 0;
                var source = "__p+='";
                text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
                    source += text.slice(index, offset).replace(escaper, function(match) {
                        return '\\' + escapes[match];
                    });
                    if (escape) {
                        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
                    }
                    if (interpolate) {
                        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
                    }
                    if (evaluate) {
                        source += "';\n" + evaluate + "\n__p+='";
                    }
                    index = offset + match.length;
                    return match;
                });
                source += "';\n";
                if (!settings.variable)
                    source = 'with(obj||{}){\n' + source + '}\n';
                source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
                try {
                    render = new Function(settings.variable || 'obj', '_', source);
                } catch (e) {
                    e.source = source;
                    throw e;
                }
                if (data)
                    return render(data, _);
                var template = function(data) {
                    return render.call(this, data, _);
                };
                template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';
                return template;
            };
            return _;
        })({});
        if (location.hostname === 'todomvc.com') {
            window._gaq = [['_setAccount', 'UA-31081062-1'], ['_trackPageview']];
            (function(d, t) {
                var g = d.createElement(t),
                    s = d.getElementsByTagName(t)[0];
                g.src = '//www.google-analytics.com/ga.js';
                s.parentNode.insertBefore(g, s);
            }(document, 'script'));
        }
        function redirect() {
            if (location.hostname === 'tastejs.github.io') {
                location.href = location.href.replace('tastejs.github.io/todomvc', 'todomvc.com');
            }
        }
        function findRoot() {
            var base = location.href.indexOf('examples/');
            return location.href.substr(0, base);
        }
        function getFile(file, callback) {
            if (!location.host) {
                return console.info('Miss the info bar? Run TodoMVC from a server to avoid a cross-origin error.');
            }
            var xhr = new XMLHttpRequest();
            xhr.open('GET', findRoot() + file, true);
            xhr.send();
            xhr.onload = function() {
                if (xhr.status === 200 && callback) {
                    callback(xhr.responseText);
                }
            };
        }
        function Learn(learnJSON, config) {
            if (!(this instanceof Learn)) {
                return new Learn(learnJSON, config);
            }
            var template,
                framework;
            if (typeof learnJSON !== 'object') {
                try {
                    learnJSON = JSON.parse(learnJSON);
                } catch (e) {
                    return ;
                }
            }
            if (config) {
                template = config.template;
                framework = config.framework;
            }
            if (!template && learnJSON.templates) {
                template = learnJSON.templates.todomvc;
            }
            if (!framework && document.querySelector('[data-framework]')) {
                framework = document.querySelector('[data-framework]').dataset.framework;
            }
            this.template = template;
            if (learnJSON.backend) {
                this.frameworkJSON = learnJSON.backend;
                this.frameworkJSON.issueLabel = framework;
                this.append({backend: true});
            } else if (learnJSON[framework]) {
                this.frameworkJSON = learnJSON[framework];
                this.frameworkJSON.issueLabel = framework;
                this.append();
            }
            this.fetchIssueCount();
        }
        Learn.prototype.append = function(opts) {
            var aside = document.createElement('aside');
            aside.innerHTML = _.template(this.template, this.frameworkJSON);
            aside.className = 'learn';
            if (opts && opts.backend) {
                var sourceLinks = aside.querySelector('.source-links');
                var heading = sourceLinks.firstElementChild;
                var sourceLink = sourceLinks.lastElementChild;
                var href = sourceLink.getAttribute('href');
                sourceLink.setAttribute('href', href.substr(href.lastIndexOf('http')));
                sourceLinks.innerHTML = heading.outerHTML + sourceLink.outerHTML;
            } else {
                var demoLinks = aside.querySelectorAll('.demo-link');
                Array.prototype.forEach.call(demoLinks, function(demoLink) {
                    if (demoLink.getAttribute('href').substr(0, 4) !== 'http') {
                        demoLink.setAttribute('href', findRoot() + demoLink.getAttribute('href'));
                    }
                });
            }
            document.body.className = (document.body.className + ' learn-bar').trim();
            document.body.insertAdjacentHTML('afterBegin', aside.outerHTML);
        };
        Learn.prototype.fetchIssueCount = function() {
            var issueLink = document.getElementById('issue-count-link');
            if (issueLink) {
                var url = issueLink.href.replace('https://github.com', 'https://api.github.com/repos');
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.onload = function(e) {
                    var parsedResponse = JSON.parse(e.target.responseText);
                    if (parsedResponse instanceof Array) {
                        var count = parsedResponse.length;
                        if (count !== 0) {
                            issueLink.innerHTML = 'This app has ' + count + ' open issues';
                            document.getElementById('issue-count').style.display = 'inline';
                        }
                    }
                };
                xhr.send();
            }
        };
        redirect();
        getFile('learn.json', Learn);
    })();
    global.define = __define;
    return module.exports;
});



System.register("angular", [], function (_export) {
    var angular;
    return {
        setters: [],
        execute: function () {
            "use strict";

            angular = window.angular;

            _export("default", angular);
        }
    };
});
System.register("src/todoItem/index", ["../utils/register"], function (_export) {
    var register;
    return {
        setters: [function (_utilsRegister) {
            register = _utilsRegister["default"];
        }],
        execute: function () {
            "use strict";

            _export("default", register("todoItem", []));
        }
    };
});
System.register("src/providers/Storage", [], function (_export) {
    var _prototypeProperties, _classCallCheck, Storage;

    return {
        setters: [],
        execute: function () {
            "use strict";

            _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

            _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

            Storage = _export("Storage", (function () {
                function Storage() {
                    _classCallCheck(this, Storage);

                    throw Error("Abstract class");
                }

                _prototypeProperties(Storage, null, {
                    add: {
                        value: function add(item) {
                            throw Error("add Not implemented");
                        },
                        writable: true,
                        configurable: true
                    },
                    save: {
                        value: function save(item) {
                            throw Error("save Not implemented");
                        },
                        writable: true,
                        configurable: true
                    },
                    remove: {
                        value: function remove(item) {
                            throw Error("remove Not implemented");
                        },
                        writable: true,
                        configurable: true
                    },
                    get: {
                        value: function get() {
                            throw Error("get Not implemented");
                        },
                        writable: true,
                        configurable: true
                    }
                });

                return Storage;
            })());
        }
    };
});
System.register("src/services/index", ["../utils/register"], function (_export) {
    var register;
    return {
        setters: [function (_utilsRegister) {
            register = _utilsRegister["default"];
        }],
        execute: function () {
            "use strict";

            _export("default", register("services", []));
        }
    };
});
System.register("npm:angular-route@1.3.15/angular-route", [], true, function(require, exports, module) {
    var global = System.global,
        __define = global.define;
    global.define = undefined;
    "format cjs";
    (function(window, angular, undefined) {
        'use strict';
        var ngRouteModule = angular.module('ngRoute', ['ng']).provider('$route', $RouteProvider),
            $routeMinErr = angular.$$minErr('ngRoute');
        function $RouteProvider() {
            function inherit(parent, extra) {
                return angular.extend(Object.create(parent), extra);
            }
            var routes = {};
            this.when = function(path, route) {
                var routeCopy = angular.copy(route);
                if (angular.isUndefined(routeCopy.reloadOnSearch)) {
                    routeCopy.reloadOnSearch = true;
                }
                if (angular.isUndefined(routeCopy.caseInsensitiveMatch)) {
                    routeCopy.caseInsensitiveMatch = this.caseInsensitiveMatch;
                }
                routes[path] = angular.extend(routeCopy, path && pathRegExp(path, routeCopy));
                if (path) {
                    var redirectPath = (path[path.length - 1] == '/') ? path.substr(0, path.length - 1) : path + '/';
                    routes[redirectPath] = angular.extend({redirectTo: path}, pathRegExp(redirectPath, routeCopy));
                }
                return this;
            };
            this.caseInsensitiveMatch = false;
            function pathRegExp(path, opts) {
                var insensitive = opts.caseInsensitiveMatch,
                    ret = {
                        originalPath: path,
                        regexp: path
                    },
                    keys = ret.keys = [];
                path = path.replace(/([().])/g, '\\$1').replace(/(\/)?:(\w+)([\?\*])?/g, function(_, slash, key, option) {
                    var optional = option === '?' ? option : null;
                    var star = option === '*' ? option : null;
                    keys.push({
                        name: key,
                        optional: !!optional
                    });
                    slash = slash || '';
                    return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (star && '(.+?)' || '([^/]+)') + (optional || '') + ')' + (optional || '');
                }).replace(/([\/$\*])/g, '\\$1');
                ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
                return ret;
            }
            this.otherwise = function(params) {
                if (typeof params === 'string') {
                    params = {redirectTo: params};
                }
                this.when(null, params);
                return this;
            };
            this.$get = ['$rootScope', '$location', '$routeParams', '$q', '$injector', '$templateRequest', '$sce', function($rootScope, $location, $routeParams, $q, $injector, $templateRequest, $sce) {
                var forceReload = false,
                    preparedRoute,
                    preparedRouteIsUpdateOnly,
                    $route = {
                        routes: routes,
                        reload: function() {
                            forceReload = true;
                            $rootScope.$evalAsync(function() {
                                prepareRoute();
                                commitRoute();
                            });
                        },
                        updateParams: function(newParams) {
                            if (this.current && this.current.$$route) {
                                newParams = angular.extend({}, this.current.params, newParams);
                                $location.path(interpolate(this.current.$$route.originalPath, newParams));
                                $location.search(newParams);
                            } else {
                                throw $routeMinErr('norout', 'Tried updating route when with no current route');
                            }
                        }
                    };
                $rootScope.$on('$locationChangeStart', prepareRoute);
                $rootScope.$on('$locationChangeSuccess', commitRoute);
                return $route;
                function switchRouteMatcher(on, route) {
                    var keys = route.keys,
                        params = {};
                    if (!route.regexp)
                        return null;
                    var m = route.regexp.exec(on);
                    if (!m)
                        return null;
                    for (var i = 1,
                             len = m.length; i < len; ++i) {
                        var key = keys[i - 1];
                        var val = m[i];
                        if (key && val) {
                            params[key.name] = val;
                        }
                    }
                    return params;
                }
                function prepareRoute($locationEvent) {
                    var lastRoute = $route.current;
                    preparedRoute = parseRoute();
                    preparedRouteIsUpdateOnly = preparedRoute && lastRoute && preparedRoute.$$route === lastRoute.$$route && angular.equals(preparedRoute.pathParams, lastRoute.pathParams) && !preparedRoute.reloadOnSearch && !forceReload;
                    if (!preparedRouteIsUpdateOnly && (lastRoute || preparedRoute)) {
                        if ($rootScope.$broadcast('$routeChangeStart', preparedRoute, lastRoute).defaultPrevented) {
                            if ($locationEvent) {
                                $locationEvent.preventDefault();
                            }
                        }
                    }
                }
                function commitRoute() {
                    var lastRoute = $route.current;
                    var nextRoute = preparedRoute;
                    if (preparedRouteIsUpdateOnly) {
                        lastRoute.params = nextRoute.params;
                        angular.copy(lastRoute.params, $routeParams);
                        $rootScope.$broadcast('$routeUpdate', lastRoute);
                    } else if (nextRoute || lastRoute) {
                        forceReload = false;
                        $route.current = nextRoute;
                        if (nextRoute) {
                            if (nextRoute.redirectTo) {
                                if (angular.isString(nextRoute.redirectTo)) {
                                    $location.path(interpolate(nextRoute.redirectTo, nextRoute.params)).search(nextRoute.params).replace();
                                } else {
                                    $location.url(nextRoute.redirectTo(nextRoute.pathParams, $location.path(), $location.search())).replace();
                                }
                            }
                        }
                        $q.when(nextRoute).then(function() {
                            if (nextRoute) {
                                var locals = angular.extend({}, nextRoute.resolve),
                                    template,
                                    templateUrl;
                                angular.forEach(locals, function(value, key) {
                                    locals[key] = angular.isString(value) ? $injector.get(value) : $injector.invoke(value, null, null, key);
                                });
                                if (angular.isDefined(template = nextRoute.template)) {
                                    if (angular.isFunction(template)) {
                                        template = template(nextRoute.params);
                                    }
                                } else if (angular.isDefined(templateUrl = nextRoute.templateUrl)) {
                                    if (angular.isFunction(templateUrl)) {
                                        templateUrl = templateUrl(nextRoute.params);
                                    }
                                    templateUrl = $sce.getTrustedResourceUrl(templateUrl);
                                    if (angular.isDefined(templateUrl)) {
                                        nextRoute.loadedTemplateUrl = templateUrl;
                                        template = $templateRequest(templateUrl);
                                    }
                                }
                                if (angular.isDefined(template)) {
                                    locals['$template'] = template;
                                }
                                return $q.all(locals);
                            }
                        }).then(function(locals) {
                            if (nextRoute == $route.current) {
                                if (nextRoute) {
                                    nextRoute.locals = locals;
                                    angular.copy(nextRoute.params, $routeParams);
                                }
                                $rootScope.$broadcast('$routeChangeSuccess', nextRoute, lastRoute);
                            }
                        }, function(error) {
                            if (nextRoute == $route.current) {
                                $rootScope.$broadcast('$routeChangeError', nextRoute, lastRoute, error);
                            }
                        });
                    }
                }
                function parseRoute() {
                    var params,
                        match;
                    angular.forEach(routes, function(route, path) {
                        if (!match && (params = switchRouteMatcher($location.path(), route))) {
                            match = inherit(route, {
                                params: angular.extend({}, $location.search(), params),
                                pathParams: params
                            });
                            match.$$route = route;
                        }
                    });
                    return match || routes[null] && inherit(routes[null], {
                            params: {},
                            pathParams: {}
                        });
                }
                function interpolate(string, params) {
                    var result = [];
                    angular.forEach((string || '').split(':'), function(segment, i) {
                        if (i === 0) {
                            result.push(segment);
                        } else {
                            var segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/);
                            var key = segmentMatch[1];
                            result.push(params[key]);
                            result.push(segmentMatch[2] || '');
                            delete params[key];
                        }
                    });
                    return result.join('');
                }
            }];
        }
        ngRouteModule.provider('$routeParams', $RouteParamsProvider);
        function $RouteParamsProvider() {
            this.$get = function() {
                return {};
            };
        }
        ngRouteModule.directive('ngView', ngViewFactory);
        ngRouteModule.directive('ngView', ngViewFillContentFactory);
        ngViewFactory.$inject = ['$route', '$anchorScroll', '$animate'];
        function ngViewFactory($route, $anchorScroll, $animate) {
            return {
                restrict: 'ECA',
                terminal: true,
                priority: 400,
                transclude: 'element',
                link: function(scope, $element, attr, ctrl, $transclude) {
                    var currentScope,
                        currentElement,
                        previousLeaveAnimation,
                        autoScrollExp = attr.autoscroll,
                        onloadExp = attr.onload || '';
                    scope.$on('$routeChangeSuccess', update);
                    update();
                    function cleanupLastView() {
                        if (previousLeaveAnimation) {
                            $animate.cancel(previousLeaveAnimation);
                            previousLeaveAnimation = null;
                        }
                        if (currentScope) {
                            currentScope.$destroy();
                            currentScope = null;
                        }
                        if (currentElement) {
                            previousLeaveAnimation = $animate.leave(currentElement);
                            previousLeaveAnimation.then(function() {
                                previousLeaveAnimation = null;
                            });
                            currentElement = null;
                        }
                    }
                    function update() {
                        var locals = $route.current && $route.current.locals,
                            template = locals && locals.$template;
                        if (angular.isDefined(template)) {
                            var newScope = scope.$new();
                            var current = $route.current;
                            var clone = $transclude(newScope, function(clone) {
                                $animate.enter(clone, null, currentElement || $element).then(function onNgViewEnter() {
                                    if (angular.isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                                        $anchorScroll();
                                    }
                                });
                                cleanupLastView();
                            });
                            currentElement = clone;
                            currentScope = current.scope = newScope;
                            currentScope.$emit('$viewContentLoaded');
                            currentScope.$eval(onloadExp);
                        } else {
                            cleanupLastView();
                        }
                    }
                }
            };
        }
        ngViewFillContentFactory.$inject = ['$compile', '$controller', '$route'];
        function ngViewFillContentFactory($compile, $controller, $route) {
            return {
                restrict: 'ECA',
                priority: -400,
                link: function(scope, $element) {
                    var current = $route.current,
                        locals = current.locals;
                    $element.html(locals.$template);
                    var link = $compile($element.contents());
                    if (current.controller) {
                        locals.$scope = scope;
                        var controller = $controller(current.controller, locals);
                        if (current.controllerAs) {
                            scope[current.controllerAs] = controller;
                        }
                        $element.data('$ngControllerController', controller);
                        $element.children().data('$ngControllerController', controller);
                    }
                    link(scope);
                }
            };
        }
    })(window, window.angular);
    global.define = __define;
    return module.exports;
});



System.register("src/todoList/template.jade!github:johnsoftek/plugin-jade@0.4.0", ["npm:jade@1.9.1/lib/runtime"], true, function(require, exports, module) {
    var global = System.global,
        __define = global.define;
    global.define = undefined;
    var jade = require('npm:jade@1.9.1/lib/runtime');
    module.exports = function template(locals) {
        var buf = [];
        var jade_mixins = {};
        var jade_interp;
        buf.push("<section id=\"todoapp\"><header id=\"header\"><h1>todos</h1><form id=\"todo-form\" ng-submit=\"addTodo()\"><input id=\"new-todo\" placeholder=\"What needs to be done?\" ng-model=\"newTodo\" ng-disabled=\"saving\" autofocus=\"\"/></form></header><section id=\"main\" ng-show=\"todos.length\" ng-cloak=\"\"><input id=\"toggle-all\" type=\"checkbox\" ng-model=\"allChecked\" ng-click=\"markAll(allChecked)\"/><label for=\"toggle-all\">Mark all as complete</label><ul id=\"todo-list\"><li ng-repeat=\"todo in todos | filter:statusFilter track by $index\" ng-class=\"{completed: todo.completed, editing: todo == editedTodo}\"><div class=\"view\"><input type=\"checkbox\" ng-model=\"todo.completed\" ng-change=\"toggleCompleted(todo)\" class=\"toggle\"/><label ng-dblclick=\"editTodo(todo)\">{{todo.title}}</label><button ng-click=\"removeTodo(todo)\" class=\"destroy\"></button></div><form ng-submit=\"saveEdits(todo, 'submit')\"><input ng-trim=\"false\" ng-model=\"todo.title\" todo-escape=\"revertEdits(todo)\" ng-blur=\"saveEdits(todo, 'blur')\" todo-focus=\"todo == editedTodo\" class=\"edit\"/></form></li></ul></section><footer id=\"footer\" ng-show=\"todos.length\" ng-cloak=\"\"><span id=\"todo-count\"><strong>{{remainingCount}}</strong><ng-pluralize count=\"remainingCount\" when=\"{ one: 'item left', other: 'items left' }\"></ng-pluralize></span><ul id=\"filters\"><li><a ng-class=\"{selected: status == ''} \" href=\"#/\">All</a></li><li><a ng-class=\"{selected: status == 'active'}\" href=\"#/active\">Active</a></li><li><a ng-class=\"{selected: status == 'completed'}\" href=\"#/completed\">Completed</a></li></ul><button id=\"clear-completed\" ng-click=\"clearCompletedTodos()\" ng-show=\"completedCount\">Clear completed ({{completedCount}})</button></footer></section><footer id=\"info\"><p>Double-click to edit a todo</p><p>Credits:<a href=\"http://twitter.com/cburgdorf\">Christoph Burgdorf</a>,<a href=\"http://ericbidelman.com\">Eric Bidelman</a>,<a href=\"http://jacobmumm.com\">Jacob Mumm</a> and<a href=\"http://igorminar.com\">Igor Minar</a></p><p>Part of<a href=\"http://todomvc.com\">TodoMVC</a></p></footer>");
        ;
        return buf.join("");
    };
    global.define = __define;
    return module.exports;
});



System.register("npm:todomvc-common@1.0.1", ["npm:todomvc-common@1.0.1/base"], true, function(require, exports, module) {
    var global = System.global,
        __define = global.define;
    global.define = undefined;
    module.exports = require("npm:todomvc-common@1.0.1/base");
    global.define = __define;
    return module.exports;
});



System.register("src/providers/LocalStorage", ["./Storage", "angular"], function (_export) {
    var Storage, angular, _prototypeProperties, _inherits, _classCallCheck, STORAGE_ID, LocalStorage;

    return {
        setters: [function (_Storage) {
            Storage = _Storage.Storage;
        }, function (_angular) {
            angular = _angular["default"];
        }],
        execute: function () {
            "use strict";

            _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

            _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

            _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

            STORAGE_ID = "todo-module";

            LocalStorage = (function (Storage) {
                function LocalStorage() {
                    _classCallCheck(this, LocalStorage);

                    this.items = this.StorageItems;
                }

                _inherits(LocalStorage, Storage);

                _prototypeProperties(LocalStorage, null, {
                    StorageItems: {

                        /**
                         * @returns {Array}
                         */

                        get: function () {
                            return JSON.parse(localStorage.getItem(STORAGE_ID) || "[]");
                        },
                        configurable: true
                    },
                    setStorageItems: {

                        /**
                         * @returns {Promise}
                         */

                        value: function setStorageItems() {
                            var _this = this;

                            return new Promise(function (resolve, reject) {
                                localStorage.setItem(STORAGE_ID, JSON.stringify(_this.items));
                                resolve(_this.items);
                            });
                        },
                        writable: true,
                        configurable: true
                    },
                    add: {

                        /**
                         * @param {*} item
                         * @returns {Promise}
                         */

                        value: function add(item) {
                            var _this = this;

                            return new Promise(function (resolve, reject) {
                                _this.items.push(item);
                                _this.setStorageItems().then(function (items) {
                                    resolve(items);
                                });
                            });
                        },
                        writable: true,
                        configurable: true
                    },
                    save: {

                        /**
                         * @param item
                         * @returns {Promise}
                         */

                        value: function save(item) {
                            var _this = this;

                            return new Promise(function (resolve, reject) {
                                _this.items[_this.items.indexOf(item)] = item;
                                _this.setStorageItems().then(function (items) {
                                    resolve(items);
                                });
                            });
                        },
                        writable: true,
                        configurable: true
                    },
                    remove: {

                        /**
                         * @param item
                         * @returns {Promise}
                         */

                        value: function remove(item) {
                            var _this = this;

                            return new Promise(function (resolve, reject) {
                                _this.items.splice(_this.items.indexOf(item), 1);
                                _this.setStorageItems().then(function (items) {
                                    resolve(items);
                                });
                            });
                        },
                        writable: true,
                        configurable: true
                    },
                    get: {

                        /**
                         * @returns {*}
                         */

                        value: function get() {
                            return this.items;
                        },
                        writable: true,
                        configurable: true
                    },
                    filter: {
                        value: function filter(callback) {
                            var _this = this;

                            return new Promise(function (resolve, reject) {
                                var incompleteTodos = _this.items.filter(callback);
                                angular.copy(incompleteTodos, _this.items);
                                _this.setStorageItems().then(function (items) {
                                    resolve(items);
                                });
                            });
                        },
                        writable: true,
                        configurable: true
                    }
                });

                return LocalStorage;
            })(Storage);

            _export("default", LocalStorage);
        }
    };
});
System.register("npm:angular-route@1.3.15/index", ["./angular-route"], true, function(require, exports, module) {
    var global = System.global,
        __define = global.define;
    global.define = undefined;
    require("./angular-route");
    module.exports = 'ngRoute';
    global.define = __define;
    return module.exports;
});



System.register("src/todoList/TodoListDirective", ["./template.jade!", "./style.css!", "todomvc-common", "todomvc-common/base.css!", "todomvc-app-css/index.css!", "angular"], function (_export) {
    var template, angular, _prototypeProperties, _classCallCheck, TodoListDirective;

    return {
        setters: [function (_templateJade) {
            template = _templateJade["default"];
        }, function (_styleCss) {}, function (_todomvcCommon) {}, function (_todomvcCommonBaseCss) {}, function (_todomvcAppCssIndexCss) {}, function (_angular) {
            angular = _angular["default"];
        }],
        execute: function () {
            "use strict";

            _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

            _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

            TodoListDirective = (function () {
                function TodoListDirective() {
                    _classCallCheck(this, TodoListDirective);

                    this.restrict = "E";
                    this.template = template;
                    this.scope = {};
                }

                _prototypeProperties(TodoListDirective, null, {
                    link: {
                        value: function link(scope, element, attrs) {},
                        writable: true,
                        configurable: true
                    },
                    controller: {
                        value: function controller($scope, $routeParams, $filter, todoStorage) {

                            $scope.todos = [];
                            $scope.newTodo = "";
                            $scope.editedTodo = null;
                            var todos = $scope.todos = todoStorage.get();

                            $scope.$watch("todos", function () {
                                $scope.remainingCount = $filter("filter")(todos, { completed: false }).length;
                                $scope.completedCount = todos.length - $scope.remainingCount;
                                $scope.allChecked = !$scope.remainingCount;
                            }, true);

                            // Monitor the current route for changes and adjust the filter accordingly.
                            $scope.$on("$routeChangeSuccess", function () {
                                var status = $scope.status = $routeParams.status || "";

                                $scope.statusFilter = status === "active" ? { completed: false } : status === "completed" ? { completed: true } : null;
                            });

                            $scope.addTodo = function () {
                                var newTodo = {
                                    title: $scope.newTodo.trim(),
                                    completed: false
                                };

                                if (!newTodo.title) {
                                    return;
                                }

                                $scope.saving = true;

                                todoStorage.add(newTodo).then(function () {
                                    $scope.newTodo = "";
                                    $scope.saving = false;
                                }).then(function () {});
                            };

                            $scope.editTodo = function (todo) {
                                $scope.editedTodo = todo;
                                // Clone the original todo to restore it on demand.
                                $scope.originalTodo = angular.extend({}, todo);
                            };

                            $scope.saveEdits = function (todo, event) {
                                // Blur events are automatically triggered after the form submit event.
                                // This does some unfortunate logic handling to prevent saving twice.
                                if (event === "blur" && $scope.saveEvent === "submit") {
                                    $scope.saveEvent = null;
                                    return;
                                }

                                $scope.saveEvent = event;

                                if ($scope.reverted) {
                                    // Todo edits were reverted-- don't save.
                                    $scope.reverted = null;
                                    return;
                                }

                                todo.title = todo.title.trim();

                                if (todo.title === $scope.originalTodo.title) {
                                    $scope.editedTodo = null;
                                    return;
                                }

                                todoStorage.save(todo)["catch"](function () {
                                    todo.title = $scope.originalTodo.title;
                                }).then(function () {
                                    $scope.editedTodo = null;
                                });
                            };

                            $scope.revertEdits = function (todo) {
                                todos[todos.indexOf(todo)] = $scope.originalTodo;
                                $scope.editedTodo = null;
                                $scope.originalTodo = null;
                                $scope.reverted = true;
                            };

                            $scope.removeTodo = function (todo) {
                                todoStorage.remove(todo);
                            };

                            $scope.toggleCompleted = function (todo) {
                                todoStorage.save(todo)["catch"](function (error) {
                                    throw error;
                                });
                            };

                            $scope.clearCompletedTodos = function () {
                                todoStorage.filter(function (todo) {
                                    return !todo.completed;
                                });
                            };

                            $scope.markAll = function (completed) {
                                console.log(todos, completed);
                                todos.forEach(function (todo) {
                                    if (todo.completed !== completed) {
                                        todo.completed = !todo.completed;
                                        $scope.toggleCompleted(todo);
                                    }
                                });
                            };
                        },
                        writable: true,
                        configurable: true
                    }
                });

                return TodoListDirective;
            })();

            _export("default", TodoListDirective);

            TodoListDirective.$inject = ["todoStorage"];
        }
    };
});
System.register("src/providers/index", ["../utils/register", "./LocalStorage"], function (_export) {
    var register, LocalStorage;
    return {
        setters: [function (_utilsRegister) {
            register = _utilsRegister["default"];
        }, function (_LocalStorage) {
            LocalStorage = _LocalStorage["default"];
        }],
        execute: function () {
            "use strict";

            _export("default", register("todo.providers", []).service("todoStorage", LocalStorage));
        }
    };
});
System.register("npm:angular-route@1.3.15", ["npm:angular-route@1.3.15/index"], true, function(require, exports, module) {
    var global = System.global,
        __define = global.define;
    global.define = undefined;
    module.exports = require("npm:angular-route@1.3.15/index");
    global.define = __define;
    return module.exports;
});



System.register("src/todoList/index", ["../utils/register", "./TodoListDirective"], function (_export) {
    var register, TodoListDirective;
    return {
        setters: [function (_utilsRegister) {
            register = _utilsRegister["default"];
        }, function (_TodoListDirective) {
            TodoListDirective = _TodoListDirective["default"];
        }],
        execute: function () {
            "use strict";

            _export("default", register("todoList").directive("todo", TodoListDirective));

            console.log("directive todoList loaded");
        }
    };
});
System.register("src/Todo", ["./todoList/index", "./todoItem/index", "./providers/index", "./services/index", "angular-route"], function (_export) {
    var TodoList, TodoItem, Providers, Services;
    return {
        setters: [function (_todoListIndex) {
            TodoList = _todoListIndex["default"];
        }, function (_todoItemIndex) {
            TodoItem = _todoItemIndex["default"];
        }, function (_providersIndex) {
            Providers = _providersIndex["default"];
        }, function (_servicesIndex) {
            Services = _servicesIndex["default"];
        }, function (_angularRoute) {}],
        execute: function () {
            "use strict";

            console.log(TodoList);

            _export("default", angular.module("TodoModules", ["ngRoute", Services.name, TodoList.name, TodoItem.name, Providers.name]));

            console.log("ToDoModules loaded");
        }
    };
});
System.register('src/todoList/style.css!github:systemjs/plugin-css@0.1.6', [], false, function() {});
System.register('npm:todomvc-common@1.0.1/base.css!github:systemjs/plugin-css@0.1.6', [], false, function() {});
System.register('npm:todomvc-app-css@1.0.1/index.css!github:systemjs/plugin-css@0.1.6', [], false, function() {});
(function(c){var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[i]?s[i].cssText=c:s[a](d.createTextNode(c));})
("body{background:rgba(0,55,197,.49)}hr{margin:20px 0;border:0;border-top:1px dashed #c5c5c5;border-bottom:1px dashed #f7f7f7}.learn a{font-weight:400;text-decoration:none;color:#b83f45}.learn a:hover{text-decoration:underline;color:#787e7e}.learn h3,.learn h4,.learn h5{margin:10px 0;font-weight:500;line-height:1.2;color:#000}.learn h3{font-size:24px}.learn h4{font-size:18px}.learn h5{margin-bottom:0;font-size:14px}.learn ul{padding:0;margin:0 0 30px 25px}.learn li{line-height:20px}.learn p{font-size:15px;font-weight:300;line-height:1.3;margin-top:0;margin-bottom:0}#issue-count{display:none}.quote{border:none;margin:20px 0 60px}.quote p{font-style:italic}.quote p:before{content:'“';font-size:50px;opacity:.15;position:absolute;top:-20px;left:3px}.quote p:after{content:'”';font-size:50px;opacity:.15;position:absolute;bottom:-42px;right:3px}.quote footer{position:absolute;bottom:-40px;right:0}.quote footer img{border-radius:3px}.quote footer a{margin-left:5px;vertical-align:middle}.speech-bubble{position:relative;padding:10px;background:rgba(0,0,0,.04);border-radius:5px}.speech-bubble:after{content:'';position:absolute;top:100%;right:30px;border:13px solid transparent;border-top-color:rgba(0,0,0,.04)}.learn-bar>.learn{position:absolute;width:272px;top:8px;left:-300px;padding:10px;border-radius:5px;background-color:rgba(255,255,255,.6);transition-property:left;transition-duration:500ms}@media (min-width:899px){.learn-bar{width:auto;padding-left:300px}.learn-bar>.learn{left:8px}}body,html{margin:0;padding:0}button{margin:0;padding:0;border:0;background:0 0;font-size:100%;vertical-align:baseline;font-family:inherit;font-weight:inherit;color:inherit;-webkit-appearance:none;-ms-appearance:none;appearance:none;-webkit-font-smoothing:antialiased;-moz-font-smoothing:antialiased;-ms-font-smoothing:antialiased;font-smoothing:antialiased}body{font:14px 'Helvetica Neue',Helvetica,Arial,sans-serif;line-height:1.4em;background:#f5f5f5;color:#4d4d4d;min-width:230px;max-width:550px;margin:0 auto;-webkit-font-smoothing:antialiased;-moz-font-smoothing:antialiased;-ms-font-smoothing:antialiased;font-smoothing:antialiased;font-weight:300}button,input[type=checkbox]{outline:0}.hidden{display:none}#todoapp{background:#fff;margin:130px 0 40px;position:relative;box-shadow:0 2px 4px 0 rgba(0,0,0,.2),0 25px 50px 0 rgba(0,0,0,.1)}#todoapp input::-webkit-input-placeholder{font-style:italic;font-weight:300;color:#e6e6e6}#todoapp input::-moz-placeholder{font-style:italic;font-weight:300;color:#e6e6e6}#todoapp input::input-placeholder{font-style:italic;font-weight:300;color:#e6e6e6}#todoapp h1{position:absolute;top:-155px;width:100%;font-size:100px;font-weight:100;text-align:center;color:rgba(175,47,47,.15);-webkit-text-rendering:optimizeLegibility;-moz-text-rendering:optimizeLegibility;-ms-text-rendering:optimizeLegibility;text-rendering:optimizeLegibility}#new-todo,.edit{position:relative;margin:0;width:100%;font-size:24px;font-family:inherit;font-weight:inherit;line-height:1.4em;outline:0;color:inherit;padding:6px;border:1px solid #999;box-shadow:inset 0 -1px 5px 0 rgba(0,0,0,.2);-ms-box-sizing:border-box;box-sizing:border-box;-webkit-font-smoothing:antialiased;-moz-font-smoothing:antialiased;-ms-font-smoothing:antialiased;font-smoothing:antialiased}#new-todo{padding:16px 16px 16px 60px;border:none;background:rgba(0,0,0,.003);box-shadow:inset 0 -2px 1px rgba(0,0,0,.03)}#main{position:relative;z-index:2;border-top:1px solid #e6e6e6}label[for=toggle-all]{display:none}#toggle-all{position:absolute;top:-55px;left:-12px;width:60px;height:34px;text-align:center;border:none}#toggle-all:before{content:'❯';font-size:22px;color:#e6e6e6;padding:10px 27px}#toggle-all:checked:before{color:#737373}#todo-list{margin:0;padding:0;list-style:none}#todo-list li{position:relative;font-size:24px;border-bottom:1px solid #ededed}#todo-list li:last-child{border-bottom:none}#todo-list li.editing{border-bottom:none;padding:0}#todo-list li.editing .edit{display:block;width:506px;padding:13px 17px 12px;margin:0 0 0 43px}#todo-list li.editing .view{display:none}#todo-list li .toggle{text-align:center;width:40px;height:auto;position:absolute;top:0;bottom:0;margin:auto 0;border:none;-webkit-appearance:none;-ms-appearance:none;appearance:none}#todo-list li .toggle:after{content:url(data:image/svg+xml;utf8,<svg xmlns=http://www.w3.org/2000/svg width=40 height=40 viewBox=-10 -18 100 135><circle cx=50 cy=50 r=50 fill=none stroke=#ededed stroke-width=3/></svg>)}#todo-list li .toggle:checked:after{content:url(data:image/svg+xml;utf8,<svg xmlns=http://www.w3.org/2000/svg width=40 height=40 viewBox=-10 -18 100 135><circle cx=50 cy=50 r=50 fill=none stroke=#bddad5 stroke-width=3/><path fill=#5dc2af d=M72 25L42 71 27 56l-4 4 20 20 34-52z/></svg>)}#todo-list li label{white-space:pre;word-break:break-word;padding:15px 60px 15px 15px;margin-left:45px;display:block;line-height:1.2;transition:color .4s}#todo-list li.completed label{color:#d9d9d9;text-decoration:line-through}#todo-list li .destroy{display:none;position:absolute;top:0;right:10px;bottom:0;width:40px;height:40px;margin:auto 0 11px;font-size:30px;color:#cc9a9a;transition:color .2s ease-out}#todo-list li .destroy:hover{color:#af5b5e}#todo-list li .destroy:after{content:'×'}#todo-list li:hover .destroy{display:block}#todo-list li .edit{display:none}#todo-list li.editing:last-child{margin-bottom:-1px}#footer{color:#777;padding:10px 15px;height:20px;text-align:center;border-top:1px solid #e6e6e6}#footer:before{content:'';position:absolute;right:0;bottom:0;left:0;height:50px;overflow:hidden;box-shadow:0 1px 1px rgba(0,0,0,.2),0 8px 0 -3px #f6f6f6,0 9px 1px -3px rgba(0,0,0,.2),0 16px 0 -6px #f6f6f6,0 17px 2px -6px rgba(0,0,0,.2)}#todo-count{float:left;text-align:left}#todo-count strong{font-weight:300}#filters{margin:0;padding:0;list-style:none;position:absolute;right:0;left:0}#filters li{display:inline}#filters li a{color:inherit;margin:3px;padding:3px 7px;text-decoration:none;border:1px solid transparent;border-radius:3px}#filters li a.selected,#filters li a:hover{border-color:rgba(175,47,47,.1)}#filters li a.selected{border-color:rgba(175,47,47,.2)}#clear-completed,html #clear-completed:active{float:right;line-height:20px;text-decoration:none;cursor:pointer;visibility:hidden;position:relative}#clear-completed::after{visibility:visible;content:'Clear completed';position:absolute;right:0;white-space:nowrap}#clear-completed:hover::after{text-decoration:underline}#info{margin:65px auto 0;color:#bfbfbf;font-size:10px;text-shadow:0 1px 0 rgba(255,255,255,.5);text-align:center}#info p{line-height:1}#info a{color:inherit;text-decoration:none;font-weight:400}#info a:hover{text-decoration:underline}@media screen and (-webkit-min-device-pixel-ratio:0){#todo-list li .toggle,#toggle-all{background:0 0}#todo-list li .toggle{height:40px}#toggle-all{-webkit-transform:rotate(90deg);transform:rotate(90deg);-webkit-appearance:none;appearance:none}}@media (max-width:430px){#footer{height:50px}#filters{bottom:10px}}");
//# sourceMappingURL=todo-systemjs.js.map