const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)


// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });

const createNotification = (notification) => {
  return admin.firestore().collection('notifications')
  .add(notification)
  .then(doc => console.log('notification added: ', doc))
}

exports.quoteSent = functions.firestore
  .document('quotes/{sellerID}/{buyerID}')
  .onCreate(doc => { 
    const property = doc.data();
    console.log("Firestore function triggered")
    const notification = {
      content: 'Sent a price quotation',
      user: `${property.authorFirstName} ${property.authorLastName}`,
      time: admin.firestore.FieldValue.serverTimestamp()
    }
  })
