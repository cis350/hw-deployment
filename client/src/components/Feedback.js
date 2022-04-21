/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import { React } from 'react';
import '../assets/Feedback.css';

function Feedback({ correct, Counter }) {
  let color = 'light-blue-rectangle-feedback';
  if (!correct) {
    color = 'light-red-rectangle-feedback';
  }

  return (
    <div className="row">
      <div className="column">
        <div className="feedback-wrapper">
          <div className={color}>
            <div className="feedback-text">
              {correct ? 'Correct!' : 'Incorrect!'}
            </div>
          </div>
        </div>
        <div>
          <button className="next-button" type="button" onClick={Counter}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
