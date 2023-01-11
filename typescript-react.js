const withPrettier = require('./lib/withPrettier')
const withTypescript = require('./lib/withTypescript')
const react = require('./react')

module.exports = withPrettier(withTypescript(react))
