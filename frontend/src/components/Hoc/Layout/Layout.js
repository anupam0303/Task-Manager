import React, { Component } from 'react'
import AppNavbar from '../../../components/Navigation/AppNavbar';

class Layout extends Component {

    render() {
        return (
            <div className="Content">
                <AppNavbar />
                <main>
                    {this.props.children}
                </main>
            </div>
        )
    }
}
export default Layout;