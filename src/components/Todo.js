import React, { useState, useEffect } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel,
  Drawer,
} from "@mui/material";
import MoreVert from "@mui/icons-material/MoreVert";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";
import "./Todo.css";
import Login from "./Login";
import { ClipLoader } from "react-spinners";
import firebaseConfig from "../config/firebaseConfig";
import Board from "./Board";
import BoardsDashboard from "./BoardsDashboard";

// Initialize Firebase
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
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [drawerWidth, setDrawerWidth] = useState(400);  // default width for large screens

  // Handle window resize for responsive drawer width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {  // Mobile portrait view (you can adjust this breakpoint)
        setDrawerWidth(window.innerWidth);  // Fill the screen width on mobile
      } else {
        setDrawerWidth(400);  // Default width for larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();  // Initial call to set the correct drawer width

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
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
      setUser(user || null);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user) {
      const boardListener = db.child(user.uid).on("value", (snapshot) => {
        const data = snapshot.val();
        const userBoards = Object.keys(data || {})
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setBoards(userBoards);
      });
      return () => db.child(user.uid).off("value", boardListener);
    }
  }, [user]);

  const handleAddBoard = (e) => {
    e.preventDefault();
    if (!newBoardName.trim() || !user) return;
    const boardRef = db.child(user.uid).push();
    boardRef.set({ name: newBoardName, todos: {}, order: Date.now() });
    setNewBoardName("");
  };

  const handleReorderBoards = (result) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    if (sourceIndex === destinationIndex) return;

    const updatedBoards = Array.from(boards);
    const [movedBoard] = updatedBoards.splice(sourceIndex, 1);
    updatedBoards.splice(destinationIndex, 0, movedBoard);
    setBoards(updatedBoards);

    updatedBoards.forEach((board, index) => {
      db.child(user.uid).child(board.id).update({ order: index });
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.replaceState(
        { selectedBoard: null, isPanelOpen: true },
        "",
        window.location.pathname
      );

      const handlePopState = (event) => {
        const state = event.state;
        if (state) {
          setSelectedBoard(state.selectedBoard || null);
          setIsPanelOpen(state.isPanelOpen ?? true);
        } else {
          setSelectedBoard(null);
          setIsPanelOpen(true);
        }
      };

      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
    return undefined;
  }, []);

  const handleSelectBoard = (boardId) => {
    setSelectedBoard(boardId);
    setIsPanelOpen(false);
    if (typeof window !== "undefined") {
      window.history.pushState(
        { selectedBoard: boardId, isPanelOpen: false },
        "",
        window.location.pathname
      );
    }
  };

  const handleGoBack = () => {
    setSelectedBoard(null);
    setIsPanelOpen(true);
    if (typeof window !== "undefined") {
      window.history.pushState(
        { selectedBoard: null, isPanelOpen: true },
        "",
        window.location.pathname
      );
    }
  };

  const openBoardPanel = () => {
    setIsPanelOpen(true);
    if (typeof window !== "undefined") {
      window.history.pushState(
        { selectedBoard, isPanelOpen: true },
        "",
        window.location.pathname
      );
    }
  };

  // Automatically close dashboard when clicking on main content
  const handleMainClick = () => {
    if (isPanelOpen && selectedBoard) {
      setIsPanelOpen(false);
      if (typeof window !== "undefined") {
        window.history.pushState(
          { selectedBoard, isPanelOpen: false },
          "",
          window.location.pathname
        );
      }
    }
  };

  return (
    <div>
      {loading ? (
        <div className="spinner">
          <ClipLoader loading={loading} size={50} color={"#007bff"} />
        </div>
      ) : user ? (
        <div className="app-container">
          {/* Header Section with Menu */}
          <div className="header-bar">
            {selectedBoard ? (
              <h1 className="header">{boards.find(board => board.id === selectedBoard)?.name}</h1>
            ) : (
              <h1 className="header" aria-hidden="true">&nbsp;</h1>
            )}
            <div className="menu-align">
              <IconButton onClick={handleClick}>
                <MoreVert />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem>
                  <FormControlLabel
                    control={<Switch checked={isDarkMode} onChange={toggleDarkMode} />}
                    label={isDarkMode ? "Light Mode" : "Dark Mode"}
                  />
                </MenuItem>
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
              </Menu>
            </div>
          </div>

          {/* Drawer Panel */}
          <Drawer variant="persistent" anchor="left" open={isPanelOpen}>
            <div
              style={{
                width: drawerWidth,
                height: "100vh",
                overflowY: "auto",
                padding: "16px",
                boxSizing: "border-box",
              }}
            >
              <BoardsDashboard
                boards={boards}
                onAddBoard={handleAddBoard}
                newBoardName={newBoardName}
                setNewBoardName={setNewBoardName}
                onSelectBoard={handleSelectBoard}
                onBoardDragEnd={handleReorderBoards}
              />
            </div>
          </Drawer>

          {/* Main Content */}
          <div
            className="main-content"
            onClick={handleMainClick}
            style={{
              marginLeft: isPanelOpen ? drawerWidth : 0,
              transition: "margin 0.3s ease-in-out",
              padding: "16px",
            }}
          >
            {selectedBoard && !isPanelOpen && (
              <IconButton
                onClick={openBoardPanel}
                disableRipple
                disableFocusRipple
                disableTouchRipple
                sx={{
                  marginBottom: 0,
                  marginLeft: "10px",
                  padding: 0,
                }}
                title="Open Boards Panel"
              >
                <MenuOpenIcon />
              </IconButton>
            )}

            {selectedBoard ? (
              <Board boardId={selectedBoard} user={user} goBack={handleGoBack} />
            ) : null}
          </div>
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
