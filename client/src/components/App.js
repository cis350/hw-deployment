/* eslint-disable react/jsx-filename-extension */
import {
  React, useState, useRef, useEffect,
} from 'react'; // useRef for login state to persist
import Questions from './Questions';
import Results from './Results';
import '../assets/App.css';
import {
  addUser, updateBest, deleteUser, getTopUsers, getBestScore, getBestUser, getQuestions,
} from '../modules/api';
import Login from './Login';
import Feedback from './Feedback';

function App() {
  const name = useRef('');
  const bestScore = useRef(0);
  const [error, setError] = useState('');
  const [nextPage, setNext] = useState('question');
  const [score, setScore] = useState();
  // const a = await getInitialBestUser();

  const bestUser = useRef();
  const bestOverall = useRef();

  const questionsList = useRef([]);
  const start = useRef(false);
  // const [start, setStart] = useState(false);
  const counter = useRef(0);

  const topPlayers = useRef();

  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      questionsList.current = await getQuestions();
    }
    async function getInitialBestUser() {
      const x = await getBestUser();
      bestUser.current = x.user;
      bestOverall.current = x.best;
      return x;
    }
    getInitialBestUser();
    fetchQuestions();
  });

  const LoginUser = async (info) => {
    const RegEx = /^[a-zA-Z0-9]+$/;
    if (RegEx.test(info.name)) {
      name.current = info.name;
      await addUser(name.current);
      bestScore.current = await getBestScore(name.current);
      start.current = true;
      setScore(0);
    } else {
      setError('Use only letters and numbers');
    }
  };

  const CorrectChanges = async () => {
    setCorrect(true);
    setScore(score + 1);
    setNext('feedback');
  };

  const IncorrectChanges = async () => {
    setCorrect(false);
    setNext('feedback');
  };

  const RestartGame = async () => {
    start.current = false;
    setScore();
    setError('');
    setNext('question');
    name.current = '';
    bestScore.current = 0;
    counter.current = 0;
  };

  const updateBestScore = async (currScore) => {
    if (currScore > bestScore.current) {
      bestScore.current = currScore;
      await updateBest(name.current, currScore);
    }
  };

  const QuestionCounter = async () => {
    counter.current += 1;
    if (counter.current >= 10) {
      await updateBestScore(score);
      topPlayers.current = await getTopUsers();
      const y = await getBestUser();
      bestUser.current = y.user;
      bestOverall.current = y.best;
      setNext('results');
    } else {
      setNext('question');
    }
  };

  const handleDelete = async () => {
    await deleteUser(name.current);
    RestartGame();
  };

  if (!start.current) {
    return (
      <div className="App">
        <div className="title">
          <div className="blue-rectangle">
            <h1>Guess the Celebrity</h1>
          </div>
        </div>
        <div className="login-box">
          <div className="cyan-rectangle">
            <div className="white-rectangle">
              <Login LoginUser={LoginUser} error={error} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // haven't reached 10 questions yet
  if (nextPage === 'question') {
    return (
      <div>
        <div className="row">
          <div className="column">
            <div className="center">
              <br />
              <b>User: </b>
              { name.current }
              <br />
              <b>Current Score: </b>
              { score }
              <br />
              <b>Best Score: </b>
              { bestScore.current }
              <br />
              <b>Game Leader: </b>
              { bestUser.current }
              (
              { bestOverall.current }
              )
              <div className="delete-button-wrapper">
                <button className="delete-button" type="button" onClick={handleDelete}>Delete Account</button>
              </div>
            </div>
          </div>
          <div>
            <Questions
              questionslist={questionsList.current}
              score={score}
              correct={CorrectChanges}
              incorrect={IncorrectChanges}
            />
          </div>
        </div>
      </div>
    );
  }

  // feedack page
  if (nextPage === 'feedback') {
    return (
      <div>
        <div className="row">
          <div className="column">
            <div className="center">
              <br />
              <b>User: </b>
              { name.current }
              <br />
              <b>Current Score: </b>
              { score }
              <br />
              <b>Best Score: </b>
              { bestScore.current }
              <br />
              <b>Game Leader: </b>
              { bestUser.current }
              (
              { bestOverall.current }
              )
              <div className="delete-button-wrapper">
                <button className="delete-button" type="button" onClick={handleDelete}>Delete Account</button>
              </div>
            </div>
          </div>
          <div>
            <Feedback correct={correct} Counter={QuestionCounter} />
          </div>
        </div>
      </div>
    );
  }

  // finished 10 questions
  if (nextPage === 'results') {
    return (
      <div>
        <div className="row">
          <div className="column">
            <div className="center">
              <br />
              <b>User: </b>
              { name.current }
              <br />
              <b>Current Score: </b>
              { score }
              <br />
              <b>Best Score: </b>
              { bestScore.current }
              <br />
              <b>Game Leader: </b>
              { bestUser.current }
              (
              { bestOverall.current }
              )
              <div className="delete-button-wrapper">
                <button className="delete-button" type="button" onClick={handleDelete}>Delete Account</button>
              </div>
            </div>
          </div>
          <div>
            <Results Score={score} HandleRestart={RestartGame} TopPlayers={topPlayers.current} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
