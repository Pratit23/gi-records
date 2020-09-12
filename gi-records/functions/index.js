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
  .document('quotes/{sellerID}')
  .onUpdate(doc => { 
    const property = doc.data();
    const notification = {
      content: 'Sent a price quotation',
      time: admin.firestore.FieldValue.serverTimestamp()
    }
    return createNotification(notification)
  })
