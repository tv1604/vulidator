import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vulidation from '@/index'
import TestComponent from './components/Collection'

const localVue = createLocalVue()
localVue.use(Vulidation)

describe('validate form', () => {
  it('should receive errors when trigger $validate(scope) by invalid data', () => {
    const wrapper = shallowMount(TestComponent, { localVue })
    wrapper.vm.$validate('reportForm')

    expect(wrapper.vm.errors.length).toBe(4)
  })
})
