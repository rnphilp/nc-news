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
        it('GET status:200 responds with an array of all the topic objects', () => {
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
    describe.only('/articles', () => {
      describe('DEFAULT BEHAVIOUR', () => {
        it('GET status:200 responds with an array of all article objects', () => {
          return request
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => {
              articles.forEach((article) => {
                expect(article).to.contain.keys(
                  'author',
                  'title',
                  'article_id',
                  'topic',
                  'created_at',
                  'votes',
                );
              });
            });
        });
        it('GET status:200 includes a count of the comments on each article', () => {
          return request
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => {
              articles.forEach((article) => {
                expect(article).to.contain.keys('comment_count');
              });
              return articles;
            })
            .then((articles) => {
              expect(articles).to.deep.include({
                author: 'butter_bridge',
                title: 'Living in the shadow of a great man',
                article_id: 1,
                topic: 'mitch',
                created_at: '2018-11-15T00:00:00.000Z',
                votes: 100,
                comment_count: '13',
              });
            });
        });
        it('GET status:200 response sorts by date in descending order', () => {
          return request
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles: [article] } }) => {
              expect(article.title).to.eql('Living in the shadow of a great man');
            });
        });
      });
    });
  });
});
