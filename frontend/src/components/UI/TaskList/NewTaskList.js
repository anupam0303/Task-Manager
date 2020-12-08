import React,{Component} from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";


import { Modal, ModalHeader } from "reactstrap";

const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(5),
      width: theme.spacing(55),
      height: theme.spacing(55),
    },
  },
  textField: {
    marginLeft: theme.spacing(10),
    marginRight: theme.spacing(5),
    marginTop: theme.spacing(2),
    width: "40ch",
  },
  button: {
    backgroundColor: "#2874a6",
    marginLeft: theme.spacing(10),
    marginRight: theme.spacing(5),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: "45ch",
    height: "5ch",
  },
});

class NewTaskList extends Component {
  
  state = {
    value: null,
    open: false
  };

  handleChange = (event) => {
    this.setState({value: event.target.value});
  };

  toggle = () => {
    this.setState({open: !this.state.open});
  };

  handleCreateBoardList = () => {
    console.log("Value is: " + this.state.value);
    this.props.handleCreateBoardList(this.state.value);
  };

  
  render() {
    //const classes = useStyles();
    const { classes } = this.props;
    const newColumnBody = (
      <div className={classes.root}>
        <Modal
          isOpen={this.state.open}
          toggle={this.toggle}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <ModalHeader toggle={this.toggle}>Add New Column</ModalHeader>
          {this.props.error.status ? (
              <Alert severity="error">{this.props.error.msg.msg}</Alert>
            ) : null}
          <TextField
            className={classes.textField}
            name="taskListName"
            label="Task List Name"
            id="standard-size-small"
            defaultValue=""
            size="small"
            onChange={this.handleChange}
          />
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={this.handleCreateBoardList}
          >
            ADD
          </Button>
        </Modal>
      </div>
    );
  return (
    <div>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={this.toggle}
      >
        ADD COLUMN
      </Button>
      {newColumnBody}
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

export default connect(mapStateToProps, null)(withStyles(useStyles)(NewTaskList));
