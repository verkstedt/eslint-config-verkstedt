import fs from 'node:fs/promises';
import { resolve } from 'node:path';
import type { WriteStream } from 'node:tty';
import { fileURLToPath } from 'node:url';
import { debuglog, inspect } from 'node:util';

import { includeIgnoreFile as includeIgnoreFileOriginal } from '@eslint/compat';
import type { Plugin } from '@eslint/core';
import css from '@eslint/css';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import type { Linter } from 'eslint';
import { globalIgnores } from 'eslint/config';
import cssModulesPlugin from 'eslint-plugin-css-modules';
import eslintCommentsPlugin from 'eslint-plugin-eslint-comments';
import importPlugin from 'eslint-plugin-import';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import micromatch from 'micromatch';

import configPackageJson from '../package.json' with { type: 'json' };

import getVerkstedtConfig from './custom.ts';
import {
  ALL_FILES,
  ALL_JS_FILES,
  CSS_FILES,
  JSON_FILES,
  JSONC_FILES,
  MARKDOWN_FILES,
  MS_JSONC_FILES,
  TS_FILES,
} from './file-globs.ts';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

type PromiseOrValue<Type> = Type | Promise<Type>;

type ArrayOrItem<Type> = Type | Array<Type>;

// Not all plugins are typed as {import('@eslint/core').Plugin}
type AnyPlugin = Plugin | typeof json | typeof css;
type Config = ArrayOrItem<
  Omit<Linter.Config, 'plugins'> & {
    plugins?: Record<string, AnyPlugin>;
  }
>;

interface ModuleConfig {
  /** Name for humans only */
  name: string;
  /** Return EsLint config entry, or null to skip */
  get: (
    this: ModuleConfig,
    config: Array<Config>,
  ) => PromiseOrValue<null | Config>;
}

const includeIgnoreFile = includeIgnoreFileOriginal as (
  ignoreFilePath: string,
  name?: string,
) => Linter.Config;

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

const NAME = configPackageJson.name;
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

function getMissingDepNameFromError(error: unknown) {
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
      return match[1];
    } else {
      throw error;
    }
  } else {
    throw error;
  }
}

async function createConfigFromModules(allModuleConfigs: Array<ModuleConfig>) {
  const config: Array<Config> = [];

  const missingDeps = new Set<string>();
  for (const moduleConfig of allModuleConfigs) {
    try {
      debugLog('Getting:', moduleConfig.name);
      // eslint-disable-next-line no-await-in-loop -- getters may depend on things added by previous getters
      const configEntry = await moduleConfig.get(config);
      if (configEntry == null) {
        debugLog('Skip:', moduleConfig.name);
      } else if (Array.isArray(configEntry)) {
        config.push(...configEntry);
      } else {
        config.push(configEntry);
      }
    } catch (error: unknown) {
      missingDeps.add(getMissingDepNameFromError(error));
    }
  }

  if (missingDeps.size > 0) {
    const stream = process.stderr;
    const colours = getColours(stream);
    stream.write(
      [
        '',
        `${colours.error}ERROR: Failed to create verkstedt EsLint config, because some dependencies are missing${colours.reset}. Run:`,
        `    npm install --save-dev ${missingDeps
          .values()
          .toArray()
          .join(' ')}`,
        '',
      ].join('\n'),
    );
    process.exit(78); // EX_CONFIG
  }

  return config;
}

interface CreateVerkstedtConfigOptions {
  dir: string;
  allowDefaultProject?: Array<string>;
}

async function createVerkstedtConfig({
  dir,
  allowDefaultProject = [],
}: CreateVerkstedtConfigOptions): Promise<Array<Config>> {
  const startMs = performance.now();

  const packageJsonPath = resolve(dir, 'package.json');
  const gitignorePath = resolve(dir, '.gitignore');

  const config: Array<Config> = [];

  if (gitignorePath && (await fileExists(gitignorePath))) {
    config.push(includeIgnoreFile(gitignorePath, '.gitignore'));
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

  const usesTypeScript =
    deps.some((dep) => /^(typescript|ts-node|jiti|@types\/.*)$/.test(dep)) ||
    (await fileExists('tsconfig.json'));
  const usesReact = deps.some((dep) => /^(react|react-dom)$/.test(dep));
  const usesNextJs = deps.some((dep) => dep === 'next');

  debugLog('Uses TypeScript:', usesTypeScript);
  debugLog('Uses React:', usesReact);
  debugLog('Uses Next.js:', usesNextJs);

  const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
  });

  const allModuleConfigs: Array<ModuleConfig> = [
    {
      name: 'built–in prettier ignore',
      get() {
        return includeIgnoreFile(
          fileURLToPath(
            new URL('../prettier/.prettierignore', import.meta.url),
          ),
          this.name,
        );
      },
    },
    {
      name: 'app prettier ignore',
      async get() {
        const prettierIgnorePath = resolve(dir, '.prettierignore');
        if (await fileExists(prettierIgnorePath)) {
          return includeIgnoreFile(prettierIgnorePath, this.name);
        } else {
          return null;
        }
      },
    },
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
      name: 'import',
      get() {
        return [
          importPlugin.flatConfigs.recommended,
          usesTypeScript && importPlugin.flatConfigs.typescript,
          usesReact && importPlugin.flatConfigs.react,
          {
            settings: {
              'import/resolver': {
                typescript: usesTypeScript,
                node: !usesTypeScript,
                exports: true,
              },
            },
          },
        ]
          .filter((item) => item !== false)
          .map(({ languageOptions: _languageOptions, ...cfgItem }) => cfgItem);
      },
    },
    {
      name: 'typescript',
      async get() {
        if (!usesTypeScript) {
          return null;
        } else {
          const additionalAllowDefaultProject: Array<string> =
            await (async () => {
              const tsconfigPath = resolve(dir, 'tsconfig.json');
              const tsconfigJson = !(await fileExists(tsconfigPath))
                ? '{}'
                : await fs.readFile(tsconfigPath, 'utf-8');
              interface TsConfig {
                include?: Array<string>;
                files?: Array<string>;
              }
              const tsconfig = JSON.parse(tsconfigJson) as TsConfig;
              const tsconfigIncludes = [
                ...(tsconfig.include ?? []),
                ...(tsconfig.files ?? []),
              ];
              const tsconfigIncludesAll =
                tsconfigIncludes.length === 0 ||
                tsconfigIncludes.includes('**/*') ||
                tsconfigIncludes.includes('*');

              return ['eslint.config.ts', 'prettier.config.ts'].filter(
                (filename) => {
                  return !(
                    tsconfigIncludesAll ||
                    micromatch.isMatch(filename, tsconfigIncludes, {
                      cwd: dir,
                    })
                  );
                },
              );
            })();

          // source: https://typescript-eslint.io/getting-started

          const configs = (await import('typescript-eslint')).default.configs;
          const selectedConfigs = [
            ...configs.strictTypeChecked, // extends recommended
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
                    allowDefaultProject: [
                      ...additionalAllowDefaultProject,
                      ...allowDefaultProject,
                    ],
                  },
                },
              },
            },
          ];
        }
      },
    },
    {
      name: 'react',
      async get() {
        // source: https://github.com/jsx-eslint/eslint-plugin-react

        if (!usesReact) {
          return null;
        } else {
          return [
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
            {
              ...(await import('eslint-plugin-react')).default.configs.flat[
                'jsx-runtime'
              ],
              files: ALL_JS_FILES,
            },
          ];
        }
      },
    },
    {
      name: 'react hooks',
      async get() {
        if (!usesReact) {
          return null;
        } else {
          // source: https://react.dev/reference/eslint-plugin-react-hooks

          return [
            {
              ...(await import('eslint-plugin-react-hooks')).default.configs
                .flat.recommended,
              files: ALL_JS_FILES,
            },
          ];
        }
      },
    },
    {
      name: 'next.js',
      async get() {
        if (!usesNextJs) {
          return null;
        } else {
          // source: https://nextjs.org/docs/app/api-reference/config/eslint#setup-eslint

          const { default: nextVitals } =
            // includes recommended config as well
            await import('eslint-config-next/core-web-vitals');
          const { default: nextTypeScript } = usesTypeScript
            ? await import('eslint-config-next/typescript')
            : { default: [] };
          return [
            ...nextVitals
              // import plugin already included in importPlugin.flatConfigs.recommended,
              // defining it again breaks the config
              .map((cfgItem) => {
                if (cfgItem.plugins?.import) {
                  delete cfgItem.plugins.import;
                }
                return cfgItem;
              }),
            ...nextTypeScript,
            globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
          ];
        }
      },
    },
    {
      name: 'storybook',
      async get() {
        if (!deps.some((dep) => dep === 'storybook')) {
          return null;
        } else {
          // source: https://storybook.js.org/docs/configure/integration/eslint-plugin#configuration-flat-config-format

          const { default: storybook } =
            await import('eslint-plugin-storybook');

          return [
            // FIXME Casting with `as` should not be necessary
            ...(storybook.configs['flat/recommended'] as Array<Linter.Config>),
          ];
        }
      },
    },
    {
      name: 'lingui',
      async get() {
        if (!deps.some((dep) => dep.startsWith('@lingui/'))) {
          return null;
        } else {
          // source: https://lingui.dev/ref/eslint-plugin

          const { default: lingui } = await import('eslint-plugin-lingui');
          return [lingui.configs['flat/recommended']];
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
          extends: ['json/recommended'],
        };
      },
    },
    {
      name: 'jsonc',
      get() {
        return {
          files: JSONC_FILES,
          plugins: { json },
          language: 'json/jsonc',
          extends: ['json/recommended'],
        };
      },
    },
    {
      name: 'jsonc with Microsoft extensions',
      get() {
        return {
          files: MS_JSONC_FILES,
          plugins: { json },
          language: 'json/jsonc',
          languageOptions: {
            allowTrailingCommas: true,
          },
          extends: ['json/recommended'],
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
          extends: ['markdown/recommended'],
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
          extends: ['css/recommended'],
        };
      },
    },
    {
      name: 'css-modules',
      get() {
        return {
          plugins: {
            'css-modules': cssModulesPlugin,
          },
          extends: compat.extends('plugin:css-modules/recommended'),
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
    {
      name: 'eslint-comments',
      get() {
        return {
          plugins: {
            'eslint-comments': eslintCommentsPlugin,
          },
          files: ALL_JS_FILES,
          extends: compat.extends('plugin:eslint-comments/recommended'),
        };
      },
    },
    {
      name: 'custom',
      get(configSoFar) {
        // To be able to overwrite @typescript-eslint rules, we need to
        // include @typescript-eslint plugin in this section of the
        // config. We can use its existence as a signal whether project
        // is using TypeScript or not.
        const typescriptEsLintPlugin = !usesTypeScript
          ? undefined
          : (
              configSoFar as unknown as Array<{
                plugins?: Record<string, Plugin>;
              }>
            ).find((cfgItem) => cfgItem.plugins?.['@typescript-eslint'])
              ?.plugins?.['@typescript-eslint'];

        return getVerkstedtConfig({
          typescriptEsLintPlugin,
          eslintCommentsPlugin,
        });
      },
    },
  ];

  config.push(...(await createConfigFromModules(allModuleConfigs)));

  const durationMs = performance.now() - startMs;
  debugLog('Created ESLint config in', durationMs.toFixed(2), 'ms');

  return config;
}

export { createVerkstedtConfig, includeIgnoreFile };
