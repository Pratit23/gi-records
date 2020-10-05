import { storage } from '../../config/fbConfig'

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

var imageURL = ''

export const signUp = (newUser, firebase) => {
  console.log("New user: ", newUser)

  return (dispatch, getState) => {

    firebase.auth().createUserWithEmailAndPassword(
      newUser.email,
      newUser.password,
    ).then (resp => {
      const { image } = newUser

      const uploadTask = storage.ref(`profilePictures/${newUser.ethereumAdd}/${image.name}`).put(image);
      uploadTask.on('state_changed', (snapshot) => {
        //progress function

      }, (error) => {
        //Error Function
        console.log("Error: ", error)
      }, async() => {
        //Complete Function
        await storage.ref(`profilePictures/${newUser.ethereumAdd}`).child(image.name).getDownloadURL().then(url => {
          imageURL = url
          console.log("Image URL: ", imageURL)
          return firebase.firestore().collection('users').doc(resp.user.uid).set({
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            initials: newUser.firstName[0] + newUser.lastName[0],
            ethereumAdd: newUser.ethereumAdd,
            profilePicture: imageURL,
          });
        })
      })
    }).then(() => {
      dispatch({ type: 'SIGNUP_SUCCESS' });
    }).catch((err) => {
      dispatch({ type: 'SIGNUP_ERROR', err });
    });
  }
}