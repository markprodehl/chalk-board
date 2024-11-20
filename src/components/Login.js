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
        console.error('Error signing up:', error)
        let errorMessage = 'Error signing up.';
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'The email address is already in use by another account.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'The email address is not valid.';
        } else if (error.code === 'auth/operation-not-allowed') {
          errorMessage = 'Email/password accounts are not enabled. Enable email/password in Firebase Console.';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'The password is too weak.';
        } else if (error.code === 'auth/internal-error') {
          errorMessage = 'Please enter a valid email and password';
        } 
        setError(errorMessage);
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
        console.error('Error signing in:', error)
        let errorMessage = 'Error signing in.';
        if (error.code === 'auth/wrong-password') {
          errorMessage = 'Incorrect password. Please try again.';
        } else if (error.code === 'auth/user-not-found') {
          errorMessage = 'No account exists with this email. Please sign up.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'The email address is not valid.';
        } else if (error.code === 'auth/missing-password') {
          errorMessage = 'You need a password.';
        }
        setError(errorMessage);
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
  const handleForgotPassword = () => {
    if (!email) {
      setError("Please input your email first.");
      return;
    }
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setError("Password reset email has been sent.");
      })
      .catch((error) => {
        let errorMessage = "Error resetting password.";
        if (error.code === "auth/invalid-email") {
          errorMessage = "The email address is not valid.";
        } else if (error.code === "auth/user-not-found") {
          errorMessage = "There is no user record of this email.";
        }
        setError(errorMessage);
      });
  };
  
  return (
    <div className="auth-form">
      <form className="auth-fields" onSubmit={handleSignUpWithEmailAndPassword}>
      <h1 className="auth-header"> Duck Board</h1>
        {error ? <div><p className="error-message">{error}</p></div> : <div className="blank-error">I am transparent</div>}
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
            className="auth-input password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            />
        </div>
      </form>
      <div className="auth-buttons">
        <div>
          <button className="submit-button sign-up" onClick={handleSignUpWithEmailAndPassword}>Sign Up</button>
        </div>
        <div>
          <button className="submit-button login" onClick={handleEmailLogin}>Sign In</button>
        </div>
      </div>
        <button className="google-login" type="google-login">
          <img src={googleIcon} alt="google-login" className="google-login" onClick={handleGoogleLogin} />
        </button>
      <div className="forgot-password">
        <p className="forgot-password" onClick={handleForgotPassword}>Forgot Password?</p>
      </div>
    </div>
  );
  
  
}

export default Auth;
