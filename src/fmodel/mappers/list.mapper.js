import _ from '../../../node_modules/underscore/underscore'
import {Mapper} from 'mapper'

export class ListMapper extends Mapper {

  constructor(model) {
    super(model)
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

  mapToFirebase(property) {
    Object.observe(this[property], debouncedListItemAddedHandler(property))
    Object.observe(this[property], debouncedListItemRemovedHandler(property))
  }

  mapFromFirebase(property, Model) {
    this.context.child(property).on('child_added', firebaseChildAddedHandler(property, Model))
    this.context.child(property).on('child_removed', firebaseChildRemovedHandler(property))
  }
}
