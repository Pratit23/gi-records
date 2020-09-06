import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { signOut } from '../../store/actions/authActions'
import { withFirebase } from 'react-redux-firebase'

const SignedInLinks = (props) => {
  return (
    <div>
      <ul className="right">
        {/*<li><NavLink to='/create' className="hide-on-small-only">New Project</NavLink></li>*/}
        <li><a onClick={()=>props.signOut(props.firebase)} className="hide-on-small-only">Log Out</a></li>
        <li><NavLink to='/' className="btn btn-floating pink lighten-1">{ props.profile.initials }</NavLink></li>
      </ul>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: (firebase) => dispatch(signOut(firebase))
  }
}

export default withFirebase(connect(null, mapDispatchToProps)(SignedInLinks))