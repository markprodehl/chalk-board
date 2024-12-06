import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./Todo.css";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

function BoardsDashboard({ boards, onAddBoard, newBoardName, setNewBoardName, onSelectBoard }) {
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [updatedBoardName, setUpdatedBoardName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentMenuBoardId, setCurrentMenuBoardId] = useState(null);

  const handleDeleteBoard = (boardId) => {
    if (window.confirm("Are you sure you want to delete this board? This action cannot be undone.")) {
      const userId = firebase.auth().currentUser.uid;
      const boardRef = firebase.database().ref(`boards/${userId}/${boardId}`);
      boardRef.remove();
      handleCloseMenu();
    }
  };

  const handleEditBoard = (boardId, currentName) => {
    setEditingBoardId(boardId);
    setUpdatedBoardName(currentName);
    handleCloseMenu();
  };

  const handleUpdateBoardName = (boardId) => {
    if (!updatedBoardName.trim()) {
      alert("Board name cannot be empty!");
      return;
    }
    const userId = firebase.auth().currentUser.uid;
    const boardRef = firebase.database().ref(`boards/${userId}/${boardId}`);
    boardRef.update({ name: updatedBoardName });
    setEditingBoardId(null);
  };

  const handleMenuClick = (event, boardId) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenuBoardId(boardId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setCurrentMenuBoardId(null);
  };

  return (
    <div>
      {/* <h2 className="header">Your Boards</h2> */}
      <form onSubmit={onAddBoard} className="form">
        <input
            type="text"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="New Board Name"
            className="add-text new-board-name"
        />

        <button type="submit" className="add-button">
          Add Board
        </button>
      </form>
      <div className="boards-container">
        {boards.map((board) => (
          <div
            key={board.id}
            className="board-tile"
            style={{
              backgroundColor: "var(--input-bg-color)",
              color: "var(--text-color)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "10px",
              padding: "20px",
              textAlign: "center",
              position: "relative",
              cursor: "pointer",
            }}
          >
            {editingBoardId === board.id ? (
                <div>
                    <input
                    type="text"
                    value={updatedBoardName}
                    onChange={(e) => setUpdatedBoardName(e.target.value)}
                    className="add-text"
                    />
                    <div className="board-edit-button-container">
                    <button
                        className="board-cancel-button"
                        onClick={() => setEditingBoardId(null)}
                        aria-label="Cancel"
                    >
                        <CloseIcon />
                    </button>
                    <button
                        className="board-save-button"
                        onClick={() => handleUpdateBoardName(board.id)}
                        aria-label="Save"
                    >
                        <CheckIcon />
                    </button>
                    </div>
                </div>
            ) : (
            <div onClick={() => onSelectBoard(board.id)}>{board.name}</div>
            )}
            <IconButton
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
              }}
              onClick={(event) => handleMenuClick(event, board.id)}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl) && currentMenuBoardId === board.id}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={() => handleEditBoard(board.id, board.name)}>
                Edit
              </MenuItem>
              <MenuItem onClick={() => handleDeleteBoard(board.id)}>
                Delete
              </MenuItem>
            </Menu>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardsDashboard;
