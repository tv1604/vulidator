import Vue from 'vue'
import VulidateError from '../components/vulidate-error'

export default {
  componentUpdated(el, binding, vnode) {
    const vulidator = vnode.context.$vulidator
    if (vulidator) {
      const scope = vulidator.getScope(el)
      // @todo: get from config
      const fieldName = el.name || binding.value
      const errors = vulidator.errorBag.getErrors(scope, fieldName)

      if (errors.length) {
        el.classList.add('is-invalid')
      } else {
        el.classList.remove('is-invalid')
      }

      let wrapElm = el.parentNode.querySelector('.error-hint')

      if (!wrapElm) {
        wrapElm = document.createElement('div')
        wrapElm.className = 'error-hint text-danger w-100 text-left small'
        el.parentNode.insertBefore(wrapElm, el.nextSibling)
      }

      while (wrapElm.firstChild) {
        wrapElm.removeChild(wrapElm.firstChild)
      }

      if (errors.length && binding.value) {
        errors.forEach(error => {
          const comp = new Vue({
            extends: VulidateError,
            propsData: {
              error,
            },
          })
          comp.$mount()
          wrapElm.appendChild(comp.$el)
        })
      }
    }
  },
}
