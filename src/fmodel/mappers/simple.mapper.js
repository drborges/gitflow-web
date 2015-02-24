import _ from '../../../node_modules/underscore/underscore'

/*
 * Provides 3-way data binding for primitive attributes of an object
 * such as 'String' and 'Number'
 */
export class SimpleMapper {

  constructor(model) {
    this.model = model
    this.mapped = new Set()
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

  map(property) {
    if (!this.canMap(property)) {
      connsole.warn('SimpleMapper cannot map property' + property + '. A string or a number must be provided.')
      return this
    }

    if (this.mapped.has(property))
      return this

    this.mapped.add(property)

    // Maps data from Firebase into model
    this.model.context.child(property).on('value', firebaseValueHandler)

    // Maps data from model into Firebase
    Object.observe(this, debouncedChangesHandler())

    return this
  }

  unmap(property) {
    this.context.child(property).off('value', firebaseValueHandler)
    return this
  }
}
