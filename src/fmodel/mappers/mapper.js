import _ from '../../../node_modules/underscore/underscore'

/*
 * Provides 3-way data binding for primitive attributes of an object
 * such as 'String' and 'Number'
 */
export class Mapper {

  constructor(model) {
    this.model = model
    this.mapped = new Set()
  }

  canMap(property) { return true }

  mapToFirebase(property) {}

  mapFromFirebase(property, Model) {}

  map(property, Model) {
    if (!this.canMap(property)) {
      connsole.warn('SimpleMapper cannot map property' + property + '. A string or a number must be provided.')
      return this
    }

    if (this.mapped.has(property))
      return this

    this.mapped.add(property)

    mapFromFirebase(property, Model);
    mapToFirebase(property);
    return this
  }

  unmap(property) {
    this.context.child(property).off('value', firebaseValueHandler)
    return this
  }
}
