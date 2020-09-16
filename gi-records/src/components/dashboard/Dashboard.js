import React, { Component } from 'react'
import ProjectList from '../projects/ProjectList'
import Notifications from './Notifications'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom';
import DashChart1 from '../layout/DashChart1';
import DashChart2 from '../layout/DashChart2';
import { db } from '../../config/fbConfig'
import Sidenav from '../layout/Sidenav'
//import DashChart3 from '../layout/DashChart3';


class Dashboard extends Component {

  render() {
    console.log(this.props)
    const { projects, auth, notifications } = this.props;
    if (!auth.uid) {
      this.props.history.push('/signin')
    }
    return (
      <div className="row">
        <div className="col s2 mainSideNav">
          <Sidenav/>
        </div>
        <div className="col s10">
          <div className="section">
            <h1>Dashboard</h1>
          </div>
          <div className="section dashSec2">
            <div className="row">
              <div className="col s12 m6">
              </div>
              <div className="col s12 m5 offset-m1">
                <div className="row">
                  <div className="col s12 m6">
                    <div className="card red darken-1">
                      <div className="mainCard card-content white-text">
                        <div className="section">
                          <span className="cardTitle card-title white-text">Watchlist</span>
                        </div>
                        <div className="cardChart section">
                          <DashChart1 />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col s12 m6">
                    <div className="card  blue darken-1">
                      <div className="mainCard card-content white-text">
                        <div className="section">
                          <span className="cardTitle card-title white-text">Rate</span>
                        </div>
                        <div className="cardChart section">
                          <DashChart2 />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="section">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  console.log("State: ", state);
  localStorage.setItem('userDetails', JSON.stringify(state.firebase.profile))
  return {
    projects: state.firestore.ordered.projects,
    auth: state.firebase.auth,
    notifications: state.firestore.ordered.quotes,
    ethID: state.firebase.profile.ethereumAdd
  }
}


export default compose(
  connect(mapStateToProps, null),
  firestoreConnect((props) => [
    { collection: 'quotes', orderBy: ['createdAt', 'desc'], storeAs: 'notif' },
  ])
)(Dashboard)


// return [
//   {
//     collection: 'users',             // parent collection
//     doc: props.userId,        // sub-document
//     subcollections: [
//       { collection: 'images' }        // sub-collection
//     ],
//     storeAs: 'images'
//   }
// ]