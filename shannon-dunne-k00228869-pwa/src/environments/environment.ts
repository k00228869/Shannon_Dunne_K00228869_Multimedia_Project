// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyBvjLw_07VAZla0KrNJ0B9U4Bp-6HI47XA',
    authDomain: 'appointment-pwa.firebaseapp.com',
    projectId: 'appointment-pwa',
    databaseURL: `https://appointment-pwa.firebaseio.com`,
    storageBucket: 'appointment-pwa.appspot.com',
    messagingSenderId: '261553978543',
    appId: '1:261553978543:web:3f1bb48d7314718b54285a',
    measurementId: 'G-THPQD1KSMY'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
