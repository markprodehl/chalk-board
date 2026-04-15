import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "./Todo.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function Board({ boardId, user, goBack }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const boardRef = firebase.database().ref(`boards/${user.uid}/${boardId}/todos`);
    const todoListener = boardRef.on("value", (snapshot) => {
      const data = snapshot.val();
      const boardTodos = Object.keys(data || {})
        .map((key) => ({
          id: key,
          ...data[key],
        }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setTodos(boardTodos);
    });

    return () => boardRef.off("value", todoListener);
  }, [user, boardId]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const boardRef = firebase.database().ref(`boards/${user.uid}/${boardId}/todos`);
    const newTodoRef = boardRef.push();
    newTodoRef.set({ text: newTodo, done: false, order: todos.length });
    setNewTodo("");
  };

  const handleTodoDragEnd = (result) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    if (sourceIndex === destinationIndex) return;

    const updatedTodos = Array.from(todos);
    const [movedTodo] = updatedTodos.splice(sourceIndex, 1);
    updatedTodos.splice(destinationIndex, 0, movedTodo);
    setTodos(updatedTodos);

    updatedTodos.forEach((todo, index) => {
      firebase
        .database()
        .ref(`boards/${user.uid}/${boardId}/todos/${todo.id}`)
        .update({ order: index });
    });
  };

  return (
    <div>
      <form onSubmit={handleAddTodo} className="form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="New Item"
          className="add-text new-todo"
        />
        <button type="submit" className="add-button">+</button>
      </form>
      <DragDropContext onDragEnd={handleTodoDragEnd}>
        <Droppable droppableId="todos-droppable">
          {(provided) => (
            <ul ref={provided.innerRef} {...provided.droppableProps}>
              {todos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={String(todo.id)} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{ ...provided.draggableProps.style, userSelect: "none" }}
                      className={`list-item ${snapshot.isDragging ? "dragging" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={todo.done}
                        onChange={() =>
                          firebase
                            .database()
                            .ref(`boards/${user.uid}/${boardId}/todos/${todo.id}`)
                            .update({ done: !todo.done })
                        }
                        onPointerDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <input
                        type="text"
                        value={todo.text}
                        onChange={(e) =>
                          firebase
                            .database()
                            .ref(`boards/${user.uid}/${boardId}/todos/${todo.id}`)
                            .update({ text: e.target.value })
                        }
                        className="add-text todo-text-input"
                        onPointerDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                      />
                      <span
                        className="drag-handle"
                        {...provided.dragHandleProps}
                        aria-label="Drag todo"
                      >
                        ☰
                      </span>
                      <button
                        className="delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          firebase
                            .database()
                            .ref(`boards/${user.uid}/${boardId}/todos/${todo.id}`)
                            .remove();
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                      >
                        x
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Board;
