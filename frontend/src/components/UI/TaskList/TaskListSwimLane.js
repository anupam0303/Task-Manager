import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import NewTask from "../Task/NewTask";
import Task from "../Task/Task";
import { createTask } from "../../../actions/taskListActions";

const useStyles = (theme) =>({
  root: {
    minWidth: 300,
    marginLeft: 25,
    backgroundColor: "#f2f2f2",
  },
  media: {
    height: 140,
  },
});

class TaskListSwimLane extends Component {
  state = {
    newTask: false,
    newTaskTitle: null,
  };

  addAnotherTask = () => {
    //alert("Creating task");
    this.setState({ newTask: true });
  };

  addTask = () => {
    //alert(this.state.newTaskTitle);
    let newTask = {
        header: this.state.newTaskTitle,
        taskListId: this.props.taskListId
    };
    console.log('Calling create task');
    this.props.createTask(newTask);

  };

  disableNewTak= () => {
    this.setState({newTask: false});
  };

  setNewTaskTitle = (title) => {
    this.setState({
        ...this.state,
        newTaskTitle: title
    });
  }

  render() {
    const { classes } = this.props;
    const newTaskControls = (
        <div>
          <Button size="small" color="primary" onClick = {this.addTask}>
            Add Task
          </Button>
          <Button size="small" color="primary" onClick = {this.disableNewTak}>
            Delete
          </Button>
        </div>
    );
    const taskListControls = (
        <Button size="small" color="primary" onClick={this.addAnotherTask}>
            Add Another Task
        </Button>
    );

    let tasks = [];
    console.log("Before Filter, taskList is: " + this.props.taskLists.taskLists.taskLists[0]);
    this.props.taskLists.taskLists.taskLists.filter((taskList)=> {
     return taskList.taskListName ===this.props.taskListName;
    })
    .map((taskList) => {
      taskList.tasks.map((task) => {
        tasks.push(<Task header= {task.header}></Task>);
      });
    });

    return (
      <Card className={classes.root}>
        <CardContent>
          <Typography gutterBottom variant="body1" component="p" align="left">
            {this.props.taskListName}
          </Typography>
    <div>{tasks}</div>
          {this.state.newTask ? <NewTask setNewTaskTitle= {this.setNewTaskTitle}/> : null}
        </CardContent>
        <CardActions>
            {this.state.newTask ? newTaskControls : taskListControls}
        </CardActions>
      </Card>
    );
  }
};

const mapStateToProps = (state) => ({
    boards: state.boards,
    error: state.error,
    auth: state.auth,
    taskLists: state.taskLists,
  });

export default connect(mapStateToProps, {
    createTask
  }) (withStyles(useStyles)(TaskListSwimLane));
