/* eslint-disable max-len */
// import supertest
const request = require('supertest');

// import our web app
const webapp = require('./server');

// import database operations
const dbLib = require('./dbOperations');

// import environment variables
require('dotenv').config();

let db;

// Mongodb URL
const url = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.ycleh.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

beforeAll(async () => {
  webapp.listen();
  db = await dbLib.connect(url);
  await dbLib.addUser(db, 'hi');
  await dbLib.updateBest(db, 'hi', 2);
  await dbLib.addUser(db, 'Ted');
  await dbLib.updateBest(db, 'Ted', 4);
  await dbLib.addUser(db, 'Sam');
  await dbLib.updateBest(db, 'Sam', 3);
});

describe('/login endpoint tests', () => {
  test('/login endpoint status code and response 404', () => request(webapp).post('/login').send('hey')
    .expect(404) // test the response status code
    .then((response) => { // process the response
      expect(JSON.parse(response.text).error).toBe('login username not provided');
    }));

  test('/login endpoint status code and response 201', () => request(webapp).post('/login').send({ user: 'Phillip' })
    .expect(201) // test the response status code
    .then((response) => { // process the response
      expect(JSON.parse(response.text).message).toContain('Player with id');
    }));
});

describe('/user update score endpoint tests', () => {
  test('/user endpoint status code and response 404', () => request(webapp).put('/user').send('hey')
    .expect(404) // test the response status code
    .then((response) => { // process the response
      expect(JSON.parse(response.text).error).toBe('username or score not provided');
    }));

  test('/user endpoint status code and response 200', () => request(webapp).put('/user').send({ user: 'Phillip', best: 5 })
    .expect(200) // test the response status code
    .then((response) => { // process the response
      expect(JSON.parse(response.text).message).toContain('updated score to');
    }));
});

describe('/user-best-score/:name endpoint tests', () => {
  // test('/user-best-score/:name endpoint status code and response 200', () => request(webapp).get('/user-best-score/hi').send()
  //   .expect(200)); // test the response status code

  test('/user-best-score/:name endpoint status code and response 400', () => request(webapp).get('/user-best-score/:name').send()
    .expect(400) // test the response status code
    .then((response) => { // process the response
      expect(JSON.parse(response.text).error).toBe('try again later');
    }));
});

describe('/user/:name delete endpoint tests', () => {
  test('/user/:name endpoint status code and response 200', () => request(webapp).delete('/user/Sam').send()
    .expect(200) // test the response status code
    .then((response) => { // process the response
      expect(JSON.parse(response.text).message).toBe('User deleted');
    }));
});

describe('/leaders endpoint tests', () => {
  test('/leaders endpoint status code and response 200', () => request(webapp).get('/leaders').send()
    .expect(200)); // test the response status code
});

describe('/best-user endpoint tests', () => {
  test('/best-user endpoint status code and response 200', () => request(webapp).get('/best-user').send()
    .expect(200)); // test the response status code
});

describe('/questions endpoint tests', () => {
  test('/questions endpoint status code and response 200', () => request(webapp).get('/questions').send()
    .expect(200)); // test the response status code
});
