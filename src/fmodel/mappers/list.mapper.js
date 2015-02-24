import _ from '../../../node_modules/underscore/underscore'

export class ListMapper {

  constructor(model) {
    this.model = model
    this.mapped = new Set()
  }

  canMap(property) {
    return _.isArray(property)
  }

  firebaseChildAddedHandler(property, Model) {
    return snapshot =>
      this[property].push(new Model().bindTo(this.model.context.child(property).child(snapshot.key())))
  }

  firebaseChildRemovedHandler(property) {
    return snapshot => {
      this[property] = this[property].filter(model => model.key() === snapshot.key())
    }
  }

  debouncedListItemAddedHandler(property) {
    return _.debounce(changes => {
      changes.
        filter(change => mapped.has(change.name) && change.type === 'add').
        forEach(change => {
          let item = change.object[change.name]
          // TODO implements toFirebase method
          // It should iterate over the list of mappers and build up an object with all the mapped fields
          let key = this.context.child(property).push(item.toFirebase())
          item.bindTo(this.context.child(property).child(key))
        })
    }, 400)
  }

  debouncedListItemRemovedHandler(property) {
    return _.debounce(changes => {
      changes.
        filter(change => mapped.has(change.name) && change.type === 'delete').
        forEach(change => {
          let item = change.object[change.name]
          this.context.child(property).child(item.key()).remove()
        })
    }, 400)
  }

  map(property, Model) {
    if (!this.canMap(property)) {
      connsole.warn('ListMapper cannot map property' + property + '. A list must be provided.')
      return this
    }

    if (this.mapped.has(property))
      return this

    this.mapped.add(property)

    // Maps data from Firebase into model
    this.context.child(property).on('child_added', firebaseChildAddedHandler(property, Model))
    this.context.child(property).on('child_removed', firebaseChildRemovedHandler(property))

    // Maps new items added to the model into Firebase
    Object.observe(this[property], debouncedListItemAddedHandler(property))

    // Maps new items added to the model into Firebase
    Object.observe(this[property], debouncedListItemRemovedHandler(property))

    return this
  }
}
