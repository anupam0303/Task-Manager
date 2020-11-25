import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

import { Modal, ModalHeader } from "reactstrap";

const useStyles = makeStyles((theme) => ({
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
}));

export default function NewTaskList(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState();
  const [open, setOpen] = React.useState(false);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const toggle = () => {
    setOpen(!open);
  };

  const handleCreateBoardList = () => {
    console.log("Value is: " + value);
    props.handleCreateBoardList(value);
  };

  const newColumnBody = (
    <div className={classes.root}>
      <Modal
        isOpen={open}
        toggle={toggle}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <ModalHeader toggle={toggle}>Add New Column</ModalHeader>
        <TextField
          className={classes.textField}
          name="taskListName"
          label="Task List Name"
          id="standard-size-small"
          defaultValue=""
          size="small"
          onChange={handleChange}
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleCreateBoardList}
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
        onClick={toggle}
      >
        ADD COLUMN
      </Button>
      {newColumnBody}
    </div>
  );
}
