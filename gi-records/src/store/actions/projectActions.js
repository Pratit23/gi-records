export const createProject = (project, firebase) => {
  return (dispatch, getState) => {
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;
    firebase.firestore().collection('projects').add({
      ...project,
      authorFirstName: profile.firstName,
      authorLastName: profile.lastName,
      authorId: authorId,
      createdAt: new Date()
    }).then(() => {
      dispatch({ type: 'CREATE_PROJECT_SUCCESS' });
    }).catch(err => {
      dispatch({ type: 'CREATE_PROJECT_ERROR' }, err);
    });
  }
};