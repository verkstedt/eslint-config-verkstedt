import { debuglog, inspect } from 'node:util';
import fs from 'node:fs/promises';
import globals from 'globals';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import css from '@eslint/css';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import packageJson from '../package.json' with { type: 'json' };

import type { Linter } from 'eslint';
import { globalIgnores } from 'eslint/config';
import { resolve } from 'node:path';
import { WriteStream } from 'node:tty';

const VANILLA_JS_EXTS = ['js', 'mjs', 'cjs'];
const TS_EXTS = ['ts', 'tsx'];
const TS_FILES = [`**/*.{${TS_EXTS.join(',')}}`];
const REACT_EXTS = ['jsx', 'tsx'];
const ALL_JS_FILES_EXTS = [...VANILLA_JS_EXTS, ...TS_EXTS, ...REACT_EXTS];
const ALL_JS_FILES = [`**/*.{${ALL_JS_FILES_EXTS.join(',')}}`];
const CSS_EXTS = ['css', 'scss'];
const CSS_FILES = [`**/*.{${CSS_EXTS.join(',')}}`];
const JSON_EXTS = ['json', 'jsonc'];
const JSON_FILES = [`**/*.{${JSON_EXTS.join(',')}}`];
const MARKDOWN_EXTS = ['md', 'markdown'];
const MARKDOWN_FILES = [`**/*.{${MARKDOWN_EXTS.join(',')}}`];
const ALL_FILES_EXTS = [
  ...ALL_JS_FILES_EXTS,
  ...CSS_EXTS,
  ...JSON_EXTS,
  ...MARKDOWN_EXTS,
];
const ALL_FILES = [`**/*.{${ALL_FILES_EXTS.join(',')}}`];

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

type PromiseOrValue<Type> = Type | Promise<Type>;

interface ModuleConfig {
  /** Name for humans only */
  name: string;
  /** Return EsLint config entry, or null to skip */
  get: (
    this: ModuleConfig,
  ) => PromiseOrValue<null | Linter.Config | Array<Linter.Config>>;
}

function getColours(stream: WriteStream) {
  if (stream.isTTY) {
    return {
      supported: true,
      reset: '\x1B[0m',
      dim: '\x1B[2m',
      error: '\x1B[31m',
    };
  } else {
    return {
      supported: false,
      reset: '',
      dim: '',
      error: '',
    };
  }
}

const NAME = packageJson.name;
const DEBUG_ENABLED = debuglog(NAME).enabled;
function debugLog(...args: Parameters<typeof console.debug>) {
  if (DEBUG_ENABLED) {
    const stream = process.stderr;
    const colours = getColours(stream);
    const message = args
      .map((arg) =>
        typeof arg === 'string'
          ? arg
          : inspect(arg, { colors: colours.supported }),
      )
      .join(' ');
    stream.write(
      [colours.dim, 'DEBUG ', NAME, ' ', message, colours.reset, '\n'].join(''),
    );
  }
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.stat(path);
    return true;
  } catch {
    return false;
  }
}

interface CreateVerkstedtConfigOptions {
  dir: string;
  ignore?: Parameters<typeof globalIgnores>[0];
  allowDefaultProject?: Array<string>;
}

async function createVerkstedtConfig({
  dir,
  ignore,
  allowDefaultProject = [],
}: CreateVerkstedtConfigOptions) {
  const startMs = performance.now();

  const packageJsonPath = resolve(dir, 'package.json');
  const gitignorePath = resolve(dir, '.gitignore');

  const config: Array<Linter.Config | Array<Linter.Config>> = [];

  if (gitignorePath && (await fileExists(gitignorePath))) {
    config.push(
      includeIgnoreFile(gitignorePath, '.gitignore') as Linter.Config, // FIXME Type mismatch
    );
  }

  if (ignore != null && ignore.length > 0) {
    config.push(globalIgnores(ignore));
  }

  const packageJson = JSON.parse(
    await fs.readFile(packageJsonPath, 'utf-8'),
  ) as PackageJson;
  const deps = Array.from(
    new Set([
      ...Object.keys(packageJson.dependencies ?? {}),
      ...Object.keys(packageJson.devDependencies ?? {}),
    ]),
  );

  const allModuleConfigs: Array<ModuleConfig> = [
    {
      name: 'globals',
      get() {
        return {
          files: ALL_JS_FILES,
          languageOptions: {
            ecmaVersion: 'latest',
            globals: {
              ...globals.browser,
              ...globals.node,
            },
          },
        };
      },
    },
    {
      name: 'js',
      get() {
        return {
          ...js.configs.recommended,
          files: ALL_JS_FILES,
        };
      },
    },
    {
      name: 'custom',
      get() {
        return {
          rules: {
            'no-console': 'error',
          },
        };
      },
    },
    {
      name: 'typescript',
      async get() {
        if (
          !deps.some((dep) =>
            /^(typescript|ts-node|jiti|@types\/.*)$/.test(dep),
          ) ||
          !(await fileExists('tsconfig.json'))
        ) {
          return null;
        } else {
          const configs = (await import('typescript-eslint')).default.configs;
          const selectedConfigs = [
            ...configs.recommendedTypeChecked,
            ...configs.stylisticTypeChecked,
          ].map((cfg) => ({
            ...cfg,
            files: TS_FILES,
          }));

          return [
            ...selectedConfigs,
            {
              files: TS_FILES,
              languageOptions: {
                parserOptions: {
                  tsConfigRootDir: dir,
                  projectService: {
                    allowDefaultProject,
                  },
                },
              },
              rules: {
                // Use Array<…> instead of …[]
                '@typescript-eslint/array-type': [
                  'error',
                  { default: 'generic' },
                ],
              },
            },
          ];
        }
      },
    },
    {
      name: 'react',
      async get() {
        if (!deps.some((dep) => /^(react|react-dom)$/.test(dep))) {
          return null;
        } else {
          return [
            {
              ...(await import('eslint-plugin-react-hooks')).default.configs
                .flat.recommended,
              files: ALL_JS_FILES,
            },
            {
              files: ALL_JS_FILES,
              languageOptions: {
                parserOptions: {
                  ecmaFeatures: {
                    jsx: true,
                  },
                },
              },
            },
          ];
        }
      },
    },
    {
      name: 'next.js',
      async get() {
        if (!deps.some((dep) => dep === 'next')) {
          return null;
        } else {
          // source: https://nextjs.org/docs/app/api-reference/config/eslint#setup-eslint

          const { default: nextVitals } = await import(
            'eslint-config-next/core-web-vitals'
          );
          return [
            ...nextVitals,
            globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
          ];
        }
      },
    },
    {
      name: 'json',
      get() {
        return {
          files: JSON_FILES,
          plugins: { json },
          language: 'json/json',
        };
      },
    },
    {
      name: 'markdown',
      get() {
        return {
          files: MARKDOWN_FILES,
          plugins: { markdown },
          language: 'markdown/gfm',
        };
      },
    },
    {
      name: 'css',
      get() {
        return {
          files: CSS_FILES,
          plugins: { css },
          language: 'css/css',
        };
      },
    },
    {
      name: 'prettier',
      get() {
        return {
          ...prettierRecommended,
          files: ALL_FILES,
        };
      },
    },
  ];

  const missingDeps = new Set<string>();
  for (const moduleConfig of allModuleConfigs) {
    try {
      debugLog('Getting:', moduleConfig.name);
      const configEntry = await moduleConfig.get();
      if (configEntry != null) {
        config.push(configEntry);
      } else {
        debugLog('Skipping:', moduleConfig.name);
      }
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        'code' in error &&
        typeof error.code === 'string' &&
        ['MODULE_NOT_FOUND', 'ERR_MODULE_NOT_FOUND'].includes(error.code)
      ) {
        const match =
          /^Cannot find (?:module|package) '(@[^/']+\/[^/']+|[^/']+)(?:|\/[^']+)'/.exec(
            error.message,
          );
        if (match) {
          missingDeps.add(match[1]);
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }

  if (missingDeps.size > 0) {
    const stream = process.stderr;
    const colours = getColours(stream);
    stream.write(
      [
        '',
        `${colours.error}ERROR: Failed to create verkstedt EsLint config, because some dependencies are missing${colours.reset}. Run:`,
        '    npm install --save-dev ' +
          missingDeps.values().toArray().join(' '),
        '',
      ].join('\n'),
    );
    process.exit(78); // EX_CONFIG
  }

  const durationMs = performance.now() - startMs;
  debugLog('Created ESLint config in', durationMs.toFixed(2), 'ms');

  return config;
}

export default createVerkstedtConfig;
