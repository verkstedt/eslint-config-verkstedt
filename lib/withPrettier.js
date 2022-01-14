module.exports = base => ({
  ...base,
  extends: [...base.extends, 'prettier'],
  plugins: [...base.plugins, 'prettier'],
  rules: {
    ...base.rules,
    'prettier/prettier': 'error'
  }
})
