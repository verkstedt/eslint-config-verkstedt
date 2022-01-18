// FIXME Does it make sense to do that in base config, just as a
//       override for TS files?
module.exports = (base) => ({
  ...base,
  parser: '@typescript-eslint/parser',
  plugins: [...base.plugins, '@typescript-eslint'],
  rules: {
    ...base.rules,

    // @typescript-eslint rules counterparts
    ...['no-shadow', 'no-unused-vars'].reduce(
      (rules, name) => ({
        ...rules,
        [name]: 'off',
        [`@typescript-eslint/${name}`]: base.rules[name]
      }),
      {}
    )
  }
})
