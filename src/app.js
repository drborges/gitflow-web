import Firebase from 'firebase'

export class GitflowApp {

  constructor() {
    let context = new Firebase('https://fiery-heat-2090.firebaseio.com/boards')

    let gitflowBoardContext = context.child('gitflow')
    this.board = new Board().boundTo(gitflowBoardContext)
  }
}

class Board {
  constructor(snapshotVal = {}) {
    this.title = snapshotVal.title
    this.flows = []
  }

  boundTo(context) {
    context.child('title').on('value', snapshot => this.title = snapshot.val())
    context.child('flows').on('child_added', snapshot => {
      let flowContext = context.child('flows').child(snapshot.key())
      this.flows.push(new Flow(snapshot.val()).boundTo(flowContext))
    })

    return this
  }
}

class Flow {
  constructor(snapshotVal = {}) {
    this.title = snapshotVal.title;
    this.issues = []
  }

  boundTo(context) {
    context.child('title').on('value', snapshot => this.title = snapshot.val())
    context.child('issues').on('child_added', snapshot => {
      let issueContext = context.child('issues').child(snapshot.key())
      this.issues.push(new Issue(snapshot.val()).boundTo(issueContext))
    })

    return this
  }
}

class Issue {
  constructor(snapshotVal = {}) {
    this.title = snapshotVal.title
    this.description = snapshotVal.description
    this.type = snapshotVal.type
    this.owner = snapshotVal.owner
    this.createdAt = snapshotVal.createdAt
  }

  boundTo(context) {
    context.on('child_changed', snapshot => {
      let issueProperty = snapshot.val()
      this[snapshot.key()] = issueProperty
    })

    return this
  }
}

