// 1. Import MongoDB driver
const { MongoClient } = require('mongodb');

// 2. Connect to the DB and return the connection object
const connect = async (url) => {
  try {
    const conn = (await MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
    )).db();
    return conn;
  } catch (err) {
    throw new Error('could not connect to the db');
  }
};

// 3. add a player to the DB
const addUser = async (db, name) => {
  try {
    const search = await db.collection('Players').countDocuments({ user: name });
    let result;
    if (search === 0) {
      result = await db.collection('Players').insertOne({ user: name, best: 0 });
    } else {
      result = await db.collection('Players').findOne({ user: name });
    }
    return result;
  } catch (err) {
    throw new Error('could not add a player');
  }
};

// update user's best score
const updateBest = async (db, name, score) => {
  try {
    await db.collection('Players').updateOne(
      { user: name },
      { $set: { best: score } },
    );
    const result = await db.collection('Players').findOne({ user: name });
    return result;
  } catch (err) {
    throw new Error('could not update a score');
  }
};

const getBestScore = async (db, name) => {
  try {
    const result = await db.collection('Players').findOne({ user: name });
    return result.best;
  } catch (err) {
    throw new Error('could not search for a player');
  }
};

const deleteUser = async (db, name) => {
  try {
    await db.collection('Players').deleteOne({ user: name });
  } catch (err) {
    throw new Error('could not delete');
  }
};

// get top users
const getTopUsers = async (db) => {
  try {
    const results = await db.collection('Players').find().sort({ best: -1 }).limit(10)
      .toArray();
    return results;
  } catch (err) {
    throw new Error('could not retrieve top players');
  }
};

const getBestUser = async (db) => {
  try {
    const results = await getTopUsers(db);
    if (!results[0]) {
      return { user: '', best: '' };
    }
    return results[0];
  } catch (err) {
    throw new Error('could not retrieve best player');
  }
};

const getQuestions = async (db) => {
  try {
    const results = await db.collection('Questions').find().toArray();
    return results;
  } catch (err) {
    throw new Error('could not retrieve questions');
  }
};

module.exports = {
  connect,
  addUser,
  updateBest,
  getBestScore,
  deleteUser,
  getTopUsers,
  getBestUser,
  getQuestions,
};
