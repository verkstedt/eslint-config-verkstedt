const base = require('./base')
const withNext = require('./lib/withNext')
const withPrettier = require('./lib/withPrettier')
const withReact = require('./lib/withReact')
const withTypescript = require('./lib/withTypescript')

module.exports = withPrettier(withNext(withTypescript(withReact(base))))
