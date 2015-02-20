import Firebase from 'firebase'

export class GitflowApp {

  constructor() {
    let context = new Firebase('https://fiery-heat-2090.firebaseio.com/boards')

    let gitflowBoardContext = context.child('gitflow')
    this.board = new Board().boundTo(gitflowBoardContext)
  }
}

const EmptyBoardSnapshotVal = {
  flows: {}
}

const EmptyFlowSnapshotVal = {
  issues: {}
}

class Board {
  constructor(snapshotKey, snapshotVal = EmptyBoardSnapshotVal) {
    this.key = snapshotKey
    this.title = snapshotVal.title
    this.flows = [] //Object.keys(snapshotVal.flows).map(flowKey => new Flow(flowKey, snapshotVal.flows[flowKey]))
  }

  boundTo(context) {
    //this.flows.forEach(flow => flow.boundTo(context.child('flows').child(flow.key)))

    context.child('title').on('value', snapshot => this.title = snapshot.val())
    context.child('flows').on('child_added', snapshot => {
      let flowContext = context.child('flows').child(snapshot.key())
      this.flows.push(new Flow(snapshot.key(), snapshot.val()).boundTo(flowContext))
    })

    return this
  }
}

class Flow {
  constructor(snapshotKey, snapshotVal = EmptyFlowSnapshotVal) {
    this.key = snapshotKey
    this.title = snapshotVal.title;
    this.issues = [] //Object.keys(snapshotVal.issues).map(issueKey => new Issue(issueKey, snapshotVal.issues[issueKey]))
  }

  boundTo(context) {
    //this.issues.forEach(issue => issue.boundTo(context.child('issues').child(issue.key)))

    context.child('title').on('value', snapshot => this.title = snapshot.val())
    context.child('issues').on('child_added', snapshot => {
      let issueContext = context.child('issues').child(snapshot.key())
      this.issues.push(new Issue(snapshot.key(), snapshot.val()).boundTo(issueContext))
    })

    return this
  }
}

class Issue {
  constructor(snapshotKey, snapshotVal = {}) {
    this.key = snapshotKey
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
