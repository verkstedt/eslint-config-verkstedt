const withPrettier = require('./lib/withPrettier')
const withTypescript = require('./lib/withTypescript')

const base = require('./base')

module.exports = withPrettier(withTypescript(base))
