import VulShowErrorDirective from './directives/show-error'
import Vulidator from './vulidator'
import VulidateError from './components/vulidate-error'
import VulidateSummary from './components/vulidate-summary'
import mixin from './mixin'
import rules from './rules'

Vulidator.use(rules)

export {
  Vulidator,
}

export default {
  install: Vue => {
    Vue.mixin(mixin)
    Vue.directive('vul-show-error', VulShowErrorDirective)
    Vue.component('vulidate-error', VulidateError)
    Vue.component('vulidate-summary', VulidateSummary)
  },
}
