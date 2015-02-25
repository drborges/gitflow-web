import _ from '../../../node_modules/underscore/underscore'
import {Mapper} from 'mapper'

/*
 * Provides 3-way data binding for primitive attributes of an object
 * such as 'String' and 'Number'
 */
export class SimpleMapper extends Mapper {

  constructor(model) {
    super(model)
  }

  firebaseValueHandler(snapshot) {
    this[snapshot.key()] = snapshot.val()
  }

  debouncedChangesHandler() {
    return _.debounce(changes => {
      changes.
        filter(change => mapped.has(change.name)).
        forEach(change => this.model.context.update(change.name, change.object[change.name]))
    }, 400)
  }

  canMap(property) {
    return _.isString(property) || _.isNumber(property)
  }

  mapToFirebase(property) {
    Object.observe(this, debouncedChangesHandler())
  }

  mapFromFirebase(property, Model) {
    this.model.context.child(property).on('value', firebaseValueHandler)
  }
}
