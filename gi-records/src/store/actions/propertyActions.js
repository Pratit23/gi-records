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

export const quotePrice = (sellerID, price, state, city, locality, plotNo, landID, coords, sellerFName, sellerLName, firebase) => {
  console.log("Seller ID: ", sellerID)
    return (dispatch, getState) => {
      const profile = getState().firebase.profile;
      const yourEthID = getState().firebase.profile.ethereumAdd;
      console.log("Firebase: ", firebase)
      const concat = landID + yourEthID
      const accepted = 0
      firebase.firestore().collection('quotes').doc(concat).set({
        authorFirstName: profile.firstName,
        authorLastName: profile.lastName,
        state: state,
        city: city,
        locality: locality,
        plotNo: plotNo,
        landID: landID,
        coords: coords,
        quotedPrice: price,
        buyerEthID: yourEthID,
        sellerEthID: sellerID,
        createdAt: new Date(),
        accepted : accepted,
        sellerFName: sellerFName,
        sellerLName: sellerLName,
      }).then(() => {
        dispatch({ type: 'SENT_QUOTE' });
      }).catch(err => {
        dispatch({ type: 'SENT_QUOTE_ERROR' }, err);
      });
    }
  };
// export const quotePrice = (newProperty, firebase) => {
//   //console.log("Seller ID: ", sellerID)
//     return (dispatch, getState) => {
//       const profile = getState().firebase.profile;
//       const yourEthID = getState().firebase.profile.ethereumAdd;
//       console.log("Firebase: ", firebase)
//       firebase.firestore().collection('quotes').doc(yourEthID).set({
//         // authorFirstName: profile.firstName,
//         // authorLastName: profile.lastName,
//         // // city: city,
//         // // locality: locality,
//         // // coords: coords,
//         // quotedPrice: price,
//         // buyerEthID: yourEthID,
//         // sellerEthID: sellerID,
//         // createdAt: new Date(),
//         property: newProperty
//       }).then(() => {
//         dispatch({ type: 'SENT_QUOTE' });
//       }).catch(err => {
//         dispatch({ type: 'SENT_QUOTE_ERROR' }, err);
//       });
//     }
//   };