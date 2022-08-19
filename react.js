const babel = require('./babel')

const withReact = require('./lib/withReact')
const withPrettier = require('./lib/withPrettier')

module.exports = withPrettier(withReact(babel))
