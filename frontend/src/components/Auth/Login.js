import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/authActions";
import { clearErrors } from "../../actions/errorActions";
import TextField from "@material-ui/core/TextField";

import {
  NavLink,
  Alert,
  Button,
  Form,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(10),
      width: theme.spacing(55),
      height: theme.spacing(40),
    },
  },
  textField: {
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    marginTop: theme.spacing(2),
    width: "40ch",
  },
  button: {
    backgroundColor: "#2874a6",
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    marginTop: theme.spacing(5),
    width: "45ch",
  },
});

class Login extends Component {
  state = {
    modal: false,
    email: "",
    password: "",
    msg: null,
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      // Check for Login Failure
      if (error.id === "LOGIN_FAIL") {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }

    // If authenticated, close the modal
    if (this.state.modal) {
      if (isAuthenticated) {
        this.toggle();
      }
    }
  }

  toggle = () => {
    // Clear Errors
    this.props.clearErrors();
    this.setState({
      modal: !this.state.modal,
    });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    const user = {
      email,
      password,
    };
    // Login
    this.props.login(user);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <NavLink onClick={this.toggle} href="#">
          Login
        </NavLink>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>User Login</ModalHeader>
          <ModalBody>
            {this.state.msg ? (
              <Alert color="danger"> {this.state.msg} </Alert>
            ) : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <TextField
                  className={classes.textField}
                  name="email"
                  label="Email"
                  id="standard-size-email"
                  defaultValue=""
                  size="small"
                  onChange={this.onChange}
                />
                <TextField
                  className={classes.textField}
                  name="password"
                  label="Password"
                  type="password"
                  id="standard-password-input"
                  defaultValue=""
                  size="small"
                  onChange={this.onChange}
                />

                <Button
                  className={classes.button}
                >
                  Login
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
});

export default connect(mapStateToProps, { login, clearErrors })(
  withStyles(useStyles)(Login)
);
