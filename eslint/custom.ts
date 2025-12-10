import { Linter } from 'eslint';

type Plugin = Exclude<Linter.Config['plugins'], undefined>[string];

interface GetVerkstedtConfigOptions {
  typescriptEsLintPlugin?: Plugin;
}

/**
 * Verkstedt–specific EsLint config overwriting recommended rules
 */
function getVerkstedtConfig({
  typescriptEsLintPlugin,
}: GetVerkstedtConfigOptions): Array<Linter.Config> {
  return [
    {
      linterOptions: {
        reportUnusedDisableDirectives: 'error',
      },
      plugins: {
        ...(typescriptEsLintPlugin
          ? { '@typescript-eslint': typescriptEsLintPlugin, 'foo': {} }
          : {}),
      },
      rules: {
        // Disallow ${} in non–template strings
        'no-template-curly-in-string': 'error',

        // Disallow shadowing variable names
        'no-shadow': 'error',

        // No console.* debug leftovers
        'no-console': 'error',

        // Always use `node:…` for Node.js built-ins
        'import/enforce-node-protocol-usage': ['error', 'always'],

        // Sort imports
        'import/order': [
          'error',
          {
            'alphabetize': { order: 'asc', caseInsensitive: true },
            'newlines-between': 'always',
            'named': {
              enabled: true,
              types: 'types-last',
            },
          },
        ],

        // Allow unused vars starting with “_”
        // Useful for using destructing to remove properties
        // from objects
        [typescriptEsLintPlugin
          ? '@typescript-eslint/no-unused-vars'
          : 'no-unused-vars']: [
          'error',
          {
            argsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            varsIgnorePattern: '^_',
          },
        ],

        // Disable the other no-unused-vars rule
        [typescriptEsLintPlugin
          ? 'no-unused-vars'
          : '@typescript-eslint/no-unused-vars']: 'off',

        // Use Array<…> instead of …[]
        '@typescript-eslint/array-type': [
          typescriptEsLintPlugin ? 'error' : 'off',
          { default: 'generic' },
        ],
      },
    },
  ];
}

export default getVerkstedtConfig;
