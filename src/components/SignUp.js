import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import firebaseConfig from '../config/firebaseConfig';
import './Login.css';

firebase.initializeApp(firebaseConfig);

function SignUp() {
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

  const handleSignUpWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      const emailRef = firebase.database().ref('users/' + user.uid + '/email');
      emailRef.set(user.email);
      // Uncmment if you need to save the email on the todo object 
      // const todosRef = firebase.database().ref('todos');
      todosRef.once('value', (snapshot) => {
        const todos = snapshot.val();
        todos[user.uid] = { email: user.email };
        todosRef.update(todos);
      });
    } catch (error) {
      setError(error.message);
    }
  };


  return (
    <div className="sign-up-form">
      <form className="sign-up-form" onSubmit={handleSignUpWithEmailAndPassword}>
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
        <button className="submit-button" type="submit">Sign Up</button>
      </form>
      <button class="google-button" onClick={handleSignUpWithGoogle}>
        <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google logo" />
        Sign Up with Google
      </button>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default SignUp;
