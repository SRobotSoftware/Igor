'use strict'

angular
  .module('Igor')
  .controller('DashboardController', DashboardController)

function DashboardController($rootScope, $scope, $state, $log, AuthService, users, classrooms) {
  // Local Vars
  const auth = $rootScope.authData.$getAuth()
  const vm = this
  let myself

  // Scoped Vars - Stop it.
  vm.createClassroom = createClassroom
  vm.removeClassroom = removeClassroom
  vm.removeClassroom = removeClassroom
  vm.leaveClassroom = leaveClassroom
  vm.convertUser = convertUser
  vm.isInstructor = isInstructor
  vm.displayLink = displayLink
  vm.isMentor = isMentor

  // Load data
  load()

  // Functions

  // Load data
  function load() {
    if (!auth) {
      $log.debug('Auth failed, please log in.')
      $state.go('login')
      return
    }
    users.$loaded().then(() => {
      users.forEach((element) => {
        if (element.id === auth.uid) {
          myself = element
          $scope.myName = myself.email
          $log.debug('User Found')
          classrooms.$loaded()
            .then(() => {
              findClassrooms()
              $log.debug('Classrooms Found')
            })
            .catch(res => {
              $log.debug('Classrooms not found', res)
            })
        }
      })
      if (!myself) $log.debug('User not found')
    })
  }

  // Displays a link with the proper URL for a given classroom
  function displayLink(room) {
    const out = `http://giskard.us/#/dashboard/${room.$id}`
    return out
  }

  // Checks if user is the instructor for a given classroom
  function isInstructor(classroom) {
    return classroom.instructorId === myself.id
  }

  // Checks if the user is a mentor for a given classroom
  function isMentor(classroom) {
    let x = false
    for (const mentor in classroom.mentors) {
      if (mentor === myself.id) x = true
    }
    return x
  }

  // Finds all Classrooms the user participates in
  function findClassrooms() {
    const result = []
    classrooms.forEach(element => {
      if (!element.students) element.students = []
      if (element.instructorId === myself.id) result.push(element)
      else if (element.students[myself.id]) result.push(element)
    })
    $scope.classrooms = result
    $scope.loaded = true
  }

  // Create Classroom
  function createClassroom(newClassroom) {
    if (!newClassroom) newClassroom = {}
    newClassroom.name = newClassroom.name || `${myself.email}\'s Classroom`
    newClassroom.description = newClassroom.description || 'A fun place to learn!'
    classrooms.$add({
      instructorId: myself.id,
      name: newClassroom.name,
      description: newClassroom.description,
      isLecturing: false,
    })
      .then(res => {
        $log.debug('Added class successfully')
        $log.debug(res.path.u[1])
        if (myself.classes) {
          myself.classes[res.path.u[1]] = res.path.u[1]
        } else {
          myself.classes = {}
          myself.classes[res.path.u[1]] = res.path.u[1]
        }
        users.$save(myself)
        findClassrooms()
      })
      .catch(res => {
        $log.debug('Error adding class')
        $log.debug(res)
      })
  }

  // Destroy classroom
  function removeClassroom(classroom) {
    if (confirm('Are you sure you want to delete this classroom?')) {
      // If there's any students, remove the classroom from their list as well
      const myKeys = Object.keys(classroom.students)
      if (myKeys.length > 0) {
        for (const student in myKeys) {
          removeClassFromUser(myKeys[student], classroom)
        }
      }
      removeClassFromUser(classroom.instructorId, classroom)
      classrooms.$remove(classroom).then(() => findClassrooms())
    }
  }

  // Remove classroom from list
  function leaveClassroom(classroom) {
    removeUserFromClass(classroom, myself)
    removeClassFromUser(myself, classroom)
    findClassrooms(myself)
  }

  // Convert uid to Name or Email or err
  function convertUser(user) {
    let result
    users.forEach(element => {
      if (element.id === user) {
        result = element.name || element.email
      }
    })
    if (result) return result
    return 'Name not Found'
  }

  // Removes classroom reference from user
  function removeClassFromUser(userToTarget, classToRemove) {
    let myUser
    users.forEach(element => {
      if (element.id === userToTarget) myUser = element
    })
    myUser.classes[classToRemove.$id] = null
    users.$save(myUser)
  }

  // Remove user reference from classroom
  function removeUserFromClass(classToTarget, userToRemove) {
    classToTarget.students[userToRemove.id] = null
    classrooms.$save(classToTarget)
  }
}
