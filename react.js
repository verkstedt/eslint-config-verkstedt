const withReact = require('./lib/withReact')

const babel = require('./babel')
const withPrettier = require('./lib/withPrettier')

module.exports = withPrettier(withReact(babel))
