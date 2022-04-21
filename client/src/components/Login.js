/* eslint-disable react/jsx-filename-extension */
import { React, useState } from 'react';
import '../assets/Login.css';

// eslint-disable-next-line react/prop-types
function Login({ LoginUser, error }) {
  const [info, setInfo] = useState({ name: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    LoginUser(info);
  };
  return (
    <form className="outer-form" onSubmit={handleLogin}>
      <div className="inner-form">
        <div className="content-wrapper">
          <h2>Login</h2>
          {(error !== '') ? (<div className="error">{error}</div>) : ''}
          <div className="user-form">
            <div>Username</div>
            <br />
            <input type="text" name="name" id="name" onChange={(e) => setInfo({ name: e.target.value })} value={info.name} />
          </div>
          <div className="go-button-wrapper">
            <input type="submit" value="GO!" />
          </div>
        </div>
      </div>
    </form>
  );
}

export default Login;
