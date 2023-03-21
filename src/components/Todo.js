import React, { useState, useEffect } from 'react';
import { IconButton, Menu, MenuItem, Modal, TextField, Button } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/auth';
import './Todo.css';
import SignUp from './SignUp';
import Login from './Login';
// This imports the Firebase configuration data from a gitignore file
import firebaseConfig from '../config/firebaseConfig';

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("todos");

function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [user, setUser] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showButtons, setShowButtons] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [showFollowedUsersModal, setShowFollowedUsersModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowButtons(true);
    }, 700);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignUp = () => {
    setShowSignUp(true);
    setShowLogin(false);
  };

  const handleLogin = () => {
    setShowLogin(true);
    setShowSignUp(false);
  };

  const handleSignOut = () => {
    firebase.auth().signOut();
    setUser(null);
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(registration => {
          console.log("Service worker registered: ", registration);
        })
        .catch(error => {
          console.error("Service worker registration failed: ", error);
        });
    }

    if (user) {
      const todoListener = db.child(user.uid).on("value", (snapshot) => {
        const data = snapshot.val();
        const todos = Object.keys(data || {}).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTodos(todos);
      });
      return () => {
        db.child(user.uid).off("value", todoListener);
      };
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTodo.trim() || !user) return;
    db.child(user.uid).push({ text: newTodo, done: false });
    setNewTodo("");
  };

  const handleToggle = (id) => {
    db.child(user.uid).child(id).update({ done: !todos.find((t) => t.id === id).done });
  };

  const handleEdit = (id, text) => {
    db.child(user.uid).child(id).update({ text });
  };

  const handleDelete = (id) => {
    db.child
      (user.uid).child(id).remove();
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    const draggedIndex = e.dataTransfer.getData("index");
    if (draggedIndex === index) return;
    const tempTodos = [...todos];
    const [temp] = tempTodos.splice(draggedIndex, 1);
    tempTodos.splice(index, 0, temp);
    setTodos(tempTodos);
  };

  const handleSearchEmail = (e) => {
    e.preventDefault();
    firebase.database().ref("users")
      .orderByChild("email")
      .equalTo(searchEmail)
      .once("value", (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const userId = Object.keys(data)[0];
          const email = data[userId].email;
          setSearchResult({ id: userId, email: email });
        } else {
          setSearchResult(null);
          alert("No user found");
        }
      });
  };

  const handleFollowUser = () => {
    if (searchResult) {
      db.child(user.uid).child("followedUsers").child(searchResult.id).set(searchResult.email);
      setFollowedUsers([...followedUsers, searchResult.email]);
      setSearchResult(null);
    }
  };

  const handleShowFollowedUsersModal = () => {
    db.child(user.uid).child("followedUsers").once("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const followedUsers = Object.values(data);
        setFollowedUsers(followedUsers);
      } else {
        setFollowedUsers([]);
      }
      setShowFollowedUsersModal(true);
    });
  };

  return (
    <div>
      {user ? (
        <div>
          <div className="signOut">
            <IconButton onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem component="a" onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </div>
          <h1 className="header">Chalk Board</h1>
          <form onSubmit={handleSubmit}>
            <input
              className="addTodo"
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add item . . ."
            />
            <button type="submit">Add Item</button>
          </form>
          <ul>
            {todos.map((todo, index) => (
              <li
                key={todo.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <input
                  type="checkbox" checked={todo.done}
                  onChange={() => handleToggle(todo.id)}
                />
                <input
                  type="text"
                  value={todo.text}
                  onChange={(e) => handleEdit(todo.id, e.target.value)}
                />
                <button onClick={() => handleDelete(todo.id)}>x</button>
              </li>
            ))}
          </ul>
          <div className="searchUser">
            <form onSubmit={handleSearchEmail}>
              <TextField
                label="Search User by Email"
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
              <Button type="submit">Search</Button>
            </form>
            {searchResult && (
              <div>
                <p>{searchResult.email}</p>
                <button onClick={handleFollowUser}>Follow</button>
              </div>
            )}
          </div>
          <button onClick={handleShowFollowedUsersModal}>Followed Users</button>
          <Modal
            open={showFollowedUsersModal}
            onClose={() => setShowFollowedUsersModal(false)}
          >
            <div className="followedUsersModal">
              <h2>Followed Users</h2>
              {followedUsers.map((email) => (
                <p key={email}>{email}</p>
              ))}
            </div>
          </Modal>
        </div>
      ) : (
        <div className="signUp-button">
          {showSignUp ? (
            <SignUp setUser={setUser} setShowSignUp={setShowSignUp} />
          ) : showLogin ? (
            <Login setUser={setUser} setShowLogin={setShowLogin} />
          ) : (
            <div>
              {showButtons && (
                <>
                  <button className="submit-button" onClick={handleSignUp}>Sign Up</button>
                  <button className="submit-button" onClick={handleLogin}>Login</button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Todo;