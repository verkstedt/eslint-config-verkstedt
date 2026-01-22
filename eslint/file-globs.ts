const TS_EXTS = ['ts', 'mts'];
const JS_EXTS = ['js', 'mjs', 'cjs', ...TS_EXTS];

const REACT_TS_EXTS = ['tsx'];
const REACT_JS_EXTS = ['jsx', ...REACT_TS_EXTS];

const ALL_TS_FILES_EXTS = [...TS_EXTS, ...REACT_TS_EXTS];
export const ALL_TS_FILES = [`**/*.{${ALL_TS_FILES_EXTS.join(',')}}`];

const ALL_JS_FILES_EXTS = [...JS_EXTS, ...REACT_JS_EXTS];
export const ALL_JS_FILES = [`**/*.{${ALL_JS_FILES_EXTS.join(',')}}`];

const CSS_EXTS = ['css', 'scss'];
export const CSS_FILES = [`**/*.{${CSS_EXTS.join(',')}}`];

const JSON_EXTS = ['json', 'jsonc'];
export const JSON_FILES = [`**/*.{${JSON_EXTS.join(',')}}`];

export const MS_JSONC_FILES = ['tsconfig.json', '.vscode/**/*.json'];
export const JSONC_FILES = ['**/*.jsonc', ...MS_JSONC_FILES];

const MARKDOWN_EXTS = ['md', 'markdown'];
export const MARKDOWN_FILES = [`**/*.{${MARKDOWN_EXTS.join(',')}}`];

const ALL_FILES_EXTS = [
  ...ALL_JS_FILES_EXTS,
  ...CSS_EXTS,
  ...JSON_EXTS,
  ...MARKDOWN_EXTS,
];
export const ALL_FILES = [`**/*.{${ALL_FILES_EXTS.join(',')}}`];
