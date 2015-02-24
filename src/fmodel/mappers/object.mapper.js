import _ from '../../../node_modules/underscore/underscore'

export class ObjectMapper {

  constructor(model) {
    this.model = model
    this.mapped = new Set()
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

  map(property, Model) {
    if (!this.canMap(property)) {
      connsole.warn('ObjectMapper cannot map property' + property + '. An object must be provided.')
      return this
    }

    if (this.mapped.has(property))
      return this

    this.mapped.add(property)

    // Maps data from Firebase into model
    this.context.child(property).on('value', firebaseValueHandler(Model))

    // Maps data from model into Firebase
    Object.observe(this[property], debouncedChangesHandler())

    return this
  }
}
