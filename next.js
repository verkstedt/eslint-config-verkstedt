const base = require('./base')
const withNext = require('./lib/withNext')
const withPrettier = require('./lib/withPrettier')
const withReact = require('./lib/withReact')

module.exports = withPrettier(withNext(withReact(base)))
