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
    const errors = scope ? this.errors.filter(e => e.scope === scope) : this.errors

    return field ? errors.filter(e => e.field === field) : errors
  }

  getMessages(scope: ?String): Array {
    let errors = this.errors.slice(0)

    if (scope) {
      errors = errors.filter(e => e.scope === scope)
    }

    return errors.map(e => e.message)
  }

  clear(scope: ?String) {
    const errors = this.errors.slice(0)

    this.errors = scope ? errors.filter(e => e.scope !== scope) : []
  }

  has(field: String, scope: ?String): Boolean {
    let errors = this.errors.slice(0)

    if (scope) {
      errors = errors.filter(e => e.scope === scope)
    }

    return errors.filter(e => e.field === field).length
  }

  replace(scope: String, error: Error | Array<Error>) {
    const errorFiltered = this.errors.filter(e => e.scope !== scope)
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
