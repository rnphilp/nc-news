const { expect } = require('chai');
const {
  datesToSql,
  createLookup,
  replaceKeys,
  renameKeys
} = require('../utils/util-helpers');

describe('datesToSql()', () => {
  it('converts an integer on an object representing a javascript dateTime to a date string to be inputted into pg, when passed a single object in an array. The original array and objects remain unchanged.', () => {
    const inputArr = [{ date: 1542284514171 }];
    const outputArr = [{ date: '2018-11-15T12:21:54.171Z' }];
    expect(datesToSql(inputArr, 'date')).to.eql(outputArr);
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
    expect(datesToSql(inputArr, 'date')).to.eql(outputArr);
    expect(inputArr).to.not.equal(outputArr);
  });
});

describe('createLookup()', () => {
  it('returns a single item lookup object when passed a single item array', () => {
    const arr = [{ forename: 'firstname-b', surname: 'lastname-b', age: 30 }];
    const lookupObj = { 'firstname-b': 30 };
    expect(createLookup(arr, 'forename', 'age')).to.eql(lookupObj);
  });
  it('returns a two item lookup object when passed a two item array', () => {
    const arr = [
      { forename: 'firstname-b', surname: 'lastname-b', age: 30 },
      { forename: 'firstname-c', surname: 'lastname-c', age: 21 }
    ];
    const lookupObj = { 'firstname-b': 30, 'firstname-c': 21 };
    expect(createLookup(arr, 'forename', 'age')).to.eql(lookupObj);
  });
});

describe('replaceKeys()', () => {
  it('replaces a key value pair based on a lookup object for a single item array', () => {
    const arr = [{ forename: 'firstname-b', surname: 'lastname-b', age: 30 }];
    const lookupObj = { 'firstname-b': 1234 };
    const output = [{ person_id: 1234, surname: 'lastname-b', age: 30 }];
    expect(replaceKeys(arr, lookupObj, 'forename', 'person_id')).to.eql(output);
  });
  it('replaces a key value pair based on a lookup object for a multiple item array', () => {
    const arr = [
      { forename: 'firstname-b', surname: 'lastname-b', age: 30 },
      { forename: 'firstname-c', surname: 'lastname-c', age: 21 }
    ];
    const lookupObj = {
      'firstname-b': 1234,
      'firstname-c': 5678
    };
    const output = [
      { person_id: 1234, surname: 'lastname-b', age: 30 },
      { person_id: 5678, surname: 'lastname-c', age: 21 }
    ];
    expect(replaceKeys(arr, lookupObj, 'forename', 'person_id')).to.eql(output);
  });
});

describe('renameKeys()', () => {
  it('returns a new array of new objects with the specified key renamed when passed an array with a single object', () => {
    const inputArr = [{ foo: 'bar' }];
    const outputArr = [{ baz: 'bar' }];
    const res = renameKeys(inputArr, 'foo', 'baz');
    expect(res).to.eql(outputArr);
    expect(res).to.not.equal(inputArr);
    expect(res[0]).to.not.equal(inputArr[0]);
  });
  it('returns a new array of new objects with the specified key renamed when passed an array of objects', () => {
    const inputArr = [
      { foo: 'bar', name: 'random' },
      { foo: 'baz', animal: 'monkey' }
    ];
    const outputArr = [
      { baz: 'bar', name: 'random' },
      { baz: 'baz', animal: 'monkey' }
    ];
    const res = renameKeys(inputArr, 'foo', 'baz');
    expect(res).to.eql(outputArr);
    expect(res).to.not.equal(inputArr);
    expect(res[0]).to.not.equal(inputArr[0]);
  });
});
