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
    if (!email || !password) {
      setError("Please enter a valid email and password.");
      return;
    }
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

  // Need to update this function and then uncomment the link in the return
  // const handleForgotPassword = () => {
  //   firebase
  //     .auth()
  //     .sendPasswordResetEmail(email)
  //     .then(() => {
  //       setError("Password reset email has been sent.");
  //     })
  //     .catch((error) => {
  //       setError(error.message);
  //     });
  // };

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
      <button className="google-button" onClick={handleGoogleLogin}>
        <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google logo" />
        Login with Google
      </button>
      {/* <p className="forgot-password" onClick={handleForgotPassword}>Forgot Password?</p>
      {error && <p className="error-message">{error}</p>} */}
    </div>
  );
}

export default Login;
