# NC-News

A Node.js Back-end API for a news site, set up as part of the Northcoders course.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

All the project dependencies are contained in the package.json. Run `npm install` in the root project directory to install.

Dependencies include:
- express (Node.js web application framework)
- pg: (Node Postgres - non-blocking PostreSQL client for Node.js)
- knex: (SQL query builder for javascript)

Developer dependencies include:
- mocha (JS test framework for Node.js)
- chai (Assertion library for testing)
- huskey (for git hooks)
- nodemon (for auto-restarting the server)
- supertest (http assertion library)
- eslint (javascript linter)

The project uses as PostgreSQL database - download [here](https://www.postgresql.org/download/).

### Installing

To get up and running follow these steps:

Create your knexfile.js in the root project directory with the following base config:
```js
const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
};
```
From the project root folder, run the following commands in the CLI:
```
npm run setup-dbs
npm run seed
npm run dev
```
This will setup the database with the name nc_news, run the database migrations and seed the development data and set the server listening on port 9090.

Then head across to your browser and enter the url [http://localhost:9090/api](http://localhost:9090/api) for details of the api's end points.

## Running the tests

The tests are contained in the `/spec` folder. The tests for the application are in `/spec/app.spec.js` and the util-helper-functions are tested seperately in `/spec/util-helpers.spec`.
To run all the tests run:
```
npm test
```

### Test breakdown

The api tests are broken down into routes, with each containing sections for:
```js
/route
  /DEFAULT BEHAVIOUR
  /QUERIES
  /HANDLING ERRORS
```

### And coding style tests

The api use the MVC file structure.
Coding style is defined using eslint - check the .eslintrcjs file for changes to the default.

## Deployment

The api is currently deployed on heroku and can be reached on [https://nc-news-rphilp.herokuapp.com/api].

To deploy your own version with heroku:
- Login to heroku form the CLI - `heroku login`
- Create your app with command - `heroku create <app-name>`
- Do `git push heroku master`
- On the heroku website, in add-ons, add a `Heroku Postgres` database
- run `npm run migrate-latest-prod` to run the migrations
- run `npm run seed-prod` to seed the development data
- open your app using `heroku open` and check the logs with `heroku logs --tail`

## Authors

* **Rob Philp** - *Initial work* - [rnphilp](https://github.com/rnphilp)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details