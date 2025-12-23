#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { inspect, parseArgs, type ParseArgsOptionsConfig } from 'node:util';

type PackageName = string;
type PackageVersionSpec = string;

interface PackageJson {
  name: PackageName;
  peerDependencies?: Record<PackageName, PackageVersionSpec>;
  peerDependenciesMeta?: Record<
    PackageName,
    { optional: boolean; note?: string }
  >;
  devDependencies?: Record<PackageName, PackageVersionSpec>;
  dependencies?: Record<PackageName, PackageVersionSpec>;
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
      `${ansi.bold}Check if things in package.json are in sync.${ansi.reset}`,
      '',
      `${ansi.bold}Usage:${ansi.reset} npm run lint:pkg ${ansi.dim}[OPTIONS]${ansi.reset}`,
      '',
      `${ansi.bold}Options:${ansi.reset}`,
      ...opts.map(
        (opt) => `  ${opt.flags.padEnd(maxFlagLength)}  ${opt.description}`,
      ),
      '',
    ].join('\n'),
  );
}

async function readPackageJson() {
  const packageJsonPath = join(import.meta.dirname, '..', 'package.json');
  const packageJsonContent = await readFile(packageJsonPath, 'utf-8');
  return JSON.parse(packageJsonContent) as PackageJson;
}

function lintPeerDependencies(packageJson: PackageJson) {
  // Check if all peerDependencies are listed in devDependencies with
  // the same version
  const peerDeps = packageJson.peerDependencies ?? {};
  const peerDepsMeta = packageJson.peerDependenciesMeta ?? {};
  const devDeps = packageJson.devDependencies ?? {};
  const errors: Array<string> = [];

  for (const [peerDep, peerVersion] of Object.entries(peerDeps)) {
    const devVersion = devDeps[peerDep];
    if (!devVersion) {
      errors.push(
        `Peer dependency "${peerDep}" is missing in devDependencies.`,
      );
    } else if (!peerVersion.startsWith('>=')) {
      errors.push(
        `Peer dependency "${peerDep}" should use '>=' version specifier, found "${peerVersion}".`,
      );
    } else if (!devVersion.startsWith('^')) {
      errors.push(
        `Dev dependency "${peerDep}" should use '^' version specifier, found "${devVersion}".`,
      );
    } else if (devVersion.replace('^', '') !== peerVersion.replace('>=', '')) {
      errors.push(
        `Version mismatch for "${peerDep}": peer "${peerVersion}", dev "${devVersion}".`,
      );
    }

    if (!(peerDep in peerDepsMeta)) {
      errors.push(
        `Peer dependency "${peerDep}" is missing in peerDependenciesMeta.`,
      );
    }
  }

  for (const [metaDep, meta] of Object.entries(peerDepsMeta)) {
    if (!(metaDep in peerDeps)) {
      errors.push(
        `peerDependenciesMeta entry "${metaDep}" is not listed in peerDependencies and is not marked as optional.`,
      );
    }

    if (meta.optional && !meta.note) {
      errors.push(
        `peerDependenciesMeta entry "${metaDep}" is marked as optional but is missing a note explaining when it should be included.`,
      );
    }
  }

  if (errors.length) {
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
  hasErrors ||= !lintPeerDependencies(packageJson);

  if (hasErrors) {
    process.exit(1);
  } else {
    process.stdout.write(`${ansi.bold}package.json looks fine${ansi.reset}\n`);
    process.exit(0);
  }
}

main().catch((error: unknown) => {
  process.stderr.write(`${inspect(error)}\n`);
  process.exit(1);
});
