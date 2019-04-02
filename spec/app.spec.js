process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');

const app = require('../app');
const connection = require('../db/connection');

const request = supertest(app);

describe('/', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe('/api', () => {
    it('GET status:200', () => {
      return request
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true);
        });
    });
    describe('/topics', () => {
      describe('DEFAULT BEHAVIOUR', () => {
        it('GET status:200 responds with all an array of all the topic objects', () => {
          return request
            .get('/api/topics')
            .expect(200)
            .then(({ body: { topics } }) => {
              topics.forEach((topic) => {
                expect(topic).to.contain.keys('slug', 'description');
              });
            });
        });
      });
      describe('HANDLE ERRORS', () => {
        it('POST, PUT, PATCH, DELETE status:405 handle methods that do not exist for this end point', () => {
          const invalidMethods = ['post', 'put', 'patch', 'delete'];
          return Promise.all(
            invalidMethods.map((method) => {
              return request[method]('/api/topics')
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('Method Not Allowed');
                });
            }),
          );
        });
      });
    });
  });
});
