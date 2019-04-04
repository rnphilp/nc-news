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
    describe('/articles', () => {
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
      describe('QUERIES', () => {
        it('GET status:200 response filters by author', () => {
          return request
            .get('/api/articles?author=butter_bridge')
            .expect(200)
            .then(({ body: { articles } }) => {
              articles.forEach((article) => {
                expect(article.author).to.equal('butter_bridge');
              });
            });
        });
        it('GET status:200 response filters by topic', () => {
          return request
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({ body: { articles } }) => {
              articles.forEach((article) => {
                expect(article.topic).to.equal('mitch');
              });
            });
        });
        it('GET status:200 response sorts by valid property', () => {
          return request
            .get('/api/articles?sort_by=votes')
            .expect(200)
            .then(({ body: { articles: [article] } }) => {
              expect(article.title).to.equal('Living in the shadow of a great man');
            });
        });
        it('GET status:200 response sorts in ascending order', () => {
          return request
            .get('/api/articles?order=asc')
            .expect(200)
            .then(({ body: { articles: [article] } }) => {
              expect(article.title).to.equal('Moustache');
            });
        });
      });
      describe('HANDLE ERRORS', () => {
        it('POST PUT PATCH DELETE status:405 handle methods that do not exist for this end point', () => {
          const invalidMethods = ['post', 'put', 'patch', 'delete'];
          return Promise.all(
            invalidMethods.map((method) => {
              return request[method]('/api/articles')
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('Method Not Allowed');
                });
            }),
          );
        });
        it('GET status:200 responds with an empty array when passed an invalid author query', () => {
          return request
            .get('/api/articles?author=invalid')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(0);
            });
        });
        it('GET status:200 responds with an empty array when passed an invalid topic query', () => {
          return request
            .get('/api/articles?topic=invalid')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(0);
            });
        });
        it('GET status:200 handles invalid sort_by query by using default value', () => {
          return request
            .get('/api/articles?sort_by=invalid')
            .expect(200)
            .then(({ body: { articles: [article] } }) => {
              expect(article.title).to.eql('Living in the shadow of a great man');
            });
        });
        it('GET status:200 handles invalid order query by using default value', () => {
          return request
            .get('/api/articles?order=invalid')
            .expect(200)
            .then(({ body: { articles: [article] } }) => {
              expect(article.title).to.eql('Living in the shadow of a great man');
            });
        });
        it('GET status:200 handles invalid query parameters', () => {
          return request
            .get('/api/articles?invalid=invalid')
            .expect(200)
            .then(({ body: { articles: [article] } }) => {
              expect(article.title).to.eql('Living in the shadow of a great man');
            });
        });
      });
      describe('/:article_id', () => {
        describe('DEFAULT BEHAVIOUR', () => {
          it('GET status:200 responds with the article associated with article_id', () => {
            return request
              .get('/api/articles/1')
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article.article_id).to.equal(1);
              });
          });
          it('GET status:200 responds with the articles containing the relevant keys', () => {
            return request
              .get('/api/articles/1')
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article).to.contain.keys(
                  'author',
                  'title',
                  'article_id',
                  'body',
                  'topic',
                  'created_at',
                  'votes',
                  'comment_count',
                );
              });
          });
          it('PATCH status:200 responds with the updated article', () => {
            return request
              .patch('/api/articles/1')
              .send({ inc_votes: 1 })
              .expect(200)
              .then(({ body: { updatedArticle } }) => {
                expect(updatedArticle).to.contain.keys(
                  'author',
                  'title',
                  'article_id',
                  'body',
                  'topic',
                  'created_at',
                  'votes',
                );
              });
          });
          it('PATCH status:200 responds with an increase in the votes', () => {
            return request
              .patch('/api/articles/1')
              .send({ inc_votes: 1 })
              .expect(200)
              .then(({ body: { updatedArticle } }) => {
                expect(updatedArticle.votes).to.equal(101);
              });
          });
          it('PATCH status:200 responds with a decrease in the votes', () => {
            return request
              .patch('/api/articles/1')
              .send({ inc_votes: -1 })
              .expect(200)
              .then(({ body: { updatedArticle } }) => {
                expect(updatedArticle.votes).to.equal(99);
              });
          });
          it('DELETE status:204 responds with no content', () => {
            return request
              .del('/api/articles/1')
              .expect(204)
              .then(() => {
                return request.get('/api/articles/1').expect(404);
              })
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("article_id '1' Could Not Be Found");
              });
          });
        });
        describe('HANDLE ERRORS', () => {
          it('POST, PUT status:405 handle methods that do not exist for this end point', () => {
            const invalidMethods = ['post', 'put'];
            return Promise.all(
              invalidMethods.map((method) => {
                return request[method]('/api/articles/1')
                  .expect(405)
                  .then(({ body: { msg } }) => {
                    expect(msg).to.equal('Method Not Allowed');
                  });
              }),
            );
          });
          it('GET status:404 response for non-existant article_id', () => {
            return request
              .get('/api/articles/1000')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("article_id '1000' Could Not Be Found");
              });
          });
          it('GET status:400 response for invalid article_id', () => {
            return request
              .get('/api/articles/invalid')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Bad Request');
              });
          });
          it('PATCH status:404 response for non-existant article_id', () => {
            return request
              .patch('/api/articles/1000')
              .send({ inc_votes: -1 })
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("article_id '1000' Could Not Be Found");
              });
          });
          it('PATCH status:400 response for invalid article_id', () => {
            return request
              .patch('/api/articles/invalid')
              .send({ inc_votes: -1 })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Bad Request');
              });
          });
          it('PATCH status:400 response for invalid body value', () => {
            return request
              .patch('/api/articles/1')
              .send({ inc_votes: 'invalid' })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Bad Request');
              });
          });
          it('PATCH status:400 response for invalid body key', () => {
            return request
              .patch('/api/articles/1')
              .send({ invalid: 'invalid' })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Bad Request');
              });
          });
          it('DELETE status:404 response for non-existant article_id', () => {
            return request
              .del('/api/articles/1000')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("article_id '1000' Could Not Be Found");
              });
          });
          it('DELETE status:400 response for invalid article_id', () => {
            return request
              .del('/api/articles/invalid')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Bad Request');
              });
          });
        });
        describe('/comments', () => {
          describe('DEFAULT BEHAVIOUR', () => {
            it('GET status:200 responds with a list of the comment objects associated with the article', () => {
              return request
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body: { comments } }) => {
                  comments.forEach((comment) => {
                    expect(comment).to.include.keys(
                      'comment_id',
                      'votes',
                      'created_at',
                      'author',
                      'body',
                    );
                  });
                });
            });
            it('GET status:200 sorts by created_at in descending order', () => {
              return request
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body: { comments: [comment] } }) => {
                  expect(comment.comment_id).to.equal(2);
                });
            });
            it('POST status:201 request returns the created comment', () => {
              const comment = { username: 'butter_bridge', body: 'test comment' };
              const returnedComment = {
                author: 'butter_bridge',
                body: 'test comment',
                comment_id: 19,
                votes: 0,
                article_id: 1,
              };
              return request
                .post('/api/articles/1/comments')
                .send(comment)
                .expect(201)
                .then(({ body: { createdComment } }) => {
                  expect(createdComment).to.deep.include(returnedComment);
                });
            });
          });
          describe('QUERIES', () => {
            it('GET status:200 responds with articles sorted by query sort_by', () => {
              return request
                .get('/api/articles/1/comments?sort_by=votes')
                .expect(200)
                .then(({ body: { comments: [comment] } }) => {
                  expect(comment.comment_id).to.equal(3);
                });
            });
            it('GET status:200 responds with articles sorted by query sort_by', () => {
              return request
                .get('/api/articles/1/comments?order=asc')
                .expect(200)
                .then(({ body: { comments: [comment] } }) => {
                  expect(comment.comment_id).to.equal(18);
                });
            });
          });
          describe('HANDLES ERRORS', () => {
            it('PUT PATCH DELETE status:405 handle methods that do not exist for this end point', () => {
              const invalidMethods = ['patch', 'put', 'delete'];
              return Promise.all(
                invalidMethods.map((method) => {
                  return request[method]('/api/articles/1/comments')
                    .expect(405)
                    .then(({ body: { msg } }) => {
                      expect(msg).to.equal('Method Not Allowed');
                    });
                }),
              );
            });
            it('GET status:404 response for non-existant article_id', () => {
              return request
                .get('/api/articles/1000/comments')
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("article_id '1000' Could Not Be Found");
                });
            });
            it('GET status:400 response for invalid article_id', () => {
              return request
                .get('/api/articles/invalid/comments')
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('Bad Request');
                });
            });
            it('GET status:200 handles invalid sort_by query by using default value', () => {
              return request
                .get('/api/articles/1/comments?sort_by=invalid')
                .expect(200)
                .then(({ body: { comments: [comment] } }) => {
                  expect(comment.comment_id).to.equal(2);
                });
            });
            it('GET status:200 handles invalid order query by using default value', () => {
              return request
                .get('/api/articles/1/comments?order=invalid')
                .expect(200)
                .then(({ body: { comments: [comment] } }) => {
                  expect(comment.comment_id).to.equal(2);
                });
            });
            it('GET status:200 handles invalid query parameters', () => {
              return request
                .get('/api/articles/1/comments?invalid=invalid')
                .expect(200)
                .then(({ body: { comments: [comment] } }) => {
                  expect(comment.comment_id).to.equal(2);
                });
            });
            it('POST status:404 response for non-existant article_id', () => {
              const comment = { username: 'butter_bridge', body: 'test comment' };
              return request
                .post('/api/articles/1000/comments')
                .send(comment)
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('Route Not Found');
                });
            });
            it('POST status:400 response for invalid article_id', () => {
              const comment = { username: 'butter_bridge', body: 'test comment' };
              return request
                .post('/api/articles/invalid/comments')
                .send(comment)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('Bad Request');
                });
            });
            it('POST status:400 response for invalid username', () => {
              const comment = { username: 'invalid user', body: 'test comment' };
              return request
                .post('/api/articles/1/comments')
                .send(comment)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('Bad Request');
                });
            });
            it('POST status:400 response for missing body parameter', () => {
              const comment = { username: 'butter_bridge' };
              return request
                .post('/api/articles/1/comments')
                .send(comment)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('Bad Request');
                });
            });
            it('POST status:201 ignores additional body parameters', () => {
              const comment = {
                username: 'butter_bridge',
                body: 'test comment',
                invalid: 'invalid',
              };
              return request
                .post('/api/articles/1/comments')
                .send(comment)
                .expect(201);
            });
          });
        });
      });
    });
    describe('/comments', () => {
      describe('/:comment_id', () => {
        describe('DEFAULT BEHAVIOUR', () => {
          it('PATCH status:200 responds with the updated comment', () => {
            return request
              .patch('/api/comments/1')
              .send({ inc_votes: 1 })
              .expect(200)
              .then(({ body: { updatedComment } }) => {
                expect(updatedComment).to.include.keys(
                  'comment_id',
                  'author',
                  'article_id',
                  'votes',
                  'created_at',
                  'body',
                );
              });
          });
          it('PATCH status:200 increases the value of votes', () => {
            return request
              .patch('/api/comments/1')
              .send({ inc_votes: 1 })
              .expect(200)
              .then(({ body: { updatedComment } }) => {
                expect(updatedComment.votes).to.equal(17);
              });
          });
          it('PATCH status:200 decreases the value of votes', () => {
            return request
              .patch('/api/comments/1')
              .send({ inc_votes: -1 })
              .expect(200)
              .then(({ body: { updatedComment } }) => {
                expect(updatedComment.votes).to.equal(15);
              });
          });
          it('DELETE status:204 removes the comment and returns empty response', () => {
            return request
              .del('/api/comments/1')
              .expect(204)
              .then(() => {
                return request
                  .patch('/api/comments/1')
                  .send({ inc_votes: 1 })
                  .expect(404);
              });
          });
        });
        describe('HANDLE ERRORS', () => {
          it('GET, POST, PUT status:405 handle methods that do not exist for this end point', () => {
            const invalidMethods = ['get', 'post', 'put'];
            return Promise.all(
              invalidMethods.map((method) => {
                return request[method]('/api/comments/1')
                  .expect(405)
                  .send({ inc_votes: 1 })
                  .then(({ body: { msg } }) => {
                    expect(msg).to.equal('Method Not Allowed');
                  });
              }),
            );
          });
          it('POST status:404 for non-existant comment_id', () => {
            return request
              .patch('/api/comments/1000')
              .send({ inc_votes: 1 })
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("comment_id '1000' Not Found");
              });
          });
          it('POST status:400 for invalid comment_id', () => {
            return request
              .patch('/api/comments/invalid')
              .send({ inc_votes: 1 })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Bad Request');
              });
          });
          it('POST status:400 for invalid body value', () => {
            return request
              .patch('/api/comments/1')
              .send({ inc_votes: 'invalid' })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Bad Request');
              });
          });
          it('POST status:400 for invalid body parameter', () => {
            return request
              .patch('/api/comments/1')
              .send({ invalid: 'invalid' })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Bad Request');
              });
          });
          it('POST status:200 ignores additional parameters', () => {
            return request
              .patch('/api/comments/1')
              .send({ inc_votes: 1, invalid: 'invalid' })
              .expect(200)
              .then(({ body: { updatedComment } }) => {
                expect(updatedComment.votes).to.equal(17);
              });
          });
          it('DELETE status:404 for non-existant comment_id', () => {
            return request
              .del('/api/comments/1000')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("comment_id '1000' Not Found");
              });
          });
          it('DELETE status:400 for invalid comment_id', () => {
            return request
              .del('/api/comments/invalid')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Bad Request');
              });
          });
        });
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
    describe.only('/users', () => {
      describe('/:username', () => {
        describe('DEFAULT BEHAVIOUR', () => {
          it('GET status:200 responds with the user object', () => {
            return request
              .get('/api/users/butter_bridge')
              .expect(200)
              .then(({ body: { user } }) => {
                expect(user).to.include.keys('username', 'avatar_url', 'name');
              });
          });
        });
      });
    });
  });
});
