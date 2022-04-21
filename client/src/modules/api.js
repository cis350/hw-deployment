/* eslint-disable no-useless-catch */
const axios = require('axios');

const rootURL = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
  ? 'http://localhost:10000' : '';

// login
export async function addUser(name) {
  if (!name) {
    throw new Error('invalid username');
  }

  try {
    await axios.post(`${rootURL}/login`, { user: name });
    return;
  } catch (err) {
    throw err;
  }
}

export async function updateBest(name, bestScore) {
  if (!name) {
    throw new Error('invalid user');
  }

  try {
    await axios.put(`${rootURL}/user`, { user: name, best: bestScore });
    return;
  } catch (err) {
    throw err;
  }
}

export async function deleteUser(name) {
  if (!name) {
    throw new Error('invalid deletion');
  }

  try {
    await axios.delete(`${rootURL}/user/${name}`);
  } catch (err) {
    throw err;
  }
}

export async function getTopUsers() {
  try {
    const response = await axios.get(`${rootURL}/leaders`);
    return response.data.data;
  } catch (err) {
    throw err;
  }
}

export async function getBestScore(name) {
  if (!name) {
    throw new Error('invalid user');
  }

  try {
    const response = await axios.get(`${rootURL}/user-best-score/${name}`);
    return response.data.data;
  } catch (err) {
    throw err;
  }
}

export async function getBestUser() {
  try {
    const response = await axios.get(`${rootURL}/best-user`);
    return response.data.data;
  } catch (err) {
    throw err;
  }
}

export async function getQuestions() {
  try {
    const response = await axios.get(`${rootURL}/questions`);
    return response.data.data;
  } catch (err) {
    throw err;
  }
}
