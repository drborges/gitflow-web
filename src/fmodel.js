export class FModel {
  constructor(context) {
    this.context = context
  }

  key() {
    return this.context.key()
  }

  hasKey(key) {
    return this.context.key() === key
  }

  mapAll() {
    this.context.on('child_removed', snapshot => delete this[snapshot.key()])
    this.context.on('child_added', snapshot => this[snapshot.key()] = snapshot.val())
    this.context.on('child_changed', snapshot => this[snapshot.key()] = snapshot.val())

    Object.observe(this, changes => {
      changes.forEach(change => this.context.child(change.name).set(change.object[change.name]))
    })

    return this
  }

  map(property, Model) {
    this.context.child(property).on('value', snapshot => {
      this[property] = Model ? new Model(this.context.child(property)) : snapshot.val()
    })
    return this
  }

  mapList(listProperty, Model) {
    if (!this[listProperty]) {
      this[listProperty] = []
    }

    this.context.child(listProperty).on('child_added', snapshot => {
      let itemContext = this.context.child(listProperty).child(snapshot.key())
      this[listProperty].push(new Model(itemContext))
    })

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
