export const signIn = (credentials, firebase) => {
  return (dispatch, getState) => {
    
    firebase.auth().signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    ).then(() => {
      dispatch({ type: 'LOGIN_SUCCESS' });
    }).catch((err) => {
      dispatch({ type: 'LOGIN_ERROR', err });
    });

  }
}

export const signOut = (firebase) => {
  return (dispatch, getState) => {
    console.log(firebase)
    firebase.auth().signOut().then(() => {
      dispatch({ type: 'SIGNOUT_SUCCESS' })
    });
  }
}

export const signUp = (newUser, firebase) => {
  return (dispatch, getState) => {

    firebase.auth().createUserWithEmailAndPassword(
      newUser.email, 
      newUser.password,
    ).then(resp => {
      return firebase.firestore().collection('users').doc(resp.user.uid).set({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        initials: newUser.firstName[0] + newUser.lastName[0],
        ethereumAdd: newUser.ethereumAdd,
      });
    }).then(() => {
      dispatch({ type: 'SIGNUP_SUCCESS' });
    }).catch((err) => {
      dispatch({ type: 'SIGNUP_ERROR', err});
    });
  }
}