import Firebase from 'firebase'
import {FModel} from './fmodel'

export class GitflowApp {
  constructor() {
    let context = new Firebase('https://gitflow.firebaseio.com/boards/board1')
    this.board = new Board(context)
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
    this.map('title').map('owner', User).mapItemsOf('flows', Flow)
  }
}

class Flow extends FModel {
  constructor(context) {
    super(context)
    this.map('title').mapItemsOf('issues', Issue)
  }
}

class Issue extends FModel {
  constructor(context) {
    super(context)
    this.mapAll()
  }
}
