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
                        //background: 'https://placeimg.com/640/480/tech',
                        email: auth.email,
                        image: 'https://picsum.photos/200/300',
                        name: data.firstName+" "+data.lastName
                    }}
                    userView
                />
                <SideNavItem divider />
                <SideNavItem subheader>
                    <span  className="white-text">Main Menu</span>
                </SideNavItem>
                <li><NavLink className="white-text" to='/'><Icon className="white-text">dashboard</Icon>Dashboard</NavLink></li>
                <li><NavLink className="white-text" to='/chartboard'><Icon className="white-text">insert_chart</Icon>Chartboard</NavLink></li>
                <li><NavLink className="white-text" to='/ViewAllLand'><Icon className="white-text">place</Icon>Your Lands</NavLink></li>
                <li><NavLink className="white-text" to='/Database'><Icon className="white-text">add</Icon>Add Land</NavLink></li>
                <Collapsible accordion className="collapHead">
                        <CollapsibleItem
                            className="collapHead"
                            expanded={false}
                            header={<span className="white-text">Land Transact</span>}
                            node="div">
                            <li><NavLink className="white-text" to='/SellLand'><Icon className="white-text">local_offer</Icon>Sell Land</NavLink></li>
                            <li><NavLink className="white-text" to='/BuyLand'><Icon className="white-text">local_offer</Icon>Buy Land</NavLink></li>
                        </CollapsibleItem>
                </Collapsible>
                <SideNavItem divider />
                <SideNavItem>
                    <SignedInLinks />
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





