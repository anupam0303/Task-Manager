import React, { Component } from "react";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";

import { getTaskLists, createtaskList } from "../../actions/taskListActions";
import { verifyToken } from "../../actions/authActions";

import NewTaskList from "../../components/UI/TaskList/NewTaskList";
import TaskListSwimLane from "../../components/UI/TaskList/TaskListSwimLane";

//const useStyles = (theme) => ({
const styles = {
  root: {
    display: "flex",
    flexDirection: "row",
  },
  gridList: {
    transform: "translateZ(0)",
  },
  taskList: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    overflow: "auto",
  },
  paper: {
    padding: 2,
    textAlign: "center",
  },
};

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
    //const classes = useStyles();
    const { classes } = this.props;
    const { taskLists } = this.props.taskLists;
    var hasTaskLists = this.props.taskLists.taskLists.taskLists ? true : false;
    console.log("hasTaskLists: " + hasTaskLists);
    const showTaskLists = () => {
      if (hasTaskLists) {
        return taskLists.taskLists.map((taskList) => (
          <TaskListSwimLane taskListName= {taskList.taskListName} taskListId={taskList._id} />
        ));
      }
    };
    return (
      <div >
        <div className={classes.root}>
        <Grid container justify="space-around" spacing={3}>
          <Grid item xs={12} sm={3}>
            <h4>{this.props.boards.workingBoardName}</h4>
          </Grid>
          <Grid item xs={12} sm={3} >
            <NewTaskList handleCreateBoardList={this.handleCreateBoardList} />
          </Grid>
          </Grid>
          </div>
        <div className={classes.taskList}>
            {showTaskLists()}
        </div>
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
})(withStyles(styles)(SingleBoard));
