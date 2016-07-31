'use strict'

angular
  .module('Igor')
  .controller('ClassroomController', ClassroomController)

function ClassroomController($rootScope, $scope, $stateParams, $firebaseArray, $state, $log, users, classrooms) {
  // Local Vars
  const vm = this
  const auth = $rootScope.authData.$getAuth()
  const classId = $stateParams.classroomId
  let myself

  // Scoped Vars
  $scope.myTopics = $firebaseArray(new Firebase('https://igorapp.firebaseio.com/classrooms/' + classId + '/topics'))
  $scope.isStudent = true
  vm.addTopic = addTopic
  vm.removeTopic = removeTopic
  vm.moveTopic = moveTopic
  vm.startLecture = startLecture
  vm.stopLecture = stopLecture
  vm.respond = respond
  vm.joinClassroom = joinClassroom
  vm.moveTopic = moveTopic
  vm.pullFromQueue = pullFromQueue
  vm.responseCount = responseCount
  vm.askQuestion = askQuestion
  vm.addMentor = addMentor
  vm.queuePosition = queuePosition
  vm.removeMentor = removeMentor

  // Load data
  load()

  // Functions

  // Check position in question Queue
  function queuePosition() {
    const list = $scope.myRoom.questions
    const sorted = Object.keys(list).sort((a, b) => list[a].time - list[b].time)
    const position = sorted.indexOf(myself.id)
    return position + 1
  }

  // Add a mentor
  function addMentor(mentor) {
    if (!$scope.myRoom.mentors) $scope.myRoom.mentors = {}
    let out
    users.forEach(element => { if (element.id === mentor) out = element })
    out = out || {}
    $log.debug(out)
    if (out.id) {
      $scope.myRoom.mentors[out.id] = out
      classrooms.$save($scope.myRoom)
    } else alert('Please select a Mentor')
  }

  // Remove Mentor
  function removeMentor(mentor) {
    $scope.myRoom.mentors[mentor.id] = null
    classrooms.$save($scope.myRoom)
  }

  // Ask a question
  function askQuestion(question) {
    if (!$scope.myRoom.questions) $scope.myRoom.questions = {}
    if (!$scope.myRoom.questionsOld) $scope.myRoom.questionsOld = []
    const out = {
      body: question,
      author: myself.email,
      time: Date.now(),
      id: myself.id,
    }
    $scope.myRoom.questions[myself.id] = out
    $scope.myRoom.questionsOld.push(out)
    classrooms.$save($scope.myRoom)
  }

  // Load data
  function load() {
    if (!auth) {
      $log.debug('Auth failed, please log in.')
      $state.go('login')
      return
    }
    $scope.today = moment()
    users.$loaded().then(() => {
      $scope.users = users
      users.forEach(user => {
        if (user.id === auth.uid) {
          myself = user
          $scope.me = myself.id
          $log.debug('User Found')
          classrooms.$loaded()
            .then(() => {
              classrooms.forEach(classroom => {
                if (classroom.$id === classId) {
                  $scope.myRoom = classroom
                  $log.debug('Classroom Found')
                  if (!myself.classes) myself.classes = {}
                  if (myself.classes[classId]) {
                    $log.debug('User is part of class')
                    $scope.joined = true
                  }
                  $scope.loaded = true
                  if (myself.id === $scope.myRoom.instructorId) $scope.isStudent = false
                }
              })
            })
        }
      })
      if (!myself) $log.debug('User not found')
    })
  }

  // move topic from queue to track or track to queue
  function moveTopic(topic) {
    const myTopic = $scope.myTopics.$indexFor(topic)
    $scope.myTopics[myTopic].track = !$scope.myTopics[myTopic].track
    $scope.myTopics[myTopic].lastModified = Date.now()
    $scope.myTopics.$save(myTopic)
  }

  // Add topic to track
  function addTopic(topic) {
    if (!topic) topic = {}
    topic.body = topic.body || 'EXAMPLE TOPIC BODY'
    topic.track = true
    topic.lastModified = Date.now()
    $scope.myTopics.$add(topic)
  }

  // Removes topic from db
  function removeTopic(topic) {
    $scope.myTopics.$remove($scope.myTopics.$indexFor(topic))
  }

  // Move all items from queue to track
  function pullFromQueue() {
    const myArr = $scope.myTopics.sort((a, b) => a.lastModified - b.lastModified)
    myArr.forEach(topic => {
      if (!topic.track) {
        topic.track = true
        topic.lastModified = Date.now()
        $scope.myTopics.$save(topic)
      }
    })
    classrooms.$save($scope.myRoom)
  }

  // Move all itesm from track to queue
  function pullfromTrack() {
    const myArr = $scope.myTopics.sort((a, b) => a.lastModified - b.lastModified)
    myArr.forEach(topic => {
      if (topic.track) {
        topic.track = false
        topic.lastModified = Date.now()
        $scope.myTopics.$save(topic)
      }
    })
    classrooms.$save($scope.myRoom)
  }

  // Start lecture
  function startLecture() {
    $scope.myRoom.isLecturing = true
    classrooms.$save($scope.myRoom)
  }

  // Stop lecture, move topics from track to queue
  function stopLecture() {
    pullfromTrack()
    $scope.myRoom.isLecturing = false
    classrooms.$save($scope.myRoom)
  }

  // Add student response to db
  function respond(i, response) {
    if (!i.responses) i.responses = {}
    i.responses[myself.id] = response
    $scope.myTopics.$save(i)
  }

  // Join classroom
  function joinClassroom(classroom) {
    if (classroom.instructorId === myself.id) return
    $log.debug('joining classroom')
    if (!myself.classes) myself.classes = {}
    myself.classes[classId] = classId
    if (!classroom.students) classroom.students = {}
    classroom.students[myself.id] = myself.id
    users.$save(myself)
    classrooms.$save(classroom)
    $scope.joined = true
    $state.reload()
  }

  function responseCount(topic, response) {
    let out = 0
    if (!response) {
      if (topic.responses) out = Object.keys(topic.responses).length
    } else {
      for (const res in topic.responses) {
        if (topic.responses[res] === response) out++
      }
    }
    return out
  }
}
