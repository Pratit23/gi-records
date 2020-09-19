import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { signOut } from '../../store/actions/authActions'
import { withFirebase } from 'react-redux-firebase'

const SignedInLinks = (props) => {
  return (
    <div>
      {/*<li><NavLink to='/create' className="hide-on-small-only">New Project</NavLink></li>*/}
      <span className="logout blue-text" onClick={() => props.signOut(props.firebase)}>Log Out</span>
      {/*<li><NavLink to='/' className="btn btn-floating pink lighten-1">{ props.profile.initials }</NavLink></li>*/}
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: (firebase) => dispatch(signOut(firebase))
  }
}

export default withFirebase(connect(null, mapDispatchToProps)(SignedInLinks))