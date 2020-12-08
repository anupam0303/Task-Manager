import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";

import { Modal, ModalHeader, Container } from "reactstrap";

import BoardCard from "../../components/UI/BoardCard/BoardCard";
import Guest from "../../components/UI/Guest/Guest";
import { clearErrors } from "../../actions/errorActions";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getBoards, createBoard, setWorkingBoard } from "../../actions/boardActions";
import {verifyToken} from "../../actions/authActions";

const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(5),
      width: theme.spacing(55),
      height: theme.spacing(25),
    },
  },
  textField: {
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    marginTop: theme.spacing(2),
    width: "40ch",
  },
  button: {
    backgroundColor: "#2874a6",
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    marginTop: theme.spacing(5),
    width: "45ch",
  },
  icon: {
    backgroundColor: "#2874a6",
    color: "white",
  },
});

class Boards extends Component {
  state = {
    open: false,
    boardName: "",
  };

  componentDidMount() {
    if (!this.props.auth.isAuthenticated && this.props.auth.token){
      console.log('Token present but it is not authunticated, calling verify token');
      this.props.verifyToken();
    }
    console.log("Calling getBoards method");
    this.props.getBoards();
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  toggle = () => {
    // Clear Errors
    console.log("Toggle is called, setting value to: " + !this.state.open);
    this.props.clearErrors();
    this.setState({
      open: !this.state.open,
    });
  };

  handleCreateBoard = () => {
    const { boardName, name } = this.state;
    const newBoard = {
      boardName,
      name,
    };

    // Create new Board
    this.props.createBoard(newBoard);
  };

  handleBoardClick = (boardid, boardname) => {
    console.log('Clicked Board boardid is:' +boardid );
    this.props.setWorkingBoard(boardid, boardname);
    let path = `/board`;
    window.location.href=path;
  }

  render() {
    const { classes } = this.props;
    const { boards } = this.props.boards;
    const { isAuthenticated } = this.props.auth;
    const newBoardBody = (
      <div className={classes.root}>
        <Paper>
          {this.props.error.status ? (
            <Alert severity="error">{this.props.error.msg.msg}</Alert>
          ) : null}
          <TextField
            className={classes.textField}
            name="boardName"
            label="Board Name"
            id="standard-size-small"
            defaultValue=""
            size="small"
            onChange={this.onChange}
          />
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={this.handleCreateBoard}
          >
            CREATE BOARD
          </Button>
        </Paper>
      </div>
    );

    const authDisplay = (
      <div style={{ padding: 20 }}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <span />
          <Fab className={classes.icon} aria-label="add" onClick={this.toggle}>
            <AddIcon />
          </Fab>
        </Grid>
        <Modal
          isOpen={this.state.open}
          toggle={this.toggle}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <ModalHeader toggle={this.toggle}>Create Board</ModalHeader>
          {newBoardBody}
        </Modal>
        <Grid container spacing={3}>
          {boards.map((board) => (
            <Grid item xs={3} key={board._id}>
              <BoardCard
                id={board._id}
                name={board.boardName}
                date={board.lastUpdatedDate}
                handleBoardClick = {this.handleBoardClick}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    );

    const guestDisplay = <Guest />;
    return (
      <Container fluid>
        {isAuthenticated ? authDisplay : guestDisplay}
      </Container>
    );
  }
}

Boards.propTypes = {
  getBoards: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  boards: state.boards,
  error: state.error,
  auth: state.auth
});

export default connect(mapStateToProps, {
  getBoards,
  createBoard,
  setWorkingBoard,
  clearErrors,
  verifyToken,
})(withStyles(useStyles)(Boards));
