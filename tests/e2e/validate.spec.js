import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vulidation from '@/index'
import TestComponent from './components/Standard'

const localVue = createLocalVue()
localVue.use(Vulidation)

describe('validate form', () => {
  it('should receive errors when trigger $validate(scope) by invalid data', () => {
    const wrapper = shallowMount(TestComponent, { localVue })
    wrapper.vm.$validate('loginForm')

    expect(wrapper.vm.errors.length).toBe(3)
  })

  it('should ignore errors when trigger $validate(scope) by valid data', () => {
    const wrapper = shallowMount(TestComponent, { localVue })
    wrapper.setData({
      loginForm: {
        email: 'hello@gmail.com',
        password: 'helloword',
      },
    })
    wrapper.vm.$validate('loginForm')

    expect(wrapper.vm.errors.length).toBe(0)
  })

  it('should receive null, when scope not found on $validate(scope)', () => {
    const wrapper = shallowMount(TestComponent, { localVue })

    expect(wrapper.vm.$validate('wrongForm')).toBe(null)
  })

  it('should discovery scope, when trigger validate on HTMLElement', () => {
    const wrapper = shallowMount(TestComponent, { localVue })
    wrapper.find('#submit-b').trigger('click')

    expect(wrapper.vm.$vulidator.currentScope).toBe('subscribeForm')
  })

  it('should receive errors, when trigger validate on HTMLElement', () => {
    const wrapper = shallowMount(TestComponent, { localVue })
    wrapper.find('#submit-b').trigger('click')

    expect(wrapper.vm.errors.length).toBe(1)
  })
})
