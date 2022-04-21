// Create express app
const express = require('express');

const webapp = express();

// import path
const path = require('path');

// import environment variables
require('dotenv').config();

// import CORS
const cors = require('cors');

// import database functions
const lib = require('./dbOperations');
// declare the database object
let db;

// MongoDB URL
const url = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.ycleh.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

// configure the app to handle JSON and to parse request body
webapp.use(express.json());
webapp.use(
  express.urlencoded({
    extended: true,
  }),
);

// tell express to use cors
webapp.use(cors({ credentials: true, origin: true }));

// tell express where to find static files
webapp.use(express.static(path.join(__dirname, './client/build')));

// addUser endpoint - WORKS
webapp.post('/login', async (req, resp) => {
  if (!req.body.user || req.body.user.length === 0) {
    resp.status(404).json({ error: 'login username not provided' });
    return;
  }

  try {
    const result = await lib.addUser(db, req.body.user);
    resp.status(201).json({ message: `Player with id ${JSON.stringify(result.insertedId)} added; existing users will have an undefined inserted id` });
  } catch (err) {
    resp.status(400).json({ error: 'try again later' });
  }
});

// updateBest endpoint
webapp.put('/user', async (req, resp) => {
  if (!req.body.user || req.body.user.length === 0 || !req.body.best) {
    resp.status(404).json({ error: 'username or score not provided' });
    return;
  }

  try {
    const result = await lib.updateBest(db, req.body.user, req.body.best);
    resp.status(200).json({ message: `Player with name ${JSON.stringify(result.user)} updated score to ${JSON.stringify(result.best)}` });
  } catch (err) {
    resp.status(400).json({ error: 'try again later' });
  }
});

// deleteUser endpoint - WORKS
webapp.delete('/user/:name', async (req, resp) => {
  if (!req.params.name || req.params.name.length === 0) {
    resp.status(404).json({ error: 'username not provided' });
    return;
  }

  try {
    await lib.deleteUser(db, req.params.name);
    resp.status(200).json({ message: 'User deleted' });
  } catch (err) {
    resp.status(400).json({ error: 'try again later' });
  }
});

// getTopUsers endpoint - WORKS
webapp.get('/leaders', async (_req, resp) => {
  try {
    const results = await lib.getTopUsers(db);
    resp.status(200).json({ data: results });
  } catch (err) {
    resp.status(500).json({ error: 'try again later' });
  }
});

// getBestScore endpoint - WORKS
webapp.get('/user-best-score/:name', async (req, resp) => {
  if (!req.params.name || req.params.name.length === 0) {
    resp.status(404).json({ error: 'username not provided' });
    return;
  }

  try {
    const results = await lib.getBestScore(db, req.params.name);
    resp.status(200).json({ data: results });
  } catch (err) {
    resp.status(400).json({ error: 'try again later' });
  }
});

// getBestUser endpoint - WORKS
webapp.get('/best-user', async (_req, resp) => {
  try {
    const results = await lib.getBestUser(db);
    resp.status(200).json({ data: results });
  } catch (err) {
    resp.status(500).json({ error: 'try again later' });
  }
});

// getQuestions endpoint - WORKS
webapp.get('/questions', async (_req, resp) => {
  try {
    const results = await lib.getQuestions(db);
    resp.status(200).json({ data: results });
  } catch (err) {
    resp.status(500).json({ error: 'try again later' });
  }
});

// Wildcard endpoint - send react appp
webapp.get('*', (_req, resp) => {
  resp.sendFile(path.join(__dirname, './client/build/index.html'));
});

// Start server
const port = process.env.PORT || 10000;
webapp.listen(port, async () => {
  db = await lib.connect(url);
});

module.exports = webapp; // export for testing
