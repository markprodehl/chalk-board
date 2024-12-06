import React, { useState, useEffect } from "react";
import { IconButton, Menu, MenuItem, Switch, FormControlLabel } from "@mui/material";
import MoreVert from "@mui/icons-material/MoreVert";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";
import "./Todo.css";
import Login from "./Login";
import { ClipLoader } from "react-spinners";
import firebaseConfig from "../config/firebaseConfig";
import Board from "./Board"; // New component for individual boards
import BoardsDashboard from "./BoardsDashboard"; // New component for boards dashboard

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("boards");

function Todo() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [newBoardName, setNewBoardName] = useState("");
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("light-mode", !isDarkMode);
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
    if (user) {
      const boardListener = db.child(user.uid).on("value", (snapshot) => {
        const data = snapshot.val();
        const userBoards = Object.keys(data || {}).map((key) => ({
          id: key,
          ...data[key],
        }));
        setBoards(userBoards);
      });
      return () => {
        db.child(user.uid).off("value", boardListener);
      };
    }
  }, [user]);

  const handleAddBoard = (e) => {
    e.preventDefault();
    if (!newBoardName.trim() || !user) return;
    db.child(user.uid).push({ name: newBoardName, todos: {} });
    setNewBoardName("");
  };

  const handleSelectBoard = (boardId) => {
    setSelectedBoard(boardId);
  };

  return (
    <div>
      {loading ? (
        <div className="spinner">
          <ClipLoader loading={loading} size={50} color={"#007bff"} />
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
              <MenuItem>
                <FormControlLabel
                  control={<Switch checked={isDarkMode} onChange={toggleDarkMode} />}
                  label={isDarkMode ? "Light Mode" : "Dark Mode"}
                />
              </MenuItem>
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </div>
          <h1 className="header">Duck Board</h1>
          {selectedBoard ? (
            <Board
              boardId={selectedBoard}
              user={user}
              goBack={() => setSelectedBoard(null)}
            />
          ) : (
            <BoardsDashboard
              boards={boards}
              onAddBoard={handleAddBoard}
              newBoardName={newBoardName}
              setNewBoardName={setNewBoardName}
              onSelectBoard={handleSelectBoard}
            />
          )}
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
