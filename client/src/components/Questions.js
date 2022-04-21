/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import { React, useState } from 'react';
import '../assets/Questions.css';

// passing questions as props to child component
function Questions({
  questionslist, correct, incorrect,
}) {
  const [question, setQuestion] = useState(questionslist[Math.floor(Math.random() * 10)]);
  const [answer, setAnswer] = useState('');
  // const [counter, setCounter] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuestion(questionslist[Math.floor(Math.random() * 10)]);

    document.getElementById('ans1').checked = false;
    document.getElementById('ans2').checked = false;
    document.getElementById('ans3').checked = false;
    document.getElementById('ans4').checked = false;

    if (answer === question.correct) {
      correct();
    } else {
      incorrect();
    }
  };

  return (
    <div>
      <div className="row">
        <div className="column">
          <form onSubmit={handleSubmit}>
            <div className="questions">
              <img src={question.img} alt="celebrity" width="120" height="150" />
              <p>Who is this celebrity?</p>
              <div className="light-blue-rectangle">
                <div>
                  <input
                    type="radio"
                    id="ans1"
                    name="ans"
                    onChange={() => { setAnswer('option1'); }}
                  />
                  {question.option1}
                </div>
                <br />
                <div>
                  <input
                    type="radio"
                    id="ans2"
                    name="ans"
                    onChange={() => { setAnswer('option2'); }}
                  />
                  {question.option2}
                </div>
                <br />
                <div>
                  <input
                    type="radio"
                    id="ans3"
                    name="ans"
                    onChange={() => { setAnswer('option3'); }}
                  />
                  {question.option3}
                </div>
                <br />
                <div>
                  <input
                    type="radio"
                    id="ans4"
                    name="ans"
                    onChange={() => { setAnswer('option4'); }}
                  />
                  {question.option4}
                </div>
              </div>
              <input className="submit-button" type="submit" value="Submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Questions;
