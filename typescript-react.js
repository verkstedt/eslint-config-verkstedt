const react = require('./react')

const withTypescript = require('./lib/withTypescript')
const withPrettier = require('./lib/withPrettier')

module.exports = withPrettier(withTypescript(react))
