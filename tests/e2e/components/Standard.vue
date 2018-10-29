<template>
<div id='test'>
  <form
    id='loginForm'
    data-vulidate-model='loginForm'
    @submit.prevent='$validate'
  >
    <input
      v-vul-show-error='true'
      name='username'
      v-model='loginForm.username'
      type='text'
    />

    <input
      v-vul-show-error='true'
      name='password'
      v-model='loginForm.password'
      type='text'
    />
  </form>

  <form
    id='subscribeForm'
    data-vulidate-model='subscribeForm'
  >
    <input
      v-vul-show-error='true'
      type='text'
      name='email'
      v-model='subscribeForm.email'
    />

    <input
      id='submit-b'
      type='submit'
      @click='$validate'
    />
  </form>
</div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      subscribeForm: {
        email: '',
      },
    }
  },
  $forms: {
    loginForm: {
      action: 'loginHandler',
      rules: {
        email: 'required',
        password: 'required|min:3',
      },
      messages() {
        return {
          email: `The field email is mandatory`,
          password: `The field password is mandatory`,
        }
      },
    },
    subscribeForm: {
      action: 'subscribeHandler',
      rules: {
        email: 'required|email',
      },
    }
  },
  methods: {
    loginHandler() {
      // handle form
    },
    subscribeHandler() {
      // handle form
    },
  },
}
</script>
