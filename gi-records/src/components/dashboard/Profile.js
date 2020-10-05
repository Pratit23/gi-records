import React, { useState, useEffect } from 'react'
import Sidenav from '../layout/Sidenav'
import { connect } from 'react-redux'


const Profile = (props) => {

    // const [image, setImage] = useState(null)

    // const handlePicture = (e) => {
    //     e.preventDefault()
    //     setImage(e.target.files[0])
    //     console.log("Image in profile: ", image)
    //     const uploadTask = storage.ref(`profilePictures/${newUser.ethereumAdd}/${image.name}`).put(image);
    //   uploadTask.on('state_changed', (snapshot) => {
    //     //progress function

    //   }, (error) => {
    //     //Error Function
    //     console.log("Error: ", error)
    //   }, async() => {
    //     //Complete Function
    //     await storage.ref(`profilePictures/${newUser.ethereumAdd}`).child(image.name).getDownloadURL().then(url => {
    //       imageURL = url
    //       console.log("Image URL: ", imageURL)
    //     })
    //   })
    // }

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
                                {/*<input className="white-text changePic" type="file" onChange={handlePicture} />*/}
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
