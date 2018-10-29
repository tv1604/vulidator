export default {
  name: 'vulidate-error',
  props: {
    error: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  render(createEl) {
    if (this.error.message) {
      return createEl(
        'div',
        {},
        [
          createEl('div', this.error.message)
        ],
      )
    }
  },
}
