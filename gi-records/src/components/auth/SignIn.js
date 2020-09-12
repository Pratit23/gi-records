import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signIn } from '../../store/actions/authActions'
import { Redirect } from 'react-router-dom'
import { withFirebase } from 'react-redux-firebase';

class SignIn extends Component {
  state = {
    email: '',
    password: '',
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.signIn(this.state, this.props.firebase)
  }

  render() {
    const { authError, auth } = this.props;
    if (auth.uid) return <Redirect to='/' />

    return (
      <div className="container">
        <form className="black signInContainer" onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col s6 signInBack">
              <img className="responsive-img" src={require("../../images/signInGif.gif")} />
            </div>
            <div className="col s6 signInForm">
              <h5 className="white-text">Sign In</h5>
              <div className="input-field">
                <label htmlFor="email">Email</label>
                <input className="white-text" required type="email" id='email' onChange={this.handleChange} />
              </div>
              <div className="input-field">
                <label htmlFor="password">Password</label>
                <input className="white-text" required type="password" id='password' onChange={this.handleChange} />
              </div>
              <div className="input-field">
                <button className="btn waves-effect waves-light pink" type="submit" name="action">Sign In
                  <i className="material-icons right">send</i>
                </button>
                <div className="center red-text">
                  {authError ? <p>{authError}</p> : null}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (creds, firebase) => dispatch(signIn(creds, firebase))
  }
}

export default withFirebase(connect(mapStateToProps, mapDispatchToProps)(SignIn));