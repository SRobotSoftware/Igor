'use strict'

const firebaseConfig = {
  apiKey: 'AIzaSyC2cVJYjFaVmgmoWOqE5HeLlmEz-lSKScc',
  authDomain: 'igorassistant-a6c75.firebaseapp.com',
  databaseURL: 'https://igorassistant-a6c75.firebaseio.com',
  storageBucket: '',
}
firebase.initializeApp(firebaseConfig)

angular
  .module('Igor', [
    'ui.router',
    'firebase',
    'angularMoment',
    'ngMaterial',
  ])
  .config(() => { })
  .run(() => { })
