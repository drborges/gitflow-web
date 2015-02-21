// fQuery (a.k.a Firebase Query) syntax proposal

let reactiveBoard = new Board().boundTo(boardContext).observe('title').observeNewChildOf('flows').observeDeletedChildOf('flows')
let reactiveFlow  = new Flow().boundTo(flowContext).observe('title').observeNewChildOf('issues').observeDeletedChildOf('issues')
let reactiveIssue = new Issue().boundTo(issueContext).observeChildren()
