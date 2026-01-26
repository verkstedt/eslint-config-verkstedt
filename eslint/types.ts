export interface NoRestrictedImportsConfig {
  paths?: Array<{ name: string; message: string }>;
  patterns?: Array<{ group: Array<string>; message: string }>;
}
