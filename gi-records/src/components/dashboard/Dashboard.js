import React, { Component } from 'react'
import ProjectList from '../projects/ProjectList'
import Notifications from './Notifications'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom';
import DashChart1 from '../layout/DashChart1';
import DashChart2 from '../layout/DashChart2';
//import DashChart3 from '../layout/DashChart3';




class Dashboard extends Component {
  render() {
    console.log(this.props)
    const { projects, auth } = this.props;
    if (!auth.uid) return <Redirect to='/signin' />

    return (

      <div className="row">
        <div className="col s12 m6">
          {/*<ProjectList projects={projects} />*/}
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
            {/*<Notifications />*/}
          </div>
        </div>
      </div>

    )
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    projects: state.firestore.ordered.projects,
    auth: state.firebase.auth,
    points: state.coordinates.points
  }
}

export default compose(
  connect(mapStateToProps, null),
  firestoreConnect([
    { collection: 'projects' }
  ])
)(Dashboard)