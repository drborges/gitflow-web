import _ from '../../../node_modules/underscore/underscore'
import {Mapper} from 'mapper'

export class ObjectMapper extends Mapper {

  constructor(model) {
    super(model)
  }

  canMap(property) {
    return _.isObject(property)
  }

  firebaseValueHandler(Model) {
    return snapshot =>
      this[snapshot.key()] = new Model().bindTo(this.model.context.child(snapshot.key()))
  }

  debouncedChangesHandler() {
    return _.debounce(changes => {
      changes.
        filter(change => mapped.has(change.name)).
        forEach(change => this.model.context.child(change.name).update(change.name, change.object[change.name]))
    }, 400)
  }

  mapToFirebase(property) {
    Object.observe(this[property], debouncedChangesHandler())
  }

  mapFromFirebase(property, Model) {
    this.context.child(property).on('value', firebaseValueHandler(Model))
  }
}
