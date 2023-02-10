import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import firebaseConfig from '../config/firebaseConfig';
import './Login.css';

firebase.initializeApp(firebaseConfig);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailLogin = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleGoogleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="login-form">
      <form className="login-form" onSubmit={handleEmailLogin}>
        <input
          className="email-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="password-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="submit-button" type="submit">Login</button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <button className="google-button" onClick={handleGoogleLogin}>Login with Google</button>
      {/* <button className="google-button" onClick={handleGoogleLogin}>Login with Google</button> */}
    </div>
  );
}

export default Login;
