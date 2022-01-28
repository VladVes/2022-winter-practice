module.exports = () => ({
  files: [
    '.src/**/*.js',
    '.src/data/**/*.*',
    './__tests__/__data/**/*.*',
    './__tests__/helpers/**/*.js',
  ],
  env: {
    type: 'node',
  },
  debug: true,
  testFramework: 'jest',
});
