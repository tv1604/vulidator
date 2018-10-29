import Vulidator from './vulidator'

export default {
  beforeCreate() {
    if (this.$options.$forms) {
      this.$vulidator = new Vulidator(this, this.$options.$forms)

      // mark errorBag as reactive.
      const Vue = this.$options._base
      const errorBag = this.$vulidator.errorBag
      Vue.util.defineReactive(errorBag, 'errors', errorBag.errors)

      // define errors computed
      const opts = this.$options

      if (!opts.computed) {
        opts.computed = {}
      }

      opts.computed.errors = () => this.$vulidator.errorBag.errors
    }
  },
  methods: {
    // proxy method to $vulidator.validate
    $validate(...args) {
      if (this.$vulidator) {
        return this.$vulidator.validate(...args)
      }

      // @todo: throw error FormDefinition not found
    },
  },
}
