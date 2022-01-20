const withTypescript = require('./lib/withTypescript')

const vanilla = require('./vanilla')

const config = withTypescript(vanilla)

module.exports = config
