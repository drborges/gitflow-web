import Firebase from 'firebase'
import {FModel} from './fmodel'

export class GitflowApp {
  constructor() {
    let context = new Firebase('https://gitflow.firebaseio.com/boards/board1')
    this.issue = {}
    this.board = new Board(context)
  }

  createIssue(newIssue) {
    this.board.flow(newIssue.flow).addIssue(newIssue)
  }
}

class User extends FModel {
  constructor(context) {
    super(context)
    this.mapAll()
  }
}

class Board extends FModel {
  constructor(context) {
    super(context)
    this.map('title').map('owner', User).mapList('flows', Flow)
  }

  flow(key) {
    return this.flows.find(flow => flow.key() === key)
  }
}

class Flow extends FModel {
  constructor(context) {
    super(context)
    this.map('title').mapList('issues', Issue)
  }

  addIssue(data) {
    this.context.child('issues').push({
      title: data.title,
      description: data.description
    })
    return this
  }
}

class Issue extends FModel {
  constructor(context) {
    super(context)
    this.mapAll()
  }
}
