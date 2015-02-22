export class FModel {
  constructor(context) {
    this.context = context
  }

  hasKey(key) {
    return this.context.key() === key
  }

  mapAll() {
    this.context.on('child_removed', snapshot => delete this[snapshot.key()])
    this.context.on('child_added', snapshot => this[snapshot.key()] = snapshot.val())
    this.context.on('child_changed', snapshot => this[snapshot.key()] = snapshot.val())
    return this
  }

  map(property, Provider) {
    this.context.child(property).on('value', snapshot => {
      this[property] = Provider ? new Provider(this.context.child(property)) : snapshot.val()
    })
    return this
  }

  mapItemsOf(listProperty, ItemProvider) {
    if (!this[listProperty]) {
      this[listProperty] = []
    }

    this.context.child(listProperty).on('child_added', snapshot => {
      let itemContext = this.context.child(listProperty).child(snapshot.key())
      this[listProperty].push(new ItemProvider(itemContext))
    })

    this.context.child(listProperty).on('child_removed', snapshot => {
      for (let i = 0; i < this[listProperty].length(); i++) {
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
