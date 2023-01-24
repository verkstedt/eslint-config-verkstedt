const base = require('./base')
const withPrettier = require('./lib/withPrettier')
const withReact = require('./lib/withReact')
const withTypescript = require('./lib/withTypescript')

module.exports = withPrettier(withTypescript(withReact(base)))
