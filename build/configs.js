const path = require('path')
const babel = require('rollup-plugin-babel')
const flow = require('rollup-plugin-flow-no-whitespace')
const cjs = require('rollup-plugin-commonjs')
const node = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')
const version = process.env.VERSION || require('../package.json').version
const banner =
`/*!
  * vulidator v${version}
  */`

const resolve = _path => path.resolve(__dirname, '../', _path)

module.exports = [
  {
    file: resolve('dist/vulidator.js'),
    format: 'umd',
    env: 'development'
  },
  {
    file: resolve('dist/vulidator.min.js'),
    format: 'umd',
    env: 'production'
  },
  {
    file: resolve('dist/vulidator.common.js'),
    format: 'cjs'
  },
  {
    file: resolve('dist/vulidator.esm.js'),
    format: 'es'
  }
].map(genConfig)

function genConfig (opts) {
  const config = {
    input: {
      input: resolve('src/index.js'),
      plugins: [
        flow(),
        node(),
        cjs(),
        replace({
          __VERSION__: version
        }),
        babel(),
      ]
    },
    output: {
      file: opts.file,
      format: opts.format,
      banner,
      name: 'vulidator',
      exports: 'named',
    }
  }

  if (opts.env) {
    config.input.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }

  return config
}
