const base = require('./base')
const withPrettier = require('./lib/withPrettier')
const withNext = require('./lib/withNext')
const withReact = require('./lib/withReact')
const withTypescript = require('./lib/withTypescript')

module.exports = withPrettier(withNext(withTypescript(withReact(base))))
