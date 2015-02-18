import Firebase from 'firebase'

export class GitflowApp {

  constructor() {
    let client = new Firebase("https://fiery-heat-2090.firebaseio.com/boards")
    client.on('child_added', (snapshot) => {
      this.board = new Board(snapshot.val())
    })
  }
}

class Board {
  constructor(boardAsJson) {
    this.title = boardAsJson.title
    this.flows = Object.keys(boardAsJson.flows).map(f => new Flow(boardAsJson.flows[f]))
  }
}

class Flow {
  constructor(flowAsJson) {
    this.title = flowAsJson.title
    this.issues = Object.keys(flowAsJson.issues).map(i => new Issue(flowAsJson.issues[i]))
  }
}

class Issue {
  constructor(issueAsJson) {
    this.type = issueAsJson.type
    this.title = issueAsJson.title
    this.description = issueAsJson.description
    this.owner = issueAsJson.owner
    this.createdAt = issueAsJson.createdAt
  }
}
