import authReducer from './authreducer'
import coordReducer from './coordReducer'
import projectReducer from './projectReducer'
import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'
import hashReducer from './hashReducer'


const rootReducer = combineReducers({
    auth: authReducer,
    project: projectReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer,
    coordinates: coordReducer,
    //hashvalue: hashReducer
});

export default rootReducer