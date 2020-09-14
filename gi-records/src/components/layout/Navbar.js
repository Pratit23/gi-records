import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'
import { connect } from 'react-redux'
import SecondNav from './SecondNav'
import Sidenav from './Sidenav'

const Navbar = (props) => {
    const { auth, profile } = props;
    const links = auth.uid ? <SignedInLinks profile={profile} /> : <SignedOutLinks />;
    const bar = auth.uid ? <SecondNav /> : null;
    return (
        <nav className="nav-extended black mainNav">
            <div className="nav-wrapper">
                <Sidenav/>
                <Link to='/' className="brand-logo">BRUH</Link>
                {links}
                <Link to='/notifications'><i className="material-icons white-text notifIcon">notifications_none</i></Link>
            </div>
            {bar}
        </nav>
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile //adding profile which is on the state to the props
    }
}

export default connect(mapStateToProps, null)(Navbar)