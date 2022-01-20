const withBabel = require('./lib/withBabel')

const vanilla = require('./vanilla')

const config = withBabel(vanilla)

module.exports = config
