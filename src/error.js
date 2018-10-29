// @flow

export default class Error {
  rule: String

  field: String

  message: String

  scope: String

  constructor(field: String, message: String, scope: String, rule: String) {
    this.field = field
    this.message = message
    this.scope = scope
    this.rule = rule
  }
}
