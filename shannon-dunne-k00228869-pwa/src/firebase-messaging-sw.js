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

