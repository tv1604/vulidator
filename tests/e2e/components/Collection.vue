<template>
<div id='test'>
  <form data-vulidate-model='reportForm' @submit.prevent='$validate'>
    <div class='group' v-for='task in reportForm.tasks'>
      <input
        v-vul-show-error='true'
        name='task.*.title'
        v-model='task.title'
        type='text'
      />

      <input
        v-vul-show-error='true'
        name='task.*.hours'
        v-model='task.hours'
        type='text'
      />
    </div>
  </form>
</div>
</template>

<script>
export default {
  data() {
    return {
      reportForm: {
        tasks: [
          {
            title: '',
            hours: '',
          },
          {
            title: '',
            hours: '',
          },
        ],
      },
    }
  },
  $forms: {
    reportForm: {
      action: 'handler',
      rules: {
        ['tasks.*.title']: 'required',
        ['tasks.*.hours']: 'required|min:3',
      },
      messages() {
        return {
          ['tasks.*.title']: `The title is mandatory`,
          ['tasks.*.hours]']: `The hours is mandatory`,
        }
      },
    },
  },
  methods: {
    handler() {
      // handle form
    },
  },
}
</script>
