export const sellProperty = (key, price, states, city, locality, buyingRate, firebase) => {
    return (dispatch, getState) => {
      const profile = getState().firebase.profile;
      const sellerID = getState().firebase.profile.ethereumAdd;
      const landID = sellerID + key;
      firebase.firestore().collection('sellLand').doc(landID).set({
        authorFirstName: profile.firstName,
        authorLastName: profile.lastName,
        sellerID: sellerID,
        landID: landID,
        state: states,
        city: city,
        locality: locality,
        rate: buyingRate,
        price: price,
        createdAt: new Date()
      }).then(() => {
        dispatch({ type: 'SELL_PROPERTY_SUCCESS' });
      }).catch(err => {
        dispatch({ type: 'SELL_PROPERTY_ERROR' }, err);
      });
    }
  };