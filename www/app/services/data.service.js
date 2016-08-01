'use strict'

angular
  .module('Igor')
  .factory('Data.Service', DataService)

function DataService($firebaseObject, $log) {
  const vm = this
  const ref = firebase.database().ref().child('data')
  const syncObject = $firebaseObject(ref)
  syncObject.$bindTo(vm.data, 'data')
  return vm
}

