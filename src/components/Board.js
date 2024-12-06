import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "./Todo.css"; // Import your CSS file

function Board({ boardId, user, goBack }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const boardRef = firebase.database().ref(`boards/${user.uid}/${boardId}/todos`);
    const todoListener = boardRef.on("value", (snapshot) => {
      const data = snapshot.val();
      const boardTodos = Object.keys(data || {}).map((key) => ({
        id: key,
        ...data[key],
      }));
      setTodos(boardTodos);
    });

    return () => {
      boardRef.off("value", todoListener);
    };
  }, [user, boardId]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const boardRef = firebase.database().ref(`boards/${user.uid}/${boardId}/todos`);
    boardRef.push({ text: newTodo, done: false });
    setNewTodo("");
  };

  return (
    <div>
      <button onClick={goBack} className="add-button">
        Back To Boards
      </button>
      {/* <h2 className="header">Todos for Board</h2> */}
      <form onSubmit={handleAddTodo} className="form">
        <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="New Todo"
            className="add-text new-todo"
            />

        <button type="submit" className="add-button">
          +
        </button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() =>
                firebase.database().ref(`boards/${user.uid}/${boardId}/todos/${todo.id}`).update({ done: !todo.done })
              }
            />
            <input
              type="text"
              value={todo.text}
              onChange={(e) =>
                firebase.database().ref(`boards/${user.uid}/${boardId}/todos/${todo.id}`).update({ text: e.target.value })
              }
              className="add-text"
            />
            <button
              className="delete-button"
              onClick={() =>
                firebase.database().ref(`boards/${user.uid}/${boardId}/todos/${todo.id}`).remove()
              }
            >
              x
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Board;
