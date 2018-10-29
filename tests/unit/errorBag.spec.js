import ErrorBag from '@/errorBag'
import Error from '@/error'

describe('Error Bag', () => {
  let eBag = new ErrorBag()

  // setup

  beforeEach(() => {
    const e1 = new Error('email', 'The email is required', 'login-form')
    const e2 = new Error('password', 'The password is required', 'login-form')

    eBag.append([e1, e2])
  })

  afterEach(() => {
    eBag.clear()
  })

  // test cases

  it('append()', () => {
    const eBag1 = new ErrorBag()

    const e = new Error('email', 'The email is required', 'login-form')

    eBag1.append(e)
    expect(eBag1.count()).toBe(1)
    expect(eBag.count()).toBe(2)
  })

  it('getErrors()', () => {
    expect(eBag.getErrors().length).toBe(2)
  })

  it('getErrors(scope)', () => {
    eBag.append(new Error('password', 'The password is required', 'signup'))
    const errors = eBag.getErrors('signup')

    expect(errors.length).toBe(1)
    expect(errors[0].scope).toBe('signup')
  })

  it('getErrors(scope, field)', () => {
    const errors = eBag.getErrors('login-form', 'password')

    expect(errors[0].field).toBe('password')
    expect(errors.length).toBe(1)
  })

  it('any()', () => {
    expect(eBag.any()).toBeTruthy()
  })

  it('clear(scope)', () => {
    eBag.clear('login-form')
    expect(eBag.errors.length).toBe(0)
  })

  it('any(scope)', () => {
    expect(eBag.any('login-form')).toBeTruthy()
  })

  it('first()', () => {
    expect(eBag.first()).toBe(eBag.errors[0])
  })

  it('getMessage()', () => {
    const messages = eBag.getMessages()
    expect(messages.length).toBe(2)
    expect(messages[0]).toBe('The email is required')
  })

  it('getMessage(scope)', () => {
    eBag.append(new Error('password', 'The password is required', 'signup'))
    const messages = eBag.getMessages('signup')

    expect(messages.length).toBe(1)
    expect(messages[0]).toBe('The password is required')
  })

  it('has(field, scope)', () => {
    expect(eBag.has('email', 'login-form')).toBeTruthy()
  })

  it('has(field)', () => {
    expect(eBag.has('email')).toBeTruthy()
  })

  it('has(scope, field)', () => {
    eBag.append(new Error('password', 'The password is required', 'signup'))
    expect(eBag.has('password', 'signup')).toBeTruthy()
    expect(eBag.has('password', 'login')).toBeFalsy()
  })

  it('replace(scope, errors)', () => {
    const eBag = new ErrorBag()

    const e0 = new Error('email', 'The email is required', 'login')
    const e1 = new Error('email', 'The email is required', 'signup')
    const e2 = new Error('password', 'The password is required', 'signup')
    const e3 = new Error('first_name', 'The first_name is required', 'signup')
    const e4 = new Error('last_name', 'The last_name is required', 'signup')
    eBag.append([e0, e1, e2])
    eBag.replace('signup', [e3, e4])

    expect(eBag.count()).toBe(3)
    expect(eBag.getErrors('signup').length).toBe(2)
    expect(eBag.getErrors('signup')[0].field).toBe('first_name')
  })
})
