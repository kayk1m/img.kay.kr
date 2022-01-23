/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@assets/(.*)': '<rootDir>/assets/$1',
    '@src/(.*)': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  globalSetup: './jest/setup.js',
  globalTeardown: './jest/teardown.js',
  testEnvironment: './jest/mongo-environment.js',
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/{backend,pages}/**/*.ts',
    '!<rootDir>/src/pages/api/docs.ts',
    '!**/_middleware.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
};
