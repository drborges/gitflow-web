import Firebase from 'firebase'

export class GitflowApp {

  constructor() {
    let context = new Firebase("https://fiery-heat-2090.firebaseio.com/boards/gitflow")
    this.board = Board.fromContext(context)
  }
}

class Board {
  static fromJson(board: Object) {
    let title = board.title
    let flows = Object.keys(board.flows).map(f => Flow.fromJson(board.flows[f]))
    return new Board(title, flows)
  }

  static fromContext(context: Firebase) {
    let board = new Board().bindTo(context)
    context.on('value', (snapshot) => {
      let newBoard = Board.fromJson(snapshot.val())
      board.title = newBoard.title
      board.flows = newBoard.flows
      console.log('New Board loaded:', newBoard)
    })
    return board
  }

  constructor(title: String = '', flows: List<Flow> = []) {
    this.title = title
    this.flows = flows
  }

  bindTo(context: Firebase) {
    this.context = context
    return this
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
