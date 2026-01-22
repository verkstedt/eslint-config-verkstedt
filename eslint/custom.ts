import type {
  ConfigObject,
  Plugin,
  RuleConfig,
  RulesConfig,
} from '@eslint/core';

import { ALL_JS_FILES, CSS_FILES, MARKDOWN_FILES } from './file-globs.ts';

interface GetRulesOptions {
  typescriptPluginName: string | null;
}

function getCodeSmellsRules({
  typescriptPluginName,
}: GetRulesOptions): RulesConfig {
  const createMaybeTsRule = (ruleName: string, config: RuleConfig) =>
    typescriptPluginName
      ? {
          [ruleName]: 'off',
          [`${typescriptPluginName}/${ruleName}`]: config,
        }
      : {
          [ruleName]: config,
        };

  return {
    // TypeScript-specific rules
    ...(typescriptPluginName
      ? {
          // Include case for each possible value in switch statements
          [`${typescriptPluginName}/switch-exhaustiveness-check`]: 'error',
          // Allow using numbers in template expressions
          [`${typescriptPluginName}/restrict-template-expressions`]: [
            'error',
            {
              allowNumber: true,
            },
          ],
          // Allow empty interface if it extends something
          [`${typescriptPluginName}/no-empty-object-type`]: [
            'error',
            {
              allowInterfaces: 'with-single-extends',
            },
          ],
        }
      : {}),

    // Allow unused vars starting with “_”
    // Useful for using destructing to remove properties
    // from objects
    ...createMaybeTsRule('no-unused-vars', [
      'error',
      {
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ]),

    // Disallow shadowing variable names
    ...createMaybeTsRule('no-shadow', 'error'),

    // No console.* debug leftovers
    'no-console': 'error',

    // Enforce return in array methods like .map()
    'array-callback-return': 'error',

    // Disallow meaningless return in constructor
    'no-constructor-return': 'error',

    // Comparing things to self is probably a mistake
    'no-self-compare': 'error',

    // Loops that run only once is usually a misplaced break
    'no-unreachable-loop': 'error',

    // Disallow using variables before they are defined
    ...createMaybeTsRule('no-use-before-define', 'error'),

    // Split complex functions
    'complexity': ['error', { max: 10 }],

    // Enforce using strict comparison
    'eqeqeq': ['error', 'smart'],

    // Do not assign and return in single statement
    'no-return-assign': ['error', 'always'],

    // Assigning variables that are never used
    'no-useless-assignment': 'error',

    // Using template curly braces in regular strings
    'no-template-curly-in-string': 'error',

    // Rethrowing without preserving original error
    'preserve-caught-error': 'error',

    // Mutating function arguments means functions have side–effects
    'no-param-reassign': 'error',

    // Allow disabling eslint rules for the whole file
    'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
  };
}

function getPromisesRules(_options: GetRulesOptions): RulesConfig {
  return {
    // Require atomic updates to avoid race conditions
    'require-atomic-updates': 'error',

    // Returning in new Promise callback is usually a mistake, should
    // call resolve/reject instead
    'no-promise-executor-return': 'error',

    // Using await in loops, usually it should be refactored to use
    // Promise.all
    'no-await-in-loop': 'error',
  };
}

function getImportsRules(_options: GetRulesOptions): RulesConfig {
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
}: GetRulesOptions): RulesConfig {
  return {
    ...(!typescriptPluginName
      ? {}
      : {
          // Use Array<…> instead of …[]
          [`${typescriptPluginName}/array-type`]: [
            'error',
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

/**
 * Rules that are generally great idea to have, but we are being
 * practical, so we don’t enforce them strictly
 *
 * Ideally we’d upgrade these to 'error' over time
 */
function getPracticalRules({
  typescriptPluginName,
}: GetRulesOptions): RulesConfig {
  return {
    ...(!typescriptPluginName
      ? {}
      : {
          // Allow usage of `any` type, but warn about it
          [`${typescriptPluginName}/no-explicit-any`]: 'warn',
          // Allow unsafe TypeScript operations, but warn about it
          [`${typescriptPluginName}/no-unsafe-argument`]: 'warn',
          [`${typescriptPluginName}/no-unsafe-assignment`]: 'warn',
          [`${typescriptPluginName}/no-unsafe-call`]: 'warn',
          [`${typescriptPluginName}/no-unsafe-member-access`]: 'warn',
          [`${typescriptPluginName}/no-unsafe-return`]: 'warn',
        }),
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
}: GetVerkstedtConfigOptions): Array<ConfigObject> {
  const typescriptPluginName =
    typescriptEsLintPlugin?.meta?.name?.split('/').at(0) ?? null;

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
        ...getCodeSmellsRules({ typescriptPluginName }),
        ...getPromisesRules({ typescriptPluginName }),
        ...getImportsRules({ typescriptPluginName }),
        ...getStylisticRules({ typescriptPluginName }),
        ...getPracticalRules({ typescriptPluginName }),
      },
    },
    {
      name: 'Be less restrictive in non–application code',
      files: [
        // Config files
        '.storybook/**',
        '*.config.*',
        '.rc*',
        // CLI scripts
        'scripts/**',
        // Test files
        `*.test.*`,
        '**/__tests__/**',
      ],
      rules: {
        'complexity': ['error', { max: 20 }],
        'no-console': 'off',
        'no-await-in-loop': 'off',
      },
    },
    {
      files: CSS_FILES,
      rules: {
        'css/no-invalid-properties': [
          'error',
          {
            // By default this is false, which means it will error out on
            // variables that are not defined in the same file, but vars
            // are often defined globally, in separate CSS file
            allowUnknownVariables: true,
          },
        ],
        // Do not restrict only to CSS features in the baseline.
        // Authors are free to use use never CSS features as long as
        // they do it in a progressive-enhancement way
        'css/use-baseline': 'off',
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
