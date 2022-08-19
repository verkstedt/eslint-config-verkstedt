const vanilla = require('./vanilla')

const withTypescript = require('./lib/withTypescript')
const withPrettier = require('./lib/withPrettier')

module.exports = withPrettier(withTypescript(vanilla))
