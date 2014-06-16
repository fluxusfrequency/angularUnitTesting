require('angular');
require('angular-mocks');

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
