import type { Config } from 'prettier';

const config: Config = {
  // Use single quotes (') instead of double ones (") by default
  singleQuote: true,
  // Add trailing commas
  trailingComma: 'all',
  // If one prop needs quotes, quote all
  quoteProps: 'consistent',
};

export default config;
