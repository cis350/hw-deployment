// import dbOperations
const dbModule = require('./dbOperations');

// import environment variables
require('dotenv').config();

// declare db object
let db;

// MongoDB url
const url = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.ycleh.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

// declare test data
const user1 = 'testuser';

// db connection test
test('database connects', async () => {
  // connect to the db
  db = await dbModule.connect(url);
  // test db is not null
  expect(db).not.toEqual(null);
});

// db connection fail test
test('database connection fail', async () => {
  // wrong url
  const badUrl = 'mongodb+srv://cis350:cis350@cluster0.BLAH.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
  let message;
  try {
    // connection fail
    db = await dbModule.connect(badUrl);
  } catch (err) {
    message = err.message;
  }
  expect(message).toBe('could not connect to the db');
});

// addUser test
test('addUser inserts a new player', async () => {
  // connect to the db
  db = await dbModule.connect(url);
  db.collection('Players').deleteMany({});
  // call addUser
  await dbModule.addUser(db, user1);
  // find test user in the database
  const foundPlayer = await db.collection('Players').findOne({ user: user1 });
  // test that foundPlayer is testuser
  expect(foundPlayer.user).toEqual('testuser');
  expect(foundPlayer.best).toEqual(0);
});

// addUser test
test('addUser insert same player twice', async () => {
  // connect to the db
  db = await dbModule.connect(url);
  // clear Players collection
  // db.collection('Players').deleteMany({});
  // call addUser
  await dbModule.addUser(db, user1);
  await dbModule.addUser(db, user1);
  // test that only one was added
  expect(await db.collection('Players').countDocuments({ user: user1 })).toBe(1);
});

// updateBest test
test('update score from 0 to 3', async () => {
  // connect to the db
  db = await dbModule.connect(url);
  // clear Players collection
  // db.collection('Players').deleteMany({});
  // call addUser
  await dbModule.addUser(db, user1);
  // find player
  let foundPlayer = await db.collection('Players').findOne({ user: user1 });
  // test that foundPlayer has score 0 for now
  expect(foundPlayer.best).toBe(0);
  // call updateBest
  await dbModule.updateBest(db, user1, 3);
  // find test user in the database
  foundPlayer = await db.collection('Players').findOne({ user: user1 });
  // test that foundPlayer is testuser
  expect(foundPlayer.best).toBe(3);
});

// getBestScore test
test('get best score of testuser', async () => {
  // connect to the db
  db = await dbModule.connect(url);
  // call addUser
  await dbModule.addUser(db, user1);
  // call getBestScore
  const score = await dbModule.getBestScore(db, user1);
  // test whether score is 0
  expect(score).toBe(3);
});

// getBestScore test
test('get best score of invalid user', async () => {
  try {
    // connect to the db
    db = await dbModule.connect(url);
    // call addUser
    await dbModule.addUser(db, user1);
    // call getBestScore
    await dbModule.getBestScore(db, 'hello');
  } catch (err) {
    expect(err.message).toBe('could not search for a player');
  }
});

// deleteUser test
test('delete user that exists', async () => {
  // connect to the db
  db = await dbModule.connect(url);
  // clear Players collection
  // db.collection('Players').deleteMany({});
  // call addUser
  await dbModule.addUser(db, user1);
  // call deleteUser
  await dbModule.deleteUser(db, user1);
  // test deletion
  expect(await db.collection('Players').countDocuments({ user: user1 })).toBe(0);
});

// deleteUser test DOESNT WORK
test('delete user that does not exist', async () => {
  try {
    // connect to the db
    db = await dbModule.connect(url);
    // clear Players collection
    // db.collection('Players').deleteMany({});
    // call addUser
    await dbModule.addUser(db, user1);
    // call deleteUser
    await dbModule.deleteUser(db, 'asdfadsfasdf');
  } catch (err) {
    expect(err.message).toBe('could not delete');
  }
});

// getTopUsers test
test('get top users', async () => {
  // connect to the db
  db = await dbModule.connect(url);
  // clear Players collection
  db.collection('Players').deleteMany({});
  // call addUser
  await dbModule.addUser(db, user1);
  await dbModule.addUser(db, 'testuser2');
  await dbModule.addUser(db, 'testUser3');
  await dbModule.updateBest(db, 'testUser3', 3);
  await dbModule.updateBest(db, user1, 1);
  // call getTopUsers
  const results = await dbModule.getTopUsers(db);
  // test results
  expect(results[0]).toMatchObject({ user: 'testUser3', best: 3 });
  expect(results.length).toBe(3);
});

// getBestUser test
test('get best user', async () => {
  // connect to the db
  db = await dbModule.connect(url);
  // clear Players collection
  // db.collection('Players').deleteMany({});
  // call addUser
  await dbModule.addUser(db, user1);
  await dbModule.addUser(db, 'testuser3');
  // update user
  await dbModule.updateBest(db, 'testuser3', 10);
  // call getTopUsers
  const result = await dbModule.getBestUser(db);
  // test results
  expect(result).toMatchObject({ user: 'testuser3', best: 10 });
});

// getQuestions test
test('get questions', async () => {
  // connect to the db
  db = await dbModule.connect(url);
  // get question
  const questions = await dbModule.getQuestions(db);
  // test results
  expect(questions.length).toBe(10);
});
