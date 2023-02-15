const base = require('./base')
const withPrettier = require('./lib/withPrettier')
const withNext = require('./lib/withNext')
const withReact = require('./lib/withReact')

module.exports = withPrettier(withNext(withReact(base)))
