export default {
  name: 'vulidate-summary',
  props: {
    errors: {
      type: Array,
      default: [],
    },
  },
  render(createEl) {
    if (this.errors.length) {
      return createEl(
        'div',
        this.errors.map(error => createEl('div', error.message))
      )
    }
  },
}
