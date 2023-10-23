const fs = require('node:fs')

const packageJson = require('./package.json')

const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }

function collectMismatchedDeps(depsToCheck) {
  return Array.from(Object.entries(depsToCheck)).reduce(
    (carry, [name, version]) => {
      if (deps[name] !== version) {
        return [...carry, name]
      }
      return carry
    },
    []
  )
}

function validatePeerDeps() {
  const peerDeps = packageJson.peerDependencies
  const mismatchedPeerDeps = collectMismatchedDeps(peerDeps)
  if (mismatchedPeerDeps.length) {
    process.stderr.write(
      `Some peer dependencies have different version than entry in dependencies or devDependencies: ${mismatchedPeerDeps.join(
        ', '
      )}\n`
    )
    process.exit(1)
  } else {
    process.stdout.write('Peer dependencies look good.\n')
  }
}

function validateReadme() {
  const readme = fs.readFileSync('./README.md', 'utf8')
  const readmeDeps = Object.fromEntries(
    readme
      .split('\n')
      .filter((line) => line.match(/^\s*npm install /))
      .map((line) => line.replace(/^\s*npm install (-[-a-z0-9=]+ )*/, ''))
      .join(' ')
      .split(' ')
      .map((dep) => dep.replace(/^"|"$/g, '').split(/(?!^)@/, 2))
  )
  const mismatchedPeerDeps = collectMismatchedDeps(readmeDeps)
  if (mismatchedPeerDeps.length) {
    process.stderr.write(
      `Some dependencies used in README have different version than entry in dependencies or devDependencies: ${mismatchedPeerDeps.join(
        ', '
      )}\n`
    )
    process.exit(1)
  } else {
    process.stdout.write('Dependencies used in README look good.\n')
  }
}

validatePeerDeps()
validateReadme()
