import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { signUp } from '../../store/actions/authActions'
import { withFirebase } from 'react-redux-firebase';

const formValid = formErrors => {
  let valid = true;

  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false)
  })
  return valid;
}

const emailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
const passRegex = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/i)
const ethRegex = RegExp(/^0x[a-fA-F0-9]{40}$/i)

class SignUp extends Component {

  state = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    ethereumAdd: '',
    formErrors: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      ethereumAdd: ''
    }
  }

  handleChange = (e) => {
    e.preventDefault()

    const { name, value } = e.target
    let formErrors = this.state.formErrors

    switch (name) {
      case 'firstName':
        formErrors.firstName =
          value.length > 0
            ? ''
            : 'cannot be empty';
        break

      case 'lastName':
        formErrors.lastName =
          value.length > 0
            ? ''
            : 'cannot be empty';
        break
      case 'email':
        formErrors.email =
          emailRegex.test(value) && value.length > 0
            ? ''
            : 'invalid email address';
        break
      case 'password':
        formErrors.password =
          passRegex.test(value) && value.length > 0
            ? ''
            : 'password should be minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character';
        break
      case 'ethereumAdd':
        formErrors.ethereumAdd =
          ethRegex.test(value) && value.length > 0
            ? ''
            : 'Invalid Ethereum Address';
        break
    }
    this.setState({ formErrors, [name]: value })
    console.log("State in signup: ", this.state)
  }


  handleSubmit = (e) => {
    e.preventDefault();
    if (formValid(this.state.formErrors)) {
      console.log(`
        ---SUBMITTING---
        First name: ${this.state.firstName}
        Last name: ${this.state.lastName}
        Eth Address: ${this.state.ethereumAdd}
        `)
        this.props.signUp(this.state, this.props.firebase)
    } else {
      console.log(`Form Invalid`)
    }
  }


  render() {
    const { auth, authError } = this.props;
    if (auth.uid) return <Redirect to='/' />
    const { formErrors } = this.state;
    return (
      <div className="container">
        <form className="black signUpContainer" onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col s6">
              <img className="responsive-img signUpGif" src={require("../../images/test.gif")} />
            </div>
            <div className="col s6">
              <h5 className="white-text">Sign Up</h5>
              <div className="input-field">
                <label htmlFor="email">Email</label>
                <input name="email" className="white-text" required type="email" id='email' onChange={this.handleChange} />
                {formErrors.email.length > 0 && (
                  <span className="errorMessage red-text">{formErrors.email}</span>
                )}
              </div>
              <div className="input-field">
                <label htmlFor="password">Password</label>
                <input name="password" className="white-text" required type="password" id='password' onChange={this.handleChange} />
                {formErrors.password.length > 0 && (
                  <span className="errorMessage red-text">{formErrors.password}</span>
                )}
              </div>
              <div className="input-field">
                <label htmlFor="firstName">First Name</label>
                <input name="firstName" className="white-text" required type="text" id='firstName' onChange={this.handleChange} />
                {formErrors.firstName.length > 0 && (
                  <span className="errorMessage red-text">{formErrors.firstName}</span>
                )}
              </div>
              <div className="input-field">
                <label htmlFor="lastName">Last Name</label>
                <input name="lastName" className="white-text" required type="text" id='lastName' onChange={this.handleChange} />
                {formErrors.lastName.length > 0 && (
                  <span className="errorMessage red-text">{formErrors.lastName}</span>
                )}
              </div>
              <div className="input-field">
                <label htmlFor="ethereumAdd">Ethereum Address</label>
                <input name="ethereumAdd" className="white-text" required type="text" id='ethereumAdd' onChange={this.handleChange} />
                {formErrors.ethereumAdd.length > 0 && (
                  <span className="errorMessage red-text">{formErrors.ethereumAdd}</span>
                )}
              </div>
              <div className="input-field">
                <button className="btn pink lighten-1 z-depth-0">Sign Up</button>
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
    auth: state.firebase.auth,
    authError: state.auth.authError
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signUp: (newUser, firebase) => dispatch(signUp(newUser, firebase))
  }
}

export default withFirebase(connect(mapStateToProps, mapDispatchToProps)(SignUp))