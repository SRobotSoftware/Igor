'use strict'

angular
  .module('Igor')
  .factory('DataService', DataService)

function DataService($firebaseObject, $log) {
  $log.debug('DataService: Initialized')
  const vm = this
  vm.getData = getData
  let groups = null
  const ref = firebase.database().ref().child('goups')
  const syncObject = $firebaseObject(ref)
  syncObject.$bindTo(groups, 'groups')
  function getData() {
    return groups
  }
  return vm
}

