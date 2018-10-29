// @flow

export default class Scope {
  form: FormDefinition

  el: HTMLElement

  data: Object

  constructor(form: FormDefinition, el: HTMLElement, data: Object) {
    this.form = form
    this.el = el
    this.data = data
    this.ruleResolve()
  }

  ruleResolve() {
    Object.keys(this.form.rules).forEach(field => {
      const rule = this.form.rules[field]

      let ruleTrans = {}
      switch (true) {
        case typeof rule === 'string':
          rule.split('|').forEach(r => {
            const frag = r.split(':')
            ruleTrans[frag[0]] = frag.length > 1 ? frag[1] : true
          })
          break

        case Array.isArray(rule):
          rule.forEach(r => {
            const frag = r.split(':')
            ruleTrans[frag[0]] = frag.length > 1 ? frag[1] : true
          })
          break

        default:
          ruleTrans = Object.assign({}, rule)
          break
      }

      Object.keys(ruleTrans).forEach(r => {
        if (typeof ruleTrans[r] === 'string') {
          ruleTrans[r] = ruleTrans[r].split(',').slice(0)
        }
      })

      this.form.rules[field] = ruleTrans
    })
  }
}
