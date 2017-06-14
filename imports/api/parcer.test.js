import { assert } from 'meteor/practicalmeteor:chai';
const parcer = require('../api/parcer.js');
  
describe("Parcer", function() {
  it("Takes string, returns object", function() {
    assert(typeof parcer, String);
  });
});
