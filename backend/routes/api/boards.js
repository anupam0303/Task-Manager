const express = require("express");

const logger = require("../../utilities/logger");
const messages = require("../../config/messages");
const auth = require("../../tokenHandler/auth");
const authBoard = require("../../tokenHandler/authBoard");
// Board Model
const board = require("../../models/board");
// Task List Model
const taskList = require("../../models/taskList");
// Task  Model
const task = require("../../models/task");
const user = require("../../models/user");

const router = express.Router();

/*********************************************/
// @route POST api/boards
// @desc Create a new board
// @access Authorized Users
/*********************************************/
router.post("/", auth, (request, response) => {
  //router.post('/', auth, (request, response) => {
  const { boardName } = request.body;
  // Validation for mandatory parameters
  if (!boardName) {
    // Bad request
    return response
      .status(400)
      .json({ success: false, msg: messages.BOARD_CREATE_BAD_REQUEST });
  } else {
    logger.log("/boards POST API", "email is : " + request.user.name);
    const newBoard = new Board({
      boardName: request.body.boardName,
      createdBy: request.user.name,
      lastUpdatedBy: request.user.name,
    });
    newBoard
      .save()
      .then((board) => response.json(board))
      .catch((error) =>
        resonse.status(500).json({ success: false, msg: error })
      );
  }
});

/*********************************************/
// @route GET api/boards
// @desc Gets all active boards for user
// @access Authorized Users
/*********************************************/
router.get("/", auth, (request, response) => {
  //router.get('/', auth, (request, response) => {
  // Find boards which are created by logged in user or user is member
  name = request.user.name;
  //user = request.user;
  logger.log("/boards GET API", "email is : " + name);
  board
    .find({
      status: "Active",
      $or: [
        { createdBy: name },
        { adminUsers: name },
        { memberUsers: name },
        { invitedUsers: name },
      ],
    })
    .then((board) => {
      console.log("Boards found: " + board.length);
      if (board.length == 0) {
        response
          .status(404)
          .json({ success: false, msg: messages.BOARD_NOT_FOUND });
      } else {
        response.json(board);
      }
    })
    .catch((error) => resonse.status(500).json({ success: false, msg: error }));
});

/*********************************************/
// @route GET api/boards/:boardid
// @desc Gets task lists for a board for the Authorized user
// @access Authorized Users
/*********************************************/
router.get("/:boardid", authBoard, async (request, response) => {
  // Check for board Access
  logger.log(
    "GET api/boards/:boardid",
    "request.user.name: " + request.user.name
  );
  logger.log(
    "GET api/boards/:boardid",
    "Passed board id is: " + request.params.boardid
  );
  if (request.boardAccess) {
    logger.log(
      "GET api/boards/:boardid",
      "request.user.boardAccess: " + request.boardAccess
    );
    if (request.boardAccess === "Admin" || request.boardAccess === "User") {
      // Get task lists for board
      taskList
        .find({ boardId: request.params.boardid })
        .populate('tasks') 
        .then((taskLists) => {
          response.json({ boardId: request.params.boardid, taskLists });
        })
        .catch((error) =>
          response.status(500).json({ success: false, msg: error })
        );
    } else {
      response
        .status(401)
        .json({ success: false, msg: messages.BOARD_NO_ACCCESS });
    }
  } else {
    response
      .status(401)
      .json({ success: false, msg: messages.BOARD_NO_ACCCESS });
  }
});

/*********************************************/
// @route DELETE api/boards/:boardid
// @desc Deletes a board for the Authorized user (Admin)
// @access Authorized Users
/*********************************************/
router.delete("/:boardid", authBoard, (request, response) => {
  // Check for board Access
  logger.log(
    "DELETE api/boards/:boardid",
    "request.user.name: " + request.user.name
  );
  logger.log(
    "DELETE api/boards/:boardid",
    "Passed board id is: " + request.params.boardid
  );
  if (request.boardAccess) {
    logger.log(
      "DELETE api/boards/:boardid",
      "request.user.boardAccess: " + request.boardAccess
    );
    if (request.boardAccess === "Admin") {
      board.findById(request.params.boardid).then((board) => {
        board
          .remove()
          .then(() => {
            response.json({ success: true });
          })
          .catch((error) =>
            response.status(500).json({ success: false, msg: error })
          );
      });
    } else {
      response
        .status(401)
        .json({ success: false, msg: messages.BOARD_DELETE_NO_ACCESS });
    }
  } else {
    response
      .status(401)
      .json({ success: false, msg: messages.BOARD_DELETE_NO_ACCESS });
  }
});

module.exports = router;
