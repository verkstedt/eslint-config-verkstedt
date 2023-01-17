const base = require('./base')
const withReact = require('./lib/withReact')
const withPrettier = require('./lib/withPrettier')
const withBabel = require('./lib/withBabel')

module.exports = withPrettier(withReact(withBabel(base)))
