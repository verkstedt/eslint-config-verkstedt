#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { inspect } from 'node:util';

import { ansi } from './utils/ansi.ts';
import parseArgs, {
  type ParseArgsOptionsWithDescription,
} from './utils/parseArgs.ts';

type NodeVersionSpec = string;

interface PackageJson {
  engines?: {
    node?: NodeVersionSpec;
  };
}

const options: ParseArgsOptionsWithDescription = {
  help: {
    type: 'boolean',
    short: 'h',
    description: 'Show this help message',
  },
};

async function readFileRel(filePathRel: string): Promise<string> {
  const filePath = new URL(filePathRel, new URL('..', import.meta.url))
    .pathname;
  return readFile(filePath, 'utf-8');
}

async function readPackageJson() {
  const packageJsonContent = await readFileRel('package.json');
  return JSON.parse(packageJsonContent) as PackageJson;
}

function lintNodeVersions(nvmrc: string, packageJson: PackageJson): boolean {
  const pkgVersion = packageJson.engines?.node?.trim();
  const nvmrcVersion = nvmrc.trim();
  const versionRegExp = /^[0-9]+(\.[0-9]+){2}$/;
  const errors: Array<string> = [];

  if (!nvmrcVersion) {
    errors.push('Missing .nvmrc file');
  } else if (!versionRegExp.test(nvmrcVersion)) {
    errors.push(
      `.nvmrc file must contain a specific version (e.g. "16.14.0"), got "${nvmrcVersion}"`,
    );
  }

  if (!pkgVersion) {
    errors.push('Missing "engines.node" field in package.json');
  } else if (!versionRegExp.test(pkgVersion)) {
    errors.push(
      `"engines.node" field in package.json must be a specific version (e.g. "16.14.0"), got "${pkgVersion}"`,
    );
  }

  if (errors.length === 0 && nvmrcVersion !== pkgVersion) {
    errors.push(
      `Node.js version mismatch: .nvmrc specifies "${nvmrcVersion}", but package.json specifies "${pkgVersion ?? ''}"`,
    );
  }

  if (errors.length > 0) {
    process.stderr.write(
      `${ansi.bold}Found issues with Node.js version specifications:${ansi.reset}\n`,
    );
    for (const error of errors) {
      process.stderr.write(`- ${error}\n`);
    }
  }

  return errors.length === 0;
}

async function main() {
  parseArgs({
    description: 'Check if Node.js versions specs are in sync.',
    invocation: 'npm run lint:node',
    options,
    allowPositionals: false,
  });

  let hasErrors = false;

  const packageJson = await readPackageJson();
  const nvmrc = await readFileRel('.nvmrc');
  hasErrors ||= !lintNodeVersions(nvmrc, packageJson);

  if (hasErrors) {
    process.exit(1);
  } else {
    process.stdout.write(
      `${ansi.bold}Node.js version set up correctly${ansi.reset}\n`,
    );
    process.exit(0);
  }
}

main().catch((error: unknown) => {
  process.stderr.write(`${inspect(error)}\n`);
  process.exit(1);
});
