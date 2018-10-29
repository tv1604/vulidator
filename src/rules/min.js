export default {
  validate(value, ruleValue) {
    return value.length > ruleValue
  },
  message(field) {
    return `this ${field} must more than xx`
  },
}
