importScripts('https://www.gstatic.com/firebasejs/8.3.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyBvjLw_07VAZla0KrNJ0B9U4Bp-6HI47XA",
    authDomain: "appointment-pwa.firebaseapp.com",
    projectId: "appointment-pwa",
    storageBucket: "appointment-pwa.appspot.com",
    messagingSenderId: "261553978543",
    appId: "1:261553978543:web:3f1bb48d7314718b54285a",
    measurementId: "G-THPQD1KSMY"
  });


const messaging = firebase.messaging(); // get firebase instance

// this.messaging.onTokenRefresh(handleTokenRefresh);
// handleTokenRefresh()
//   {
//     return this.afm.requestToken.pipe( // get token
//         tap(token => {
//           console.log('store token', token);
//           let theUser = JSON.parse(localStorage.getItem('user'));
//           console.log(theUser.uid);
//           console.log('add token to db', token);
//           this.uid = theUser.uid;
//           this.subscrip = {};
//           this.subscrip.token = token;
//           this.subscrip.id = this.uid;
//           console.log('saved subscription', this.subscrip);
//           return from (this.firestore.collection<IUser['user']>('users')
//           .doc<IUser['user']>(this.uid)
//           .collection<IUser['subscription']>('subscriptions').add(this.subscrip)); // store token + user id
//         })
//       );
//   }


  