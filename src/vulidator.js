import ErrorBag from './errorBag'
import Error from './error'
import Scope from './scope'
import forIn from 'lodash/forIn'

// @flow

let $_rules = {}

export default class Validator {
  static rules() {
    return $_rules
  }

  scopes: Object

  form: Object

  errorBag: ErrorBag

  vnode: VNode

  currentScope: String

  constructor(vnode: VNode, form: Object) {
    this.form = form
    this.errorBag = new ErrorBag()
    this.vnode = vnode
    this.scopes = {}
  }

  discoveryScope(elm: HTMLElement) {
    const scopeElms = elm.querySelectorAll('[data-vulidate-model]')
    const itSelf = elm.dataset.vulidateModel
    const isScopeFound = scopeElms.length || itSelf

    if (isScopeFound && !Object.keys(this.scopes).length) {
      // loop forms definition
      forIn(this.form, (form, name) => {
        // discovery by query
        for (const scopeElement of scopeElms) {
          if (scopeElement.dataset.vulidateModel === name) {
            this.scopes[name] = new Scope(form, scopeElement, this.vnode.$data[name])
          }
        }

        // discovery itself
        if (itSelf === name) {
          this.scopes[name] = new Scope(form, elm, this.vnode.$data[name])
        }
      })
    }
  }

  /**
   * @todo: nested component
   * Validate on HTMLElement
   * Validate on scope
   */
  validate(mix) {
    this.discoveryScope(this.vnode.$el)
    switch (true) {
      case mix.target !== undefined:
        this.currentScope = this.getScope(mix.target)
        return this.currentScope ? this.handler(this.scopes[this.currentScope]) : null

      case typeof mix === 'string':
        this.currentScope = this.scopes.hasOwnProperty(mix) ? mix : null
        return this.currentScope ? this.handler(this.scopes[this.currentScope]) : null

      default:
        this.currentScope = null
        return
    }
  }

  getScope(el: HTMLElement): String | null {
    const scope = el.dataset.vulidateModel

    if (scope) {
      return scope
    }

    if (el.tagName !== 'BODY') {
      return this.getScope(el.parentElement)
    }

    return null
  }

  static rule(name: String, validator: Function | Object) {
    if (!validator.hasOwnProperty('validate') || !validator.hasOwnProperty('message')) {
      throw 'the validate and message is mandatory'
    }

    $_rules[name] = Object.assign({}, validator)
  }

  static hasRule(name: String) {
    return $_rules.hasOwnProperty(name)
  }

  static use(vulRules: Object) {
    Object.keys(vulRules).forEach(v => {
      Validator.rule(v, vulRules[v])
    })
  }

  messageResolver(form, field, defaultMessage) {
    return form.message && form.message.hasOwnProperty(field)
      ? form.message[field]
      : defaultMessage
  }

  fieldNameResolver(form, field) {
    return form.nameDisplayed && form.nameDisplayed.hasOwnProperty(field)
      ? form.nameDisplayed[field]
      : field
  }

  handler(scope: Scope) {
    if (!scope.data || !scope.form.rules) {
      throw Error('Hello world')
    }

    const form = scope.form

    this.errorBag.clear(this.currentScope)

    Object.keys(form.rules).forEach(field => {
      const ruleByField = form.rules[field]

      Object.keys(ruleByField).forEach(r => {
        const rulesDefined = Validator.rules()
        if (
          rulesDefined.hasOwnProperty(r) &&
          !rulesDefined[r].validate(scope.data[field], ruleByField[r], scope.data)
        ) {
          const ruleMessage = rulesDefined[r].message(this.fieldNameResolver(form, field))
          const message = this.messageResolver(form, field, ruleMessage)
          this.errorBag.append(new Error(field, message, this.currentScope, r))
        }
      })
    })

    if (!this.fail(this.currentScope)) {
      this.vnode[this.form[this.currentScope].action]()
    }
  }

  fail(scope) {
    return this.errorBag.any(scope)
  }

  passed(scope) {
    return !this.fail(scope)
  }
}
