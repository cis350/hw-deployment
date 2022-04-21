/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import { React } from 'react';
import '../assets/Results.css';

function Results({ Score, HandleRestart, TopPlayers }) {
  const top = TopPlayers;

  return (
    <div className="row">
      <div className="column">
        <div className="good-job-wrapper">
          <p>Good Job!</p>
        </div>
        <div className="score-wrapper">
          <p>
            <b>Score</b>
            <br />
            {Score}
          </p>
        </div>
        <button className="restart-button" type="button" onClick={HandleRestart}>
          Restart
        </button>
      </div>
      <div className="column">
        <div className="top-10-margin">
          <div className="results-top-10-box">
            <div className="top-10-text">
              Top 10
            </div>
          </div>
        </div>
        <div className="list-wrapper">
          <ol className="list">
            {top.map((player) => (
              <li key={player.user}>
                {player.user}
                :
                {' '}
                {player.best}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
export default Results;
