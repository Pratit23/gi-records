import React, { useEffect } from 'react'
import { SideNav, SideNavItem, Button, Icon, Collapsible, CollapsibleItem } from 'react-materialize'
import { Link, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'
import { Redirect } from 'react-router-dom';

const trigger = <a href=""><i className="material-icons">chevron_right</i></a>

const Sidenav = (props) => {
    const { auth, profile } = props;
    const links = auth.uid ? <SignedInLinks profile={profile} /> : <SignedOutLinks/>;
    {/*if (!auth.uid) return <Redirect to='/signin' />*/}

    return (
        <nav className="navbar">
            <ul className="navbar-nav">
                <li className="logo">
                    Testing
                </li>
                <li className="nav-item">
                    <NavLink to='/' className="sideNavText"><i className="material-icons notifIcon">dashboard</i>Dashboard</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to='/chartboard' className="sideNavText"><i className="material-icons notifIcon">insert_chart</i>Chartboard</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to='/ViewAllLand' className="sideNavText"><i className="material-icons notifIcon">landscape</i>Your Lands</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to='/Database' className="sideNavText"><i className="material-icons notifIcon">library_add</i>Add Land</NavLink>
                </li>
                <li className="nav-item"><div className="divider"></div></li>
                <li className="nav-item" id="themeButton">
                    <Collapsible accordion className="collapHead">
                        <CollapsibleItem
                            className="collapHead"
                            expanded={false}
                            header={<span className="white-text">Land Transact</span>}
                            node="div">
                            <NavLink className="black-text" to='/SellLand'>Sell Land</NavLink>
                            <NavLink className="black-text" to='/BuyLand'>Buy Land</NavLink>
                        </CollapsibleItem>
                    </Collapsible>
                </li>
                <li className="nav-item"><div className="divider"></div></li>
                <li className="nav-item" id="themeButton">
                    <Link to='/notifications' className="sideNavText"><i className="material-icons white-text notifIcon">notifications_none</i><span>Notifications</span></Link>
                </li>
                <li className="nav-item" id="themeButton">
                    {links}
                </li>
            </ul>
        </nav>
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile //adding profile which is on the state to the props
    }
}

export default connect(mapStateToProps, null)(Sidenav)
