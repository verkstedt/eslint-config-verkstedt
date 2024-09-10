const base = require('./base')
const withPrettier = require('./lib/withPrettier')
const withTypescript = require('./lib/withTypescript')

module.exports = withPrettier(withTypescript(base))
