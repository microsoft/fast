// For options, see: https://custom-elements-manifest.open-wc.org/analyzer/config/

export default {
  globs: [
    "src/**/*.ts"
  ],
  exclude: [
    "**/__test__/",
    "**/design-system/",
    "**/design-token/",
    "**/di/",
    "**/utilities/",
    "**/test-utilities/",
    "**/*.spec.ts",
    "**/*.template.ts",
    "**/index.ts",
    "**/index-rollup.ts",
  ],
  outdir: "dist",
  packagejson: false,
  fast: true,
};
