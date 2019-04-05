exports.apiContent = {
  notes: 'All valid responses are wrapped within a response object.',
  routes: [
    {
      '/api': {
        GET: {
          description: 'Responds with a description of the api.',
        },
      },
    },
    {
      '/api/articles': {
        GET: {
          description: 'Responds with an array of all article objects',
          queries: [
            {
              author: 'filters the articles by the username value specified in the query',
            },
            {
              topic: 'filters the articles by the topic value specified in the query',
            },
            {
              sort_by: 'sorts the articles by any valid column (defaults to date)',
            },
            {
              order:
                'can be set to asc or desc for ascending or descending (defaults to descending)',
            },
          ],
        },
      },
    },
    {
      '/api/articles/:article_id': {
        GET: {
          description: 'Responds with an article object',
        },
        PATCH: {
          description:
            'Updates the article votes property and responds with the updated article object',
          body: { inc_votes: 'Integer' },
        },
        DELETE: {
          description: 'Deletes the article from the database and responds with no content',
        },
      },
    },
    {
      '/api/articles/:article_id/comments': {
        GET: {
          description: 'Responds with an array of comment objects',
          queries: [
            {
              sort_by: 'sorts the articles by any valid column (defaults to created_at)',
            },
            {
              order:
                'can be set to asc or desc for ascending or descending (defaults to descending)',
            },
          ],
        },
        POST: {
          description: 'Posts the comment and responds with the posted comment object',
          body: {
            username: 'String (username must already exist)',
            body: 'String',
          },
        },
      },
    },
    {
      '/api/comments/:comments': {
        PATCH: {
          description: 'Increases the votes and responds with the updated comment object',
          body: { inc_votes: 'Integer' },
        },
        DELETE: {
          description: 'Deletes the comment from the database and responds with no content',
        },
      },
    },
    {
      '/api/topics': {
        GET: {
          description: 'Responds with an array of all topic objects',
        },
      },
    },
    {
      '/api/users/:username': {
        GET: {
          description: 'Responds with the user object',
        },
      },
    },
  ],
};
