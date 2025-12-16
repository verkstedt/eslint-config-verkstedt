import type { Linter } from 'eslint';

import { ALL_JS_FILES, MARKDOWN_FILES } from './file-globs.ts';

type Plugin = Exclude<Linter.Config['plugins'], undefined>[string];

interface GetRulesOptions {
  typescriptPluginName: string | null;
}

function getCodeSmallsRules({
  typescriptPluginName,
}: GetRulesOptions): Linter.RulesRecord {
  return {
    ...(typescriptPluginName
      ? {
          // Include case for each possible value in switch statements
          [`${typescriptPluginName}/switch-exhaustiveness-check`]: 'error',
        }
      : {}),

    // Allow unused vars starting with “_”
    // Useful for using destructing to remove properties
    // from objects
    [typescriptPluginName
      ? `${typescriptPluginName}/no-unused-vars`
      : 'no-unused-vars']: [
      'error',
      {
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    ...(typescriptPluginName ? { 'no-unused-vars': 'off' } : {}),

    // Disallow shadowing variable names
    [typescriptPluginName ? `${typescriptPluginName}/no-shadow` : 'no-shadow']:
      'error',
    ...(typescriptPluginName ? { 'no-shadow': 'off' } : {}),

    // No console.* debug leftovers
    'no-console': 'error',

    // Enforce return in array methods like .map()
    'array-callback-return': 'error',

    // Disallow meaningless return in constructor
    'no-constructor-return': 'error',

    // Comparing things to self is probably a mistake
    'no-self-compare': 'error',

    // Warn about using template curly braces in regular strings
    'no-template-curly-in-string': 'warn',

    // Loops that run only once is usually a misplaced break
    'no-unreachable-loop': 'error',

    // Disallow using variables before they are defined
    'no-use-before-define': 'error',

    // Warn about assigning variables that are never used
    'no-useless-assignment': 'warn',

    // Split complex functions
    'complexity': ['error', { max: 10 }],

    // Enforce using strict comparison
    'eqeqeq': ['error', 'smart'],

    // Do not assign and return in single statement
    'no-return-assign': ['error', 'always'],

    // Warn about rethrowing without preserving original error
    'preserve-caught-error': 'warn',
  };
}

function getPromisesRules(_options: GetRulesOptions): Linter.RulesRecord {
  return {
    // Require atomic updates to avoid race conditions
    'require-atomic-updates': 'error',

    // Using await in loops, usually it should be refactored to use
    // Promise.all
    'no-await-in-loop': 'warn',

    // Returning in new Promise callback is usually a mistake, should
    // call resolve/reject instead
    'no-promise-executor-return': 'error',
  };
}

function getImportsRules(_options: GetRulesOptions): Linter.RulesRecord {
  return {
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
  };
}

function getStylisticRules({
  typescriptPluginName,
}: GetRulesOptions): Linter.RulesRecord {
  return {
    ...(!typescriptPluginName
      ? {}
      : {
          // Use Array<…> instead of …[]
          [`${typescriptPluginName}/array-type`]: [
            typescriptPluginName ? 'error' : 'off',
            { default: 'generic' },
          ],

          // Allow @ts-… comments, only with description
          [`${typescriptPluginName}/ban-ts-comment`]: [
            'error',
            {
              'ts-expect-error': {
                descriptionFormat: '^ -- TS\\d+',
              },
              'ts-ignore': true,
              'ts-nocheck': true,
              'ts-check': true,
            },
          ],

          // Import types as types
          [`${typescriptPluginName}/consistent-type-imports`]: 'error',

          // Export types as types
          [`${typescriptPluginName}/consistent-type-exports`]: 'error',
        }),

    // Require descriptions to eslint comments
    'eslint-comments/require-description': [
      'error',
      { ignore: ['eslint-env', 'eslint-enable'] },
    ],

    // Use const when variable is not mutated
    'prefer-const': 'error',

    // Use template literals instead of string concatenation
    'prefer-template': 'error',
  };
}

interface GetVerkstedtConfigOptions {
  typescriptEsLintPlugin?: Plugin;
  eslintCommentsPlugin: Plugin;
}

/**
 * Verkstedt–specific EsLint config overwriting recommended rules
 */
function getVerkstedtConfig({
  typescriptEsLintPlugin,
  eslintCommentsPlugin,
}: GetVerkstedtConfigOptions): Array<Linter.Config> {
  const typescriptPluginName = typescriptEsLintPlugin
    ? '@typescript-eslint'
    : null;

  return [
    {
      files: ALL_JS_FILES,
      linterOptions: {
        reportUnusedDisableDirectives: 'error',
      },
      plugins: {
        ...(typescriptPluginName
          ? { [typescriptPluginName]: typescriptEsLintPlugin }
          : {}),
        'eslint-comments': eslintCommentsPlugin,
      },
      rules: {
        ...getCodeSmallsRules({ typescriptPluginName }),
        ...getPromisesRules({ typescriptPluginName }),
        ...getImportsRules({ typescriptPluginName }),
        ...getStylisticRules({ typescriptPluginName }),
      },
    },
    {
      files: MARKDOWN_FILES,
      rules: {
        // Parser does not recognise alerts in GitHub-Flavoured Markdown:
        // https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts
        // Remove this once https://github.com/eslint/markdown/issues/294 is resolved
        'markdown/no-missing-label-refs': [
          'error',
          {
            allowLabels: [
              '!NOTE',
              '!TIP',
              '!IMPORTANT',
              '!WARNING',
              '!CAUTION',
            ],
          },
        ],
      },
    },
  ];
}

export default getVerkstedtConfig;
