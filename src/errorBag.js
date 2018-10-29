import filter from 'lodash/filter'
import map from 'lodash/map'
import find from 'lodash/findIndex'
import Error from './error'

// @flow

export default class ErrorBag {
  errors: Array<Error>

  constructor() {
    if (!this.errors) {
      this.errors = []
    }
  }

  getErrors(scope: ?String, field: ?String): Array {
    const errors = scope ? filter(this.errors, e => e.scope === scope) : this.errors

    return field ? filter(errors, e => e.field === field) : errors
  }

  getMessages(scope: ?String): Array {
    let errors = Object.assign({}, this.errors)

    if (scope) {
      errors = filter(errors, e => e.scope === scope)
    }

    return map(errors, e => e.message)
  }

  clear(scope: ?String) {
    const errors = Object.assign({}, this.errors)

    this.errors = scope ? filter(errors, e => e.scope !== scope) : []
  }

  has(field: String, scope: ?String): Boolean {
    let errors = this.errors.slice(0)

    if (scope) {
      errors = filter(errors, e => e.scope === scope)
    }

    return find(errors, e => e.field === field) !== -1
  }

  replace(scope: String, error: Error | Array<Error>) {
    const errorFiltered = filter(this.errors, e => e.scope !== scope)
    this.clear()
    this.append(errorFiltered)
    this.append(error)
  }

  append(error: Error | Array<Error>) {
    const errors = Array.isArray(error) ? error : [error]

    for (const err of errors.slice(0)) {
      this.errors.push(err)
    }
  }

  count(): Number {
    return this.errors.length
  }

  first(): ?Error {
    return this.errors.length ? this.errors[0] : null
  }

  any(scope: ?String): Boolean {
    return Boolean(this.getErrors(scope).length)
  }
}
