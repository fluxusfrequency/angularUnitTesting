# Using TDD to Build Angular App - Really - Part 1

## Introduction

In many circles, Angular.js is the new hotness. It seems like every modern
JavaScript framework introduction these days starts with: "Look! Two-way
data binding!" Angular does too, but its real value lies in some of its
other features. One of its strengths is the semantic way you can easily split
and nest your views into components using HTML-like tags. Another is
that it's "designed from ground up to be testable".

Yet every time I've dug through an Angular tutorial on the interwebs, it seems
like the testing part is hand-waved. Too often, a basic test is shown,
but none of the setup, and none of what to do about mocking
dependencies, how to deal with promises coming back from $httpBackend.
In short, I feel like there's a lot of basic information on testing, but
little about how to get into a workflow where you can actually get
things done.

In this three part series, we'll examine how to use TDD to build an Angular app.
In part one, we'll look at getting a development environment set up.
In part two, we'll examine End-to-End testing: using Protractor, DRYing up test
code, and dealing with promises.
Finally, in part three, we'll look at Unit Testing: stubbing dependencies,
dealing with child and isolate scopes, http reqeusts, and other gotchas.

## Part 1: Setting Up a Development Environment for Angular.



### Pulling In Dependencies

`npm init`
(yes to all)
`npm install --save-dev browserify partialify protractor karma karma-cli
karma-mocha karma-chrome-launcher karma-firefox-launcher
karma-phantomjs-launcher mocha chai chai-as-promised sinon bower
browserify-shim sinon-chai`

### Set Up Protractor
`./node_modules/.bin/protractor init`

### Set Up Karma & Mocha
`./node_modules/.bin/karma init`

Choose `mocha`.
No to require
Capture Chrome
Set to `test/build.js` (confirm)
Just hit enter or choose `no` to the rest.

Open up `karma.conf.js` and add:
`browsers: ['Chrome', 'Firefox', 'PhantomJS']`
`singleRun: true`

### Install Bower and Angular

`npm install -g bower`

Install Angular
`bower install --save angular angular-mocks`

### Set up browserify-shim

add browserify-shim block to package.json:
```
"browserify": {
  "transform": [
  	"partialify",
    "browserify-shim"
  ]
},
"browserify-shim": {
  "angular": "angular"
},
"browser": {
  "angular": "./bower_components/angular/angular.js",
  "angular-mocks": "./bower_components/angular-mocks/angular-mocks.js"
}
```

- Angular
- Angular Mocks
	- Pull in the angular module, with its dependencies
- Mocha
- Chai.expect
- Chai as promised
- Sinon
	- beforeEach: `this.sinon = sinon.sandbox.create()`
	- afterEach: `this.sinon.restore()`
	- polyfill function bind for Phantom.js
- Sinon-Chai



## Setting Up A Test
`mkdir test`
`touch test/index.js`

```
require('angular');
require('angular-mocks');

require('./index');

require('chai').use(require('sinon-chai'));
require('chai').use(require('chai-as-promised'));

var expect = require('chai').expect;

var sinon = require('sinon');

beforeEach(function() {
  this.sinon = sinon.sandbox.create();
});

afterEach(function() {
  this.sinon.restore();
});

it('', function() {
  expect(true).to.be.true;
});

```

`./node_modules/.bin/browserify test/index.js -o test-build.js `

`./node_modules/.bin/karma start karma.conf.js`


## Write Some Code

`touch index.html`

```
<!DOCTYPE html>
<head>
  <title>Angular Unit Testing</title>
  <script src="build.js"></script>
  <meta charset="utf-8">
</head>
<body ng-app="angular-unit-testing">
</body>
```

`touch index.js`

```index.js
var angular = require('angular');
angular.module('angular-unit-testing', []);
require('./widgets');
```

`mkdir -p widgets/login`
`touch widgets/index.js widgets/login/index.js widgets/login/login-directive.js`

```widgets/index.js
require('./login');
```

```widgets/login/index.js
angular.module('angular-unit-testing.login', []);
require('./login-directive');
```

```widgets/login/login-directive.js
var angular = require('angular');
angular.module('angular-unit-testing.login').directive('login', function() {
  return {
    restrict: 'E',
    template: require('./login-template.html')
  };
});
```

```index.js
var angular = require('angular');
angular.module('angular-unit-testing', [
  'angular-unit-testing.login'
]);
require('./widgets');
```

`touch widgets/login/login-template.html`

```widgets/login/login-template.html
<h1>Hello, world!</h1>
```

```index.html
<!DOCTYPE html>
<head>
  <title>Angular Unit Testing</title>
  <script src="build.js"></script>
  <meta charset="utf-8">
</head>
<body ng-app="angular-unit-testing">
  <login></login>
</body>

```

`open index.html`


## Run the test


- Angular Mock Module
- Injecting Dependencies
- Setting up the scope
- beforeEach $compile step
- afterEach scope destroy


## Gotchas

### Mocking Out Dependencies

- Flash service

### Handling Child Scopes and Isolate Scopes

### Dealing With The $http Service

- $httpBackend

### Don't Forget to $digest!


## Conclusion
