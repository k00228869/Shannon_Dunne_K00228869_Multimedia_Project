// give access to firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.3.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.0/firebase-messaging.js');


//configuring firebase app
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

 
// access firebase messaging instance for the app
const messaging = firebase.messaging(); 

// this function is triggered when a message is received while the browser is out of focus
messaging.onBackgroundMessage((payload) => { //handle message when browser not in focus
  // console.log('[firebase-messaging-sw.js] bm received', payload);
  //customising notification message
      const notificationTitle = payload.data.title;
      const notificationOptions = {
        body: payload.data.body,
        icon: payload.data.icon,
        data: payload.data,
        onClick: payload.data.click_action
      };

  // this uses the service worker to display the notification on the device
  return showNotification(notificationTitle, notificationOptions);
});
