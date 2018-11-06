/*!
  * vulidator v0.1.0
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.vulidator = {})));
}(this, (function (exports) { 'use strict';

  var VulidateError = {
    name: 'vulidate-error',
    props: {
      error: {
        type: Object,
        default: function _default() {
          return {};
        }
      }
    },
    render: function render(createEl) {
      if (this.error.message) {
        return createEl('div', {}, [createEl('div', this.error.message)]);
      }
    }
  };

  var VulShowErrorDirective = {
    componentUpdated: function componentUpdated(el, binding, vnode) {
      var vulidator = vnode.context.$vulidator;

      if (vulidator) {
        var scope = vulidator.getScope(el); // @todo: get from config

        var fieldName = el.name || binding.value;
        var errors = vulidator.errorBag.getErrors(scope, fieldName);

        if (errors.length) {
          el.classList.add('is-invalid');
        } else {
          el.classList.remove('is-invalid');
        }

        var wrapElm = el.parentNode.querySelector('.error-hint');

        if (!wrapElm) {
          wrapElm = document.createElement('div');
          wrapElm.className = 'error-hint text-danger w-100 text-left small';
          el.parentNode.insertBefore(wrapElm, el.nextSibling);
        }

        while (wrapElm.firstChild) {
          wrapElm.removeChild(wrapElm.firstChild);
        } // if (errors.length && binding.value) {
        //   errors.forEach(error => {
        //     const comp = new Vue({
        //       extends: VulidateError,
        //       propsData: {
        //         error,
        //       },
        //     })
        //     comp.$mount()
        //     wrapElm.appendChild(comp.$el)
        //   })
        // }

      }
    }
  };

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  // 
  var Error$1 = function Error(field, message, scope, rule) {
    _classCallCheck(this, Error);

    this.field = field;
    this.message = message;
    this.scope = scope;
    this.rule = rule;
  };

  var ErrorBag =
  /*#__PURE__*/
  function () {
    function ErrorBag() {
      _classCallCheck(this, ErrorBag);

      if (!this.errors) {
        this.errors = [];
      }
    }

    _createClass(ErrorBag, [{
      key: "getErrors",
      value: function getErrors(scope, field) {
        var errors = scope ? this.errors.filter(function (e) {
          return e.scope === scope;
        }) : this.errors;
        return field ? errors.filter(function (e) {
          return e.field === field;
        }) : errors;
      }
    }, {
      key: "getMessages",
      value: function getMessages(scope) {
        var errors = this.errors.slice(0);

        if (scope) {
          errors = errors.filter(function (e) {
            return e.scope === scope;
          });
        }

        return errors.map(function (e) {
          return e.message;
        });
      }
    }, {
      key: "clear",
      value: function clear(scope) {
        var errors = this.errors.slice(0);
        this.errors = scope ? errors.filter(function (e) {
          return e.scope !== scope;
        }) : [];
      }
    }, {
      key: "has",
      value: function has(field, scope) {
        var errors = this.errors.slice(0);

        if (scope) {
          errors = errors.filter(function (e) {
            return e.scope === scope;
          });
        }

        return errors.filter(function (e) {
          return e.field === field;
        }).length;
      }
    }, {
      key: "replace",
      value: function replace(scope, error) {
        var errorFiltered = this.errors.filter(function (e) {
          return e.scope !== scope;
        });
        this.clear();
        this.append(errorFiltered);
        this.append(error);
      }
    }, {
      key: "append",
      value: function append(error) {
        var errors = Array.isArray(error) ? error : [error];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = errors.slice(0)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var err = _step.value;
            this.errors.push(err);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }, {
      key: "count",
      value: function count() {
        return this.errors.length;
      }
    }, {
      key: "first",
      value: function first() {
        return this.errors.length ? this.errors[0] : null;
      }
    }, {
      key: "any",
      value: function any(scope) {
        return Boolean(this.getErrors(scope).length);
      }
    }]);

    return ErrorBag;
  }();

  // 
  var Scope =
  /*#__PURE__*/
  function () {
    function Scope(form, el, data) {
      _classCallCheck(this, Scope);

      this.form = form;
      this.el = el;
      this.data = data;
      this.ruleResolve();
    }

    _createClass(Scope, [{
      key: "ruleResolve",
      value: function ruleResolve() {
        var _this = this;

        Object.keys(this.form.rules).forEach(function (field) {
          var rule = _this.form.rules[field];
          var ruleTrans = {};

          switch (true) {
            case typeof rule === 'string':
              rule.split('|').forEach(function (r) {
                var frag = r.split(':');
                ruleTrans[frag[0]] = frag.length > 1 ? frag[1] : true;
              });
              break;

            case Array.isArray(rule):
              rule.forEach(function (r) {
                var frag = r.split(':');
                ruleTrans[frag[0]] = frag.length > 1 ? frag[1] : true;
              });
              break;

            default:
              ruleTrans = Object.assign({}, rule);
              break;
          }

          Object.keys(ruleTrans).forEach(function (r) {
            if (typeof ruleTrans[r] === 'string') {
              ruleTrans[r] = ruleTrans[r].split(',').slice(0);
            }
          });
          _this.form.rules[field] = ruleTrans;
        });
      }
    }]);

    return Scope;
  }();

  var $_rules = {};

  var Validator =
  /*#__PURE__*/
  function () {
    _createClass(Validator, null, [{
      key: "rules",
      value: function rules() {
        return $_rules;
      }
    }]);

    function Validator(vnode, form) {
      _classCallCheck(this, Validator);

      this.form = form;
      this.errorBag = new ErrorBag();
      this.vnode = vnode;
      this.scopes = {};
    }

    _createClass(Validator, [{
      key: "discoveryScope",
      value: function discoveryScope(elm) {
        var _this = this;

        var scopeElms = elm.querySelectorAll('[data-vulidate-model]');
        var itSelf = elm.dataset.vulidateModel;
        var isScopeFound = scopeElms.length || itSelf;

        if (isScopeFound && !Object.keys(this.scopes).length) {
          // loop forms definition
          Object.keys(this.form).forEach(function (name) {
            // discovery by query
            var form = _this.form[name];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = scopeElms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var scopeElement = _step.value;

                if (scopeElement.dataset.vulidateModel === name) {
                  _this.scopes[name] = new Scope(form, scopeElement, _this.vnode.$data[name]);
                }
              } // discovery itself

            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            if (itSelf === name) {
              _this.scopes[name] = new Scope(form, elm, _this.vnode.$data[name]);
            }
          });
        }
      }
      /**
       * @todo: nested component
       * Validate on HTMLElement
       * Validate on scope
       */

    }, {
      key: "validate",
      value: function validate(mix) {
        this.discoveryScope(this.vnode.$el);

        switch (true) {
          case mix.target !== undefined:
            this.currentScope = this.getScope(mix.target);
            return this.currentScope ? this.handler(this.scopes[this.currentScope]) : null;

          case typeof mix === 'string':
            this.currentScope = this.scopes.hasOwnProperty(mix) ? mix : null;
            return this.currentScope ? this.handler(this.scopes[this.currentScope]) : null;

          default:
            this.currentScope = null;
            return;
        }
      }
    }, {
      key: "getScope",
      value: function getScope(el) {
        var scope = el.dataset.vulidateModel;

        if (scope) {
          return scope;
        }

        if (el.tagName !== 'BODY') {
          return this.getScope(el.parentElement);
        }

        return null;
      }
    }, {
      key: "messageResolver",
      value: function messageResolver(form, field, defaultMessage) {
        return form.message && form.message.hasOwnProperty(field) ? form.message[field] : defaultMessage;
      }
    }, {
      key: "fieldNameResolver",
      value: function fieldNameResolver(form, field) {
        return form.nameDisplayed && form.nameDisplayed.hasOwnProperty(field) ? form.nameDisplayed[field] : field;
      }
    }, {
      key: "handler",
      value: function handler(scope) {
        var _this2 = this;

        if (!scope.data || !scope.form.rules) {
          throw Error$1('Hello world');
        }

        var form = scope.form;
        this.errorBag.clear(this.currentScope);
        Object.keys(form.rules).forEach(function (field) {
          var ruleByField = form.rules[field];
          Object.keys(ruleByField).forEach(function (r) {
            var rulesDefined = Validator.rules();

            if (rulesDefined.hasOwnProperty(r) && !rulesDefined[r].validate(scope.data[field], ruleByField[r], scope.data)) {
              var ruleMessage = rulesDefined[r].message(_this2.fieldNameResolver(form, field));

              var message = _this2.messageResolver(form, field, ruleMessage);

              _this2.errorBag.append(new Error$1(field, message, _this2.currentScope, r));
            }
          });
        });

        if (!this.fail(this.currentScope)) {
          this.vnode[this.form[this.currentScope].action]();
        }
      }
    }, {
      key: "fail",
      value: function fail(scope) {
        return this.errorBag.any(scope);
      }
    }, {
      key: "passed",
      value: function passed(scope) {
        return !this.fail(scope);
      }
    }], [{
      key: "rule",
      value: function rule(name, validator) {
        if (!validator.hasOwnProperty('validate') || !validator.hasOwnProperty('message')) {
          throw 'the validate and message is mandatory';
        }

        $_rules[name] = Object.assign({}, validator);
      }
    }, {
      key: "hasRule",
      value: function hasRule(name) {
        return $_rules.hasOwnProperty(name);
      }
    }, {
      key: "use",
      value: function use(vulRules) {
        Object.keys(vulRules).forEach(function (v) {
          Validator.rule(v, vulRules[v]);
        });
      }
    }]);

    return Validator;
  }();

  var VulidateSummary = {
    name: 'vulidate-summary',
    props: {
      errors: {
        type: Array,
        default: []
      }
    },
    render: function render(createEl) {
      if (this.errors.length) {
        return createEl('div', this.errors.map(function (error) {
          return createEl('div', error.message);
        }));
      }
    }
  };

  var mixin = {
    beforeCreate: function beforeCreate() {
      var _this = this;

      if (this.$options.$forms) {
        this.$vulidator = new Validator(this, this.$options.$forms); // mark errorBag as reactive.

        var Vue = this.$options._base;
        var errorBag = this.$vulidator.errorBag;
        Vue.util.defineReactive(errorBag, 'errors', errorBag.errors); // define errors computed

        var opts = this.$options;

        if (!opts.computed) {
          opts.computed = {};
        }

        opts.computed.errors = function () {
          return _this.$vulidator.errorBag.errors;
        };
      }
    },
    methods: {
      // proxy method to $vulidator.validate
      $validate: function $validate() {
        if (this.$vulidator) {
          var _this$$vulidator;

          return (_this$$vulidator = this.$vulidator).validate.apply(_this$$vulidator, arguments);
        } // @todo: throw error FormDefinition not found

      }
    }
  };

  var required = {
    // string: empty
    // array: empty
    // object: empty
    // null | undefined
    validate: function validate(value) {
      if (Array.isArray(value)) {
        return !!value.length;
      }

      if (value === undefined || value === null) {
        return false;
      }

      if (_typeof(value) === 'symbol') {
        return false;
      }

      return !!String(value).trim().length;
    },
    message: function message(field) {
      return "The ".concat(field, " field is required");
    }
  };

  var email = {
    validate: function validate(value) {
      return /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/.test(value);
    },
    message: function message(field) {
      return "The ".concat(field, " field must be email");
    }
  };

  var min = {
    validate: function validate(value, ruleValue) {
      return value.length > ruleValue;
    },
    message: function message(field) {
      return "this ".concat(field, " must more than xx");
    }
  };

  var rules = {
    required: required,
    email: email,
    min: min
  };

  Validator.use(rules);
  var index = {
    install: function install(Vue) {
      Vue.mixin(mixin);
      Vue.directive('vul-show-error', VulShowErrorDirective);
      Vue.component('vulidate-error', VulidateError);
      Vue.component('vulidate-summary', VulidateSummary);
    }
  };

  exports.Vulidator = Validator;
  exports.default = index;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
