const base = require('./base')
const withBabel = require('./lib/withBabel')
const withPrettier = require('./lib/withPrettier')
const withReact = require('./lib/withReact')

module.exports = withPrettier(withReact(withBabel(base)))
