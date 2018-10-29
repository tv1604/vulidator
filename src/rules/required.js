export default {
  // string: empty
  // array: empty
  // object: empty
  // null | undefined
  validate(value) {
    if (Array.isArray(value)) {
      return !!value.length
    }

    if (value === undefined || value === null) {
      return false
    }

    if (typeof value === 'symbol') {
      return false
    }

    return !!String(value).trim().length;
  },
  message(field) {
    return `The ${field} field is required`
  },
}
