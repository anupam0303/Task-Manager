import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@material-ui/icons/AccessTime';


const useStyles = makeStyles({
  root: {
    maxWidth: 310,
    minHeight: 130,
    backgroundColor: '#2874a6',
    color: 'white'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  time: {
    fill: 'white'
  },
  title: {
    fontSize: 18,
  },
  pos: {
    marginBottom: 12,
  },
});

/* function routeChange(boardid) {
  console.log('Route Change is called');
  props.handleBoardClick(boardid);
} */

export default function BoardCard(props) {
  const classes = useStyles();
  var date = new Date(props.date); 
  var month = ["January", "February", "March", "April", "May", "June","July", 
               "August", "September", "October", "November", "December"][date.getMonth()];

  

  return (
    <Card className={classes.root} variant="outlined" onClick = {() => props.handleBoardClick(props.id, props.name)}> 
      <CardActionArea>
        <CardContent>
        <Typography className= {classes.title} >
            {props.name}
        </Typography>
        <br/>
        <Typography variant="body2" component="p">
        <AccessTimeIcon fontSize="small" className={classes.time}/>{" "+date.getDate()+ " " + month}
        </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
