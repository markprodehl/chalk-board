import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "./Todo.css";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

function BoardsDashboard({
  boards,
  onAddBoard,
  newBoardName,
  setNewBoardName,
  onSelectBoard,
}) {
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [updatedBoardName, setUpdatedBoardName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentMenuBoardId, setCurrentMenuBoardId] = useState(null);

  // Delete a board
  const handleDeleteBoard = (boardId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this board? This action cannot be undone."
      )
    ) {
      const userId = firebase.auth().currentUser.uid;
      const boardRef = firebase.database().ref(`boards/${userId}/${boardId}`);
      boardRef.remove();
      handleCloseMenu();
    }
  };

  // Begin editing a board name
  const handleEditBoard = (boardId, currentName) => {
    setEditingBoardId(boardId);
    setUpdatedBoardName(currentName);
    handleCloseMenu();
  };

  // Update the board name
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

  // Handle right-click menu toggle
  const handleMenuClick = (event, boardId) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenuBoardId(boardId);
  };

  // Close right-click menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setCurrentMenuBoardId(null);
  };

  return (
    <div>
      {/* Header for Fart Board */}
      <h1 className="header-fart-board">Fart Board</h1>
      {/* List of boards */}
      <div className="boards-container">
        {boards.map((board) => (
          <div key={board.id} className="board-tile">
            {editingBoardId === board.id ? (
              <div>
                <input
                  type="text"
                  value={updatedBoardName}
                  onChange={(e) => setUpdatedBoardName(e.target.value)}
                  className="add-text board-input-width"
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
                top: "65%",
                right: "10px",
                transform: "translateY(-50%)",
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

      {/* New board input aligned with board tile width */}
      <form onSubmit={onAddBoard} className="form">
        <div className="input-button-container">
          <input
            type="text"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="New Board Name"
            className="add-text add-board new-board-name board-input-width"
          />
          <button type="submit" className="add-button">
            +
          </button>
        </div>
      </form>
    </div>
  );
}

export default BoardsDashboard;
