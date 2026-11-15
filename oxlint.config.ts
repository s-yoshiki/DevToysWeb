import { defineConfig } from 'oxlint';

import baseConfig from './configs/oxlint/base.ts';

export default defineConfig({
  extends: [baseConfig],
  overrides: [
    {
      files: ['scripts/infra/functions/index-document-rewrite.js'],
      rules: {
        'eslint/no-unused-vars': 'off',
      },
    },
    {
      files: ['apps/web/src/libs/domain/text-tools.ts'],
      rules: {
        'eslint/no-control-regex': 'off',
      },
    },
  ],
});
