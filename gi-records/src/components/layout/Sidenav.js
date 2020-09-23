import React, { useEffect } from 'react'
import { SideNav, SideNavItem, Button, Icon, Collapsible, CollapsibleItem } from 'react-materialize'
import { Link, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { db } from '../../config/fbConfig'

const trigger = <a href=""><i className="material-icons">chevron_right</i></a>

var data = localStorage.getItem('userDetails')
data = JSON.parse(data)

const Sidenav = (props) => {
    const { auth, profile, accepted } = props;
    const links = auth.uid ? <SignedInLinks profile={profile} /> : <SignedOutLinks />;
    if (!auth.uid) return <Redirect to='/signin' />
    console.log("Accepeted:", accepted)

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
                        name: profile.firstName + " " + profile.lastName
                    }}
                    userView
                />
                <SideNavItem divider />
                <SideNavItem subheader>
                    <span className="white-text">Main Menu</span>
                </SideNavItem>
                <li><NavLink className="white-text" to='/'><Icon className="white-text">dashboard</Icon>Dashboard</NavLink></li>
                <li><NavLink className="white-text" to='/chartboard'><Icon className="white-text">insert_chart</Icon>Chartboard</NavLink></li>
                <li><NavLink className="white-text" to='/ViewAllLand'><Icon className="white-text">place</Icon>Your Lands</NavLink></li>
                <li><NavLink className="white-text" to='/Database'><Icon className="white-text">add</Icon>Add Land</NavLink></li>
                <li><NavLink className="white-text" to='/public'><Icon className="white-text">add</Icon>View All</NavLink></li>
                <Collapsible accordion className="collapHead">
                    <CollapsibleItem
                        className="collapHead"
                        expanded={false}
                        header={<span className="white-text">Land Transactions</span>}
                        node="div">
                        <ul>
                            <li><NavLink className="white-text" to='/BuyLand'><Icon className="white-text">local_offer</Icon>Buy Land</NavLink></li>
                            <li><NavLink className="white-text" to='/transactions'><Icon className="white-text">local_offer</Icon>Transacts</NavLink></li>
                        </ul>
                    </CollapsibleItem>
                </Collapsible>
                <SideNavItem divider />
                <div className="row">
                    <div className="col s12">
                        <NavLink to="/notifications">
                            <div className="card sideNavCard">
                                <div className="card-content white-text">
                                    <Icon className="white-text">notifications</Icon><span>Notifications</span>
                                </div>
                            </div>
                        </NavLink>
                    </div>
                </div>
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
        profile: state.firebase.profile, //adding profile which is on the state to the props
        accepted: state.firestore.ordered.accept
    }
}

export default compose(
    connect(mapStateToProps, null),
    firestoreConnect((props) => [
        //{ collection: 'quotes', orderBy: ['createdAt', 'desc'], where: [['buyerEthID', '==', data.ethereumAdd], ['accepted', '==', 1]], storeAs: 'accept' },
    ])
)(Sidenav)





