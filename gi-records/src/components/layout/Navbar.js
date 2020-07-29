import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'
import { connect } from 'react-redux'
import Tabs from './Tabs'

const Navbar = (props) => {
    const { auth, profile } = props;
    const links = auth.uid ? <SignedInLinks profile={profile} /> : <SignedOutLinks />;
    console.log(auth);
    return (
        <nav className="nav-extended">
            <div className="nav-wrapper grey darken-3">
                <Link to='/' className="brand-logo">Gi-Records</Link>
                {links}
            </div>
            <div className="nav-wrapper grey darken-4">
                <ul id="nav-mobile" className="left hide-on-med-and-down">
                    <li><NavLink to='/'>Dashboard</NavLink></li>
                    <li><NavLink to='/chartboard'>Chartboard</NavLink></li>
                    <li><NavLink to='/AddLand'>Add Land</NavLink></li>
                </ul>
            </div>
        </nav>
    )
}

const mapStateToProps = (state) => {
    console.log(state);
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile //adding profile which is on the state to the props
    }
}

export default connect(mapStateToProps, null)(Navbar)