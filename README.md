# Vulidate (draft)

### Feature Plan

- High test coverage
- Customize error show up
- How to parsee errors from API

### TODO

- CI
- Testing
- RuleDefinition: base on laravel
- Component: vulidate-errors
- Component: vulidate-summary
- Directive: data-show-error
- Directive: data-vulidate-position
- Declare flow type hint

## Install

```js
import Vulidation from 'vulidation'
Vue.use(Vulidation)
```

## Usage

### Use as model

```pug
<template lang='pug'>
form(data-vulidate-scope='loginForm')
    input(name='username', v-model='loginForm.username')
    input(name='password', v-model='loginForm.password')
</template>

<script>
export default {
    data() {
        return {
            loginForm: {
                username: null,
                password: null,
            }
        }
    },
    $forms: {
        loginForm: {
            action: 'login',
            rules: {
                username: 'required|min:3|max:100',
                password: 'required|min:6|regex:...',
            },
            messages() {
                username: 'The username field is mandatory',
                password: 'The password field is mandatory',
            },
        },
    },
    methods: {
        login() {
            // handle after validated
        },
    },
}
</script>
```

### Manual manipulate data for model

```pug
<template lang='pug'>
form(data-vulidate-scope='subscribeForm')
    custom-component(name='email', v-model='email')
</template>

<script>
export default {
    data() {
        return {
            email: null
        }
    }
    $forms: {
        subscribeForm: {
            action: 'subscribe',
            rules: {
                email: 'required|email',
            },
        },
    },
    methods: {
        $formDataProvider() {
            return {
                subscribeForm: {
                    email: this.email,
                },
            },
        },
        subscribe() {
            // handle after validated
        },
    },
}
</script>
```

### Handle directly
```pug
<template lang='pug'>
form(data-vulidate-scope='subscribeForm')
    custom-component(
        name='email'
        v-model='email'
    )
</template>

<script>
export default {
    data() {
        return {
            email: null
        }
    }
    $forms: {
        subscribeForm: {
            action: 'subscribe',
            rules: {
                email: value => Boolean(value),
            },
            data: vnode => {
                email: vnode.$data.email
            },
        },
    },
    methods: {
        subscribe() {
            // handle after validated
        }
    },
}
</script>
```
### Inline validation

```pug
<template lang='pug'>
form(data-vulidate-scope='subscribeForm', @submit.prevent='subscribe')
    custom-component(
        name='email'
        v-model='email'
        v-vul-rule='"required|email"'
        v-vul-event='"change"'
    )
</template>

<script>
export default {
    data() {
        return {
            email: null
        }
    }
    methods: {
        subscribe() {
            if (this.$vulidation.passed()) {
                // handle after validated
            }
        }
    },
}
</script>
```

```
div(data-vulidation-model='loginForm')

```



## Rule definition

```
Validator.rule('name', handle()
```

## Error Handler

### Show error auto

`Status: DONE`

```pug
input(
    name='username'
    v-vul-show-errors='true'
)
```

### change position
```pug
input(
    name='username'
    v-vul-show-errors='{ position: "after" }'
)
```

### pass props
```pug
input(
    name='username'
    v-vul-show-errors='{props: { class: "error__username" }}'
)
```

### change error component

```javascript
import CustomErrors from '@/components/CustomError'
Vulidate.Config({
    components: {
        VulidateError: CustomError
    }
})
```

### manual show error

```pug
form(data-validate-scope='loginForm')
    input(name='username', v-model='loginForm.username')
    vulidator-error(
        v-for='error in $vulidator.errorBag.getErrors("loginForm", "username")'
    )

```
### errors catched from api

```javascript
apiCall()
    .then(response => {
        const errors = this.$vulidator.manipulate('loginForm', (error) => {
            field: error.field,
            message: error.message,
        })
        this.$vulidator.replace(errors)
    }
)
```
## Validation Rule

### Define a rule

```javascript
export default {
    validate(value) {

    }
    message(field) {

    }
}
```

### Extend Rules

```javascript
import Vulidator from 'vulidator'

Vulidator::rule('required', RuleDefinition)
```
## Inline Validation

### inline rule

```
input(
    name='email'
    v-vul-rule='required|email'
)
```

### change the event

```
input(
    name='email'
    v-vul-rule='required|email'
    data-vul-event='input'
)
```


## Form Validation

```javascript
export default {
rules: {},
message: {},
label: {},
submit: (vnode) => {}

}
```

## Lang i18n

