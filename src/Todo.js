import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import './Todo.css'
// This imports the Firebase configuration data from a gitignore file
import firebaseConfig from './config/firebaseConfig'

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("todos");

function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

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

    const todoListener = db.on("value", (snapshot) => {
      const data = snapshot.val();
      const todos = Object.keys(data || {}).map((key) => ({
        id: key,
        ...data[key],
      }));
      setTodos(todos);
    });

    return () => {
      db.off("value", todoListener);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    db.push({ text: newTodo, done: false });
    setNewTodo("");
  };

  const handleToggle = (id) => {
    db.child(id).update({ done: !todos.find((t) => t.id === id).done });
  };

  const handleEdit = (id, text) => {
    db.child(id).update({ text });
  };

  const handleDelete = (id) => {
    db.child(id).remove();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button type="submit">Add Item</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
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
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;