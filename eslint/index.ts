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
  moduleName: string | null;
  get: (
    this: ModuleConfig,
  ) => PromiseOrValue<null | Linter.Config | Array<Linter.Config>>;
}

const NAME = packageJson.name;
const DEBUG_ENABLED = debuglog(NAME).enabled;
function debugLog(...args: Parameters<typeof console.debug>) {
  if (DEBUG_ENABLED) {
    const stream = process.stderr;
    const colors = stream.isTTY;
    const message = args
      .map((arg) => (typeof arg === 'string' ? arg : inspect(arg, { colors })))
      .join(' ');
    stream.write(
      [
        colors ? '\x1B[2m' : '',
        'DEBUG ',
        NAME,
        ' ',
        message,
        colors ? '\x1B[0m' : '',
        '\n',
      ].join(''),
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
      moduleName: 'globals',
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
      moduleName: '@eslint/js',
      get() {
        return {
          ...js.configs.recommended,
          files: ALL_JS_FILES,
        };
      },
    },
    {
      moduleName: null,
      get() {
        return {
          rules: {
            'no-console': 'error',
          },
        };
      },
    },
    {
      moduleName: 'typescript-eslint',
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
      moduleName: 'eslint-plugin-react-hooks',
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
      moduleName: '@eslint/json',
      get() {
        return {
          files: JSON_FILES,
          plugins: { json },
          language: 'json/json',
        };
      },
    },
    {
      moduleName: '@eslint/markdown',
      get() {
        return {
          files: MARKDOWN_FILES,
          plugins: { markdown },
          language: 'markdown/gfm',
        };
      },
    },
    {
      moduleName: '@eslint/css',
      get() {
        return {
          files: CSS_FILES,
          plugins: { css },
          language: 'css/css',
        };
      },
    },
    {
      moduleName: 'eslint-plugin-prettier',
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
      const configEntry = await moduleConfig.get();
      if (configEntry != null) {
        config.push(configEntry);
      } else {
        debugLog('Skipping:', moduleConfig.moduleName);
      }
    } catch (error: unknown) {
      if (
        moduleConfig.moduleName != null &&
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'ERR_MODULE_NOT_FOUND'
      ) {
        missingDeps.add(moduleConfig.moduleName);
      } else {
        throw error;
      }
    }
  }

  if (missingDeps.size > 0) {
    process.stderr.write(
      [
        'ERROR: Failed to create verkstedt EsLint config, because some dependencies are missing, run:',
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
