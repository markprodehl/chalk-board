import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import firebaseConfig from '../config/firebaseConfig';
import './Login.css';
import googleIcon from '../assets/google_signin_light.png'

firebase.initializeApp(firebaseConfig);

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUpWithEmailAndPassword = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const emailRef = firebase.database().ref('users/' + user.uid + '/email');
        emailRef.set(user.email);
        const todosRef = firebase.database().ref('todos');
        todosRef.once('value', (snapshot) => {
          const todos = snapshot.val();
          todos[user.uid] = { email: user.email };
          todosRef.update(todos);
        });
      })
      .catch((error) => {
        setError(error.message);
      });
  };

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

  // Uncomment this section if you want to include the "Forgot Password?" functionality
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
    <div className="auth-form">
      <form className="auth-fields" onSubmit={handleSignUpWithEmailAndPassword}>
        <div>
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>
        <div>
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
      </form>
      <div className="auth-buttons">
        <div>
          <button className="submit-button sign-up">Sign Up</button>
        </div>
        <div>
          <button className="submit-button login" onClick={handleEmailLogin}>Sign In</button>
        </div>
      </div>
        <button className="google-login" type="google-login">
          <img src={googleIcon} alt="google-login" className="google-login" onClick={handleGoogleLogin} />
        </button>
      {/* Uncomment this section if you want to include the "Forgot Password?" functionality */}
      {/* <div>
        <p className="forgot-password" onClick={handleForgotPassword}>Forgot Password?</p>
      </div> */}
      {error && <div><p className="error-message">{error}</p></div>}
    </div>
  );
  
  
}

export default Auth;
