// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "<api_key>",
    authDomain: "<domain_url>",
    projectId: "<project_id>",
    storageBucket: "<storage_bucket_url>",
    messagingSenderId: "<message_sender_id>",
    appId: "<app_id>",
  },
  BASE_API_URL: '<api_base_url>',
  BASE_FIREBASE_STORAGE_URL: '<firebase_storage_base_url>'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
