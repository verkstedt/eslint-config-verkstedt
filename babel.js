const vanilla = require('./vanilla')

const withBabel = require('./lib/withBabel')
const withPrettier = require('./lib/withPrettier')

module.exports = withPrettier(withBabel(vanilla))
