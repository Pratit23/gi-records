export const sellProperty = (key, price, states, city, locality, plotNo, buyingRate, coords, firebase) => {
    return (dispatch, getState) => {
      const profile = getState().firebase.profile;
      const sellerID = getState().firebase.profile.ethereumAdd;
      const landID = sellerID + key;
      console.log("Firebase: ", firebase)
      firebase.firestore().collection('sellLand').doc(landID).set({
        authorFirstName: profile.firstName,
        authorLastName: profile.lastName,
        sellerID: sellerID,
        landID: landID,
        state: states,
        city: city,
        locality: locality,
        plotNo: plotNo,
        rate: buyingRate,
        price: price,
        coords: coords,
        createdAt: new Date()
      }).then(() => {
        dispatch({ type: 'SELL_PROPERTY_SUCCESS' });
      }).catch(err => {
        dispatch({ type: 'SELL_PROPERTY_ERROR' }, err);
      });
    }
  };