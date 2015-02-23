import _ from '../node_modules/underscore/underscore'

export class FModel {
  bindTo(context) {
    this.context = context
    this.mappings(this) // TODO encapsulate mapping functions within a mapper instance
    return this
  }

  // Maps any Firebase attribute by default
  mappings() {
    this.mapAny()
  }

  key() {
    return this.context.key()
  }

  hasKey(key) {
    return this.context.key() === key
  }

  mapAny() {
    this.context.on('child_removed', snapshot => delete this[snapshot.key()])
    this.context.on('child_added', snapshot => this[snapshot.key()] = snapshot.val())
    this.context.on('child_changed', snapshot => this[snapshot.key()] = snapshot.val())

    let throttledUpdateChanges = _.throttle(changes => {
      changes.
        filter(change => change.name !== '__observers__' && change.name !== '__observer__').
        filter(change => change.type === 'update').
        forEach(change => this.context.child(change.name).set(change.object[change.name]))
    }, 400)

    Object.observe(this, changes => throttledUpdateChanges(changes))
    return this
  }

  map(property, Model) {
    this.context.child(property).on('value', snapshot => {
      this[property] = Model ? new Model().bindTo(this.context.child(property)) : snapshot.val()
    })
    return this
  }

  mapList(listProperty, Model) {
    if (!this[listProperty]) {
      this[listProperty] = []
    }

    this.context.child(listProperty).on('child_added', snapshot => {
      let itemContext = this.context.child(listProperty).child(snapshot.key())
      this[listProperty].push(new Model().bindTo(itemContext))
    })

    let throttledAddChanges = _.throttle(changes => {
      changes.
        filter(change => change.name !== '__observers__' && change.name !== '__observer__').
        filter(change => change.type === 'add').
        forEach(change => console.log(change))//this.context.child(change.name).set(change.object[change.name]))
    }, 400)

    Object.observe(this, changes => throttledAddChanges(changes))

    this.context.child(listProperty).on('child_removed', snapshot => {
      for (let i = 0; i < this[listProperty].length; i++) {
        let item = this[listProperty][i]
        if (item.hasKey(snapshot.key())){
          item.detach()
          this[listProperty].splice(i, 1)
          break
        }
      }
    })

    return this
  }

  detach() {
    this.context.off()
    return this
  }
}
