// give access to firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.3.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.0/firebase-messaging.js');


firebase.initializeApp({
    apiKey: "AIzaSyBvjLw_07VAZla0KrNJ0B9U4Bp-6HI47XA",
    authDomain: "appointment-pwa.firebaseapp.com",
    projectId: "appointment-pwa",
    databaseURL: `https://appointment-pwa.firebaseio.com`,
    storageBucket: "appointment-pwa.appspot.com",
    messagingSenderId: "261553978543",
    appId: "1:261553978543:web:3f1bb48d7314718b54285a",
    measurementId: "G-THPQD1KSMY"
  });

 

const messaging = firebase.messaging(); // access firebase messaging instance for the app

messaging.onBackgroundMessage((payload) => { //handle message when browser not in focus
  console.log('[firebase-messaging-sw.js] bm received', payload);
  // openSnackBar();
  saveNotification(payload);
  // displayNotification(payload)
  const notificationTitle = 'bm title';
  const notificationOptions = {
    body: 'bm body',
    icon: 'bm icon',
  }
  return self.showNotification(notificationTitle, notificationOptions);
  

});




// self.addEventListener('notificationclick', function(event) {
//     event.notification.close();
// });
