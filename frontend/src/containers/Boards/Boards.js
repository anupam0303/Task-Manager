import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";

import {
  Modal,
  ModalHeader,
} from "reactstrap";

import BoardCard from "../../components/UI/BoardCard/BoardCard";
import { clearErrors } from "../../actions/errorActions";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getBoards, createBoard } from "../../actions/boardActions";

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
    backgroundColor: '#2874a6',
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    marginTop: theme.spacing(5),
    width: "45ch",
  },
  icon: {
    backgroundColor: '#2874a6',
    color: 'white'
  }
});

class Boards extends Component {
  state = {
    open: false,
    boardName: ""
  };

  componentDidMount() {
    console.log("Calling getBoards method");
    this.props.getBoards();
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  toggle = () => {
    // Clear Errors
    console.log('Toggle is called, setting value to: ' + !this.state.open);
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

  render() {
    const { classes } = this.props;
    const { boards } = this.props.boards;
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

    return (
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
                date = {board.lastUpdatedDate}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

Boards.propTypes = {
  getBoards: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  boards: state.boards,
  error: state.error,
});

export default connect(mapStateToProps, { getBoards, createBoard, clearErrors })(
  withStyles(useStyles)(Boards)
);
