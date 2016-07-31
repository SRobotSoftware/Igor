'use strict'

angular
  .module('Igor')
  .controller('QueueController', QueueController)

function QueueController($rootScope, $scope, $stateParams, $firebaseArray, $state, $log, users, classrooms) {
  // Local vars
  const vm = this
  const auth = $rootScope.authData.$getAuth()
  const classId = $stateParams.classroomId
  let myself

  // Scoped vars - No no no no.
  vm.answer = answer
  vm.convertObject = convertObject

  // Load data
  load()

  // Functions

  // Convert Object to Array - Why?
  function convertObject(object) {
    const out = []
    if (!object) object = {}
    Object.keys(object).forEach(element => { out.push(object[element]) })
    return out
  }

  // Answer question - I don't even know what this is doing
  function answer(question) {
    let current = null
    let currentIndex = null
    for (let i = 0; i < $scope.myRoom.questionsOld.length; i++) {
      if ($scope.myRoom.questionsOld[i].id === question.id) {
        current = $scope.myRoom.questionsOld[i]
        currentIndex = i
      }
    }
    if (current) {
      current.answeredAt = Date.now()
      current.answeredBy = $scope.me
      classrooms.forEach(element => {
        if (element.$id === classId) {
          element.questionsOld[currentIndex] = current
          element.questions[question.id] = null
          classrooms.$save(element)
        }
      })
    }
  }

  // Load data - There's definitely a better way.
  function load() {
    if (!auth) {
      $log.debug('Auth failed, please log in.')
      $state.go('login')
      return
    }
    $scope.today = moment()
    users.$loaded().then(() => {
      $scope.users = users
      users.forEach(element => {
        if (element.id === auth.uid) {
          myself = element
          $scope.myself = element
          $scope.me = myself.id
          $log.debug('User Found')
          classrooms.$loaded()
            .then(() => {
              classrooms.forEach(classroom => {
                if (classroom.$id === classId) {
                  $scope.myRoom = classroom
                  $log.debug('Classroom Found')
                  $scope.loaded = true
                  let allowed = false
                  if (classroom.mentors.hasOwnProperty($scope.me) || classroom.instructorId === $scope.me) allowed = true
                  if (!allowed) {
                    $log.debug("Sorry, you're not authorized to be here.")
                    $state.go('dashboard')
                  }
                }
              })
            })
        }
      })
      if (!myself) $log.debug('User not found')
    })
  }
}
