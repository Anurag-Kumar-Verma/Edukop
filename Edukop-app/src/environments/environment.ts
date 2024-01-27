// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    Api: 'https://api.edukop.com',
    // Api: 'http://192.168.1.33:3000',
    // Api: 'https://mysterious-atoll-71730.herokuapp.com',
    imageApi: 'https://s3.ap-south-1.amazonaws.com/images.bookz.in/img',
    thumbApi: 'https://s3.ap-south-1.amazonaws.com/images.bookz.in/thumbnails',
    webClientId: '448881285949-1e6pg6somk2oa65ff3l2glc00qqbb4vj.apps.googleusercontent.com',
    razorPayKey: 'rzp_live_nb3qkCLQ451y6L',
    production: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
