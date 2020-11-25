import React, { Component } from "react";
import { connect } from "react-redux";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";

import { getTaskLists, createtaskList } from "../../actions/taskListActions";
import { verifyToken } from "../../actions/authActions";

import NewTaskList from "../../components/UI/TaskList/NewTaskList";

const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: 2,
    textAlign: "center",
  },
});

class SingleBoard extends Component {
  state = {
    open: false,
    taskListName: "",
  };

  componentDidMount() {
    if (!this.props.auth.isAuthenticated && this.props.auth.token) {
      console.log(
        "Token present but it is not authunticated, calling verify token"
      );
      this.props.verifyToken();
    }
    console.log("Calling getTaskLists with: " + this.props.boards.workingBoard);
    this.props.getTaskLists(this.props.boards.workingBoard);
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleCreateBoardList = (taskListName) => {
    //const { taskListName } = this.state;
    const newTaskList = {
      taskListName,
      boardId: this.props.boards.workingBoard,
    };
    console.log(
      "newTaskList: " + newTaskList.taskListName + " , " + newTaskList.boardId
    );
    this.props.createtaskList(newTaskList);
  };

  render() {
    const classes = useStyles();
    const { taskLists } = this.props.taskLists;
    var hasTaskLists = this.props.taskLists.taskLists.taskList ? true : false;
    console.log("hasTaskLists: " + hasTaskLists);
    const showTaskLists = () => {
      if (hasTaskLists) {
        return taskLists.taskList.map((taskList) => (
          <h1>{taskList.taskListName}</h1>
        ));
      }
    };
    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
            <NewTaskList handleCreateBoardList={this.handleCreateBoardList} />
          </Grid>
        </Grid>
        {showTaskLists()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  boards: state.boards,
  error: state.error,
  auth: state.auth,
  taskLists: state.taskLists,
});

export default connect(mapStateToProps, {
  verifyToken,
  getTaskLists,
  createtaskList,
})(withStyles(useStyles)(SingleBoard));
