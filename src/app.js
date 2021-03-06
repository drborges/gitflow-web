import Firebase from 'firebase'
import {FModel} from './fmodel'

export class GitflowApp {
  constructor() {
    let context = new Firebase('https://gitflow.firebaseio.com/boards/board1')
    this.issue = {}
    this.board = new Board().bindTo(context)
  }

  createIssue(newIssue) {
    this.board.flow(newIssue.flow).addIssue(newIssue)
  }
}

class Board extends FModel {
  mappings(mapper) {
    mapper.map('title').map('owner', User).mapList('flows', Flow)
  }

  flow(key) {
    return this.flows.find(flow => flow.key() === key)
  }
}

class Flow extends FModel {
  mappings(mapper) {
    mapper.map('title').mapList('issues', Issue)
  }

  addIssue(data) {
    // TODO perhaps I can use Object.observe to trigger this save call in FModel
    // whenever a new issue is added to the list
    this.context.child('issues').push({
      title: data.title,
      description: data.description
    })
    return this
  }
}

class Issue extends FModel {}
class User extends FModel {}
