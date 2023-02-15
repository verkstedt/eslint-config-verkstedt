module.exports = (base) => ({
  ...base,
  extends: ['plugin:@next/next/core-web-vitals', ...base.extends],
  ignorePatterns: [...base.ignorePatterns, '.next'],
  overrides: [
    ...base.overrides,
    // Next.js pages
    {
      files: ['pages/**.tsx'],
      rules: {
        // These are TSX files, but they export NextPage not React components
        'react/function-component-definition': 'off',
      },
    },
  ],
})
