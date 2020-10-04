import React, { useState, useEffect } from 'react'
import Sidenav from '../layout/Sidenav'
import { connect } from 'react-redux'

const Profile = (props) => {

    const { profile, auth } = props
    console.log("Profile props: ", auth)
    return (
        <div className="row">
            <div className="col s2 mainSideNav">
                <Sidenav />
            </div>
            <div className="col s10">
                <div className="section">
                    <div className="row">
                        <div className="col s6">
                            <h1>Account Overview</h1>
                        </div>
                        <div className="col s6">
                            <div className="circlePic">
                                <img className="circle responsive-img circlePic" src={profile.profilePicture} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section profileSec">
                    <h1 className="upperCase white-text">{profile.firstName} {profile.lastName}</h1>
                    <h1 className="upperCase white-text">{auth.email}</h1>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        profile: state.firebase.profile,
        auth: state.firebase.auth,
    }
}

export default connect(mapStateToProps, null)(Profile)
