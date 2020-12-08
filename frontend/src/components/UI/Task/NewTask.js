import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: '27ch',
    },
  },
}));

export default function NewTask(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState("");



  const handleChange = (event) => {
    setValue(event.target.value);
    props.setNewTaskTitle(event.target.value);
  };


  return (
    <div className={classes.root}>
      <Paper  elevation={3} className={classes.paper}>
        <TextField
        id="newTask-Textfield"
        multiline
        rows={2}
        value={value}
        onChange={handleChange}
        variant="outlined"
      />
      </Paper>
    </div>
  );
}
