import React, { useState, useEffect } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVert from '@mui/icons-material/MoreVert';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/auth';
import './Todo.css'
import Login from './Login';
import { ClipLoader } from 'react-spinners';
// This imports the Firebase configuration data from a gitignore file
import firebaseConfig from '../config/firebaseConfig'

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("todos");

function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loading, setLoading] = useState(true);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    // if ("serviceWorker" in navigator) {
    //   navigator.serviceWorker
    //     .register("/service-worker.js")
    //     .then(registration => {
    //       console.log("Service worker registered: ", registration);
    //     })
    //     .catch(error => {
    //       console.error("Service worker registration failed: ", error);
    //     });
    // }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
          console.log("Service worker unregistered: ", registration);
        });
      }).catch(error => {
        console.error("Service worker unregistration failed: ", error);
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
    db.child(user.uid).child(id).remove();
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

  return (
    <div>
      {loading ? (
        <div className="spinner">
          <ClipLoader 
           loading={loading} 
           size={50}
           type="Puff"
           color={"#007bff"} 
          />
        </div>
      ) : user ? (
        <div>
          <div className="signOut">
            <IconButton onClick={handleClick}>
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem className="signout-button" component="a" onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </div>
          <h1 className="header">Chalk Board</h1>
          <ul>
            <form onSubmit={handleSubmit}>
              <input
                className="add-text"
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add item . . ."
              />
              <button className="add-button" type="submit">+</button>
            </form>
            {todos.map((todo, index) => (
              <li
                key={todo.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => handleToggle(todo.id)}
                />
                <input
                  type="text"
                  value={todo.text}
                  onChange={(e) => handleEdit(todo.id, e.target.value)}
                />
                <button className="delete-button" onClick={() => handleDelete(todo.id)}>x</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="signup-buttons">
          <Login />
        </div>
      )}
    </div>
  );
}

export default Todo;

