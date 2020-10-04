import React, { useState, useEffect } from 'react'
import Sidenav from '../layout/Sidenav'
import { connect } from 'react-redux'

const Profile = (props) => {
    
    const { profile } = props
    console.log("Profile props: ", profile)
    return (
        <div className="row">
            <div className="col s2 mainSideNav">
                <Sidenav />
            </div>
            <div className="col s10">
                <div className="section">
                    <h1>Account Overview</h1>
                </div>
                <div className="section">
                    <h3>Name: {profile.firstName} {profile.lastName}</h3>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      profile: state.firebase.profile,
    }
  }

  export default connect(mapStateToProps, null)(Profile)
