import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        textAlign: 'justify',
        '& > *': {
          margin: theme.spacing(1),
          width: theme.spacing(35),
          height: theme.spacing(10),
        },
      },
    text: {
        margin: theme.spacing(2)
    }
}));

export default function Task(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(props.header);


  return (
    <div className={classes.root}>
      <Paper  elevation={3}>
         <div className={classes.text}>{value}</div>
      </Paper>
    </div>
  );
}
