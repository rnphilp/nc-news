const { expect } = require('chai');
const { objDateToSql } = require('../utils/util-helpers');

describe('objDateToSql()', () => {
  it('converts an integer on an object representing a javascript dateTime to a date string to be inputted into pg, when passed a single object in an array. The original array and objects remain unchanged.', () => {
    const inputArr = [{ date: 1542284514171 }];
    const outputArr = [{ date: '2018-11-15T12:21:54.171Z' }];
    expect(objDateToSql(inputArr, 'date')).to.eql(outputArr);
    expect(inputArr).to.not.equal(outputArr);
  });
  it('converts an integer on an object representing a javascript dateTime to a date string to be inputted into pg, when passed an array of objects in an array. The original array and objects remain unchanged.', () => {
    const inputArr = [
      { date: 1542284514171, other: 'string' },
      { date: 154700514171, other: 'string2' }
    ];
    const outputArr = [
      { date: '2018-11-15T12:21:54.171Z', other: 'string' },
      { date: '1974-11-26T12:21:54.171Z', other: 'string2' }
    ];
    expect(objDateToSql(inputArr, 'date')).to.eql(outputArr);
    expect(inputArr).to.not.equal(outputArr);
  });
});
