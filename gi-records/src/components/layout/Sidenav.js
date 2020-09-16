import React, { useEffect } from 'react'
import { SideNav, SideNavItem, Button, Icon, Collapsible, CollapsibleItem } from 'react-materialize'
import { Link, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'
import { Redirect } from 'react-router-dom';

const trigger = <a href=""><i className="material-icons">chevron_right</i></a>

var data = localStorage.getItem('userDetails')
data = JSON.parse(data)

const Sidenav = (props) => {
    const { auth, profile } = props;
    const links = auth.uid ? <SignedInLinks profile={profile} /> : <SignedOutLinks />;
    if (!auth.uid) return <Redirect to='/signin' />

    return (
        <div>
            <style>
                {}
            </style>
            <SideNav
                id="SideNav-10"
                options={{
                    draggable: true,
                    fixed: true
                }}
            //trigger={<Button node="button">SIDE NAV DEMO</Button>}
            >
                <SideNavItem
                    user={{
                        background: '',
                        email: 'jdandturk@gmail.com',
                        image: 'static/media/react-materialize-logo.824c6ea3.svg',
                        name: 'John Doe'
                    }}
                    userView
                />
                <SideNavItem
                    href="#!icon"
                    icon={<Icon>cloud</Icon>}
                >
                    First Link With Icon
                </SideNavItem>
                <SideNavItem>
                    <li><NavLink to='/'>Dashboard</NavLink></li>
                </SideNavItem>
                <SideNavItem>
                    <li><NavLink to='/chartboard'>Chartboard</NavLink></li>
                </SideNavItem>
                <SideNavItem>
                    <li><NavLink to='/ViewAllLand'>Your Lands</NavLink></li>
                </SideNavItem>
                <SideNavItem>
                    <li><NavLink to='/Database'>Add Land</NavLink></li>
                </SideNavItem>
                <SideNavItem divider />
                <SideNavItem subheader>
                    Subheader
                </SideNavItem>
                <SideNavItem>
                    <SignedInLinks/>
                </SideNavItem>
            </SideNav>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile //adding profile which is on the state to the props
    }
}

export default connect(mapStateToProps, null)(Sidenav)





