const baseConfig = {
  plugins: ['typescript'],
  categories: {
    correctness: 'error',
    suspicious: 'warn',
  },
  ignorePatterns: ['**/dist/**', '**/cdk.out/**', '**/.turbo/**'],
};

export default baseConfig;
