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

### Initializing the Project

To get started, we'll be creating the skeleton of our project.
You'll need to have Node and NPM installed. If you don't,
(use Homebrew to install them)[http://shapeshed.com/setting-up-nodejs-and-npm-on-mac-osx/].

Next, create the folder where you want to store the project, then run:

`npm init`

You can leave the fields blank or accept the defaults for the purposes
of this demo.

### Pulling In Dependencies

Now we're going to get set up with some tools that we'll be using to
facilitate managing our dependencies, and testing.

Type this command to get the node packages we'll be using:

`npm install --save-dev browserify partialify bower browserify-shim protractor
karma karma-cli karma-mocha karma-chrome-launcher karma-firefox-launcher
karma-phantomjs-launcher mocha chai chai-as-promised sinon sinon-chai`

Here's what we're setting up:

Browserify: Makes it easy to require JavaScript modules and functions
between files, so we can organize our project in a modular fashion.

Partialify: Works with browserify, and allows us to require HTML, CSS,
and other files from each other, which will facilitate getting templates
hooked up to their directives.

Bower: Another package management tool, used to pull in client-side
packages. We'll be using it to grab Angular.

Browserify-shim: Allows us to require bower components and have them
included in the browserify build.

Protractor: The end-to-end testing framework for Angular. We'll be using it in
Part 2 of this series.

Karma: A unit-test runner.

Karma-cli: Command line tools for running tests with Karma.

Karma-chrome-launcher, karma-firefox-launcher, karma-phantomjs-launcher:
These allow us to launch these browsers in our karma tests.

Mocha: JavaScript testing framework.

Chai: Assertion library that we'll use with mocha to drive BDD-style
testing.

Chai-as-promised: Plugin for chai that will make it easier to test
functions that return a promise.

Sinon: Mocking and stubbing library.

Sinon-chai: Adds assertions to chai that we can use to check how mocks
were called.

Once you've got all of these packages installed, you can open up
`package.json` to see a list of the packages we're using. Our next steps
will be to set up Angular and Angular-mocks (which we'll use to test our
Angular components down the road).

### Install Bower and Angular

If you don't have bower installed globally, you'll need to do that
first.

`npm install -g bower`

Next, we'll pull in the packages we want to get from bower.

Install Angular
`bower install --save angular angular-mocks`

### Set up browserify-shim

In order to make angular with browserify, we need
to shim them into browserify. We're also using partialify here so that
we can easily require our HTML templates in our directives.

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

### Set Up Karma & Mocha

Now that we have browserify and angular set up, let's set up our testing
framework, Karma.

Set up the configuration with:

`./node_modules/.bin/karma init`

When the prompts come up, choose `mocha` as your testing framework. You
can say `no` to using `require`. Capture Chrome automatically, and set
the test file location to `test/build.js`. Just hit enter or choose `no` to the
rest of the prompts.

When it's done, you should have a new file called `karma.conf.js`. Open
it up and add these options:

```
browsers: ['Chrome', 'Firefox', 'PhantomJS']
singleRun: true
```

## Setting Up The Test Helper

Now we're ready to write a test helper. Run these commands:

`mkdir test`
`touch test/test-helper.js`

Then open the test helper and add these lines:

```
require('angular');
require('angular-mocks');

require('chai').use(require('sinon-chai'));
require('chai').use(require('chai-as-promised'));

var sinon = require('sinon');

beforeEach(function() {
  this.sinon = sinon.sandbox.create();
});

afterEach(function() {
  this.sinon.restore();
});


```

### Writing our first test

Finally, let's write our first test:

`touch test/index.js`

```test/index.js
require('./test-helper');
var expect = require('chai').expect;

it('should not blow up', function() {
  expect(true).to.be.true;
});

```

Now we can use browserify to build the test file, and it will pull in
our helper, along with Angular Mocks, Chai, Mocha, Sinon, and everything else
we need.

`./node_modules/.bin/browserify test/index.js -o test-build.js `

To run the test:

`./node_modules/.bin/karma start karma.conf.js`

You should see it pass in Chrome, Firefox, and PhantomJS!


## Write Some Code

Ok, we've got our testing tools set up. Let's set up the actual app
now.

`touch index.html`

```
<!DOCTYPE html>
<head>
  <title>Angular Testing</title>
  <script src="build.js"></script>
  <meta charset="utf-8">
</head>
<body ng-app="angular-testing">
</body>
```

`touch index.js`

```index.js
var angular = require('angular');
angular.module('angular-testing', []);
require('./widgets');
```

`mkdir -p widgets/login`
`touch widgets/index.js widgets/login/index.js widgets/login/login-directive.js`

```widgets/index.js
require('./login');
```

```widgets/login/index.js
angular.module('angular-testing.login', []);
require('./login-directive');
```

```widgets/login/login-directive.js
var angular = require('angular');
angular.module('angular-testing.login').directive('login', function() {
  return {
    restrict: 'E',
    template: require('./login-template.html')
  };
});
```

```index.js
var angular = require('angular');
angular.module('angular-testing', [
  'angular-testing.login'
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
  <title>Angular Testing</title>
  <script src="build.js"></script>
  <meta charset="utf-8">
</head>
<body ng-app="angular-testing">
  <login></login>
</body>

```

`open index.html`

You should see "Hello World"!

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
