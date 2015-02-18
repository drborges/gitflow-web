import Firebase from 'firebase'

export class GitflowApp {

  constructor() {
    let client = new Firebase("https://fiery-heat-2090.firebaseio.com/boards")
    client.on('child_added', (snapshot) => {
      this.board = Board.fromJson(snapshot.val())
      console.log(this.board)
    })
  }
}

class Board {
  static fromJson(board: Object) {
    let title = board.title
    let flows = Object.keys(board.flows).map(f => Flow.fromJson(board.flows[f]))
    return new Board(title, flows)
  }

  constructor(title: String, flows: List<Flow> = []) {
    this.title = title
    this.flows = flows
  }
}

class Flow {
  static fromJson(flow: Object) {
    let title = flow.title
    let issues = Object.keys(flow.issues).map(i => Issue.fromJson(flow.issues[i]))
    return new Flow(title, issues)
  }

  constructor(title: String, issues: List<Issue> = []) {
    this.title = title
    this.issues = issues
  }
}

class Issue {
  static fromJson(issue: Object) {
    return new Issue(issue)
  }

  constructor(issue: Object) {
    this.title = issue.title
    this.description = issue.description
    this.type = issue.type
    this.owner = issue.owner
    this.createdAt = issue.createdAt
  }
}
