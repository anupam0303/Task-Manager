import React, { Component } from "react";

//import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Modal from "@material-ui/core/Modal";
import TextField from '@material-ui/core/TextField';

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getBoards } from "../../actions/boardsActions";

const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: 5,
    textAlign: "center",
  },
});

class Boards extends Component {
  state = {
    open: false,
  };

  componentDidMount() {
    console.log("Calling getBoards method");
    //this.props.getBoards();
  }

  handleOpen= () => {
    this.setState({ open: true });
  }

  handleClose= () => {
    this.setState({ open: false });
  }

  render() {
    const classes = useStyles();
    const newBoardBody = (
    <div>
      <TextField label="Size" id="standard-size-small" defaultValue="Small" size="small" />
      <TextField label="Size" id="standard-size-normal" defaultValue="Normal" />
    </div>
   );

    return (
      <div className={classes.root} style={{ padding: 20 }}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <span />
          <Fab color="primary" aria-label="add" onClick={this.handleOpen}>
            <AddIcon />
          </Fab>
        </Grid>
        <Modal
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {newBoardBody}
        </Modal>
      </div>
    );
  }
}

Boards.propTypes = {
  getBoards: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  boards: state.boards,
});

export default connect(mapStateToProps, { getBoards })(Boards);
