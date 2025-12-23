#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { inspect, parseArgs, type ParseArgsOptionsConfig } from 'node:util';

type NodeVersionSpec = string;

interface PackageJson {
  engines?: {
    node?: NodeVersionSpec;
  };
}

type ParseArgsOptionsWithDescription = Record<
  string,
  ParseArgsOptionsConfig[string] & {
    description: string;
  }
>;

const options: ParseArgsOptionsWithDescription = {
  help: {
    type: 'boolean',
    short: 'h',
    description: 'Show this help message',
  },
};

function isTruthyEnvVar(value: string | undefined): boolean {
  return ['1', 'true', 'yes'].includes((value ?? '').toLowerCase());
}

function shouldUseColours(): boolean {
  if (isTruthyEnvVar(process.env.FORCE_COLOR)) {
    return true;
  } else if (isTruthyEnvVar(process.env.NO_COLOR)) {
    return false;
  } else {
    return process.stdout.isTTY && process.stderr.isTTY;
  }
}

const ansi = shouldUseColours()
  ? {
      reset: '\u001b[0m',
      bold: '\u001b[1m',
      dim: '\u001b[2m',
    }
  : {
      reset: '',
      bold: '',
      dim: '',
    };

function printHelp() {
  interface Opt {
    flags: string;
    description: string;
  }
  const opts: Array<Opt> = Object.entries(options).map(([name, opt]) => {
    const flags = [`--${name}`, opt.short ? `-${opt.short}` : null]
      .filter(Boolean)
      .join(', ');
    return { flags, description: opt.description };
  });
  const maxFlagLength = Math.max(...opts.map((opt) => opt.flags.length));

  process.stdout.write(
    [
      `${ansi.bold}Check if Node.js versions specs are in sync.${ansi.reset}`,
      '',
      `${ansi.bold}Usage:${ansi.reset} npm run lint:node ${ansi.dim}[OPTIONS]${ansi.reset}`,
      '',
      `${ansi.bold}Options:${ansi.reset}`,
      ...opts.map(
        (opt) => `  ${opt.flags.padEnd(maxFlagLength)}  ${opt.description}`,
      ),
      '',
    ].join('\n'),
  );
}

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
  const { values } = parseArgs({
    options,
    allowPositionals: false,
  });

  if (values.help) {
    printHelp();
    process.exit(0);
  }

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
