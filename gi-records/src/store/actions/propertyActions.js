export const sellProperty = (key, price, firebase) => {
    return (dispatch, getState) => {
      const profile = getState().firebase.profile;
      const sellerID = getState().firebase.profile.ethereumAdd;
      const landID = sellerID + key;
      firebase.firestore().collection('sellLand').add({
        authorFirstName: profile.firstName,
        authorLastName: profile.lastName,
        sellerID: sellerID,
        landID: landID,
        rate: 420,
        price: price,
        createdAt: new Date()
      }).then(() => {
        dispatch({ type: 'SELL_PROPERTY_SUCCESS' });
      }).catch(err => {
        dispatch({ type: 'SELL_PROPERTY_ERROR' }, err);
      });
    }
  };