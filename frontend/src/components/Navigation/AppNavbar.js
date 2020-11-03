import React, { Component, Fragment } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Register from '../Auth/Register';
import Login from '../Auth/Login';
import Logout from '../Auth/Logout';

class AppNavbar extends Component {
    state = {
        isOpen: false
    }
    static propTypes = {
        auth: PropTypes.object.isRequired
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    };

    render() {
        const { isAuthenticated, user } = this.props.auth;
        const authLinks = (
            <Fragment>
                <NavItem>
                    <div className="navbar-text mr-3" >
                        <strong>{user ? `Welcome ${user.firstName} ${user.lastName}` : ''}</strong>
                    </div>
                </NavItem>
                <NavItem>
                    <Logout />
                </NavItem>
            </Fragment>
        );
        const guestLinks = (
            <Fragment>
                <NavItem>
                    < Login />
                </NavItem>
                <NavItem>
                    <Register />
                </NavItem>
            </Fragment>
        );
        return (
            <div>
                <Navbar color="dark" dark expand="md">
                        <NavbarBrand href="/">Task Manager</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                {isAuthenticated ? authLinks : guestLinks}
                            </Nav>
                        </Collapse>
                </Navbar>

            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, null)(AppNavbar);
