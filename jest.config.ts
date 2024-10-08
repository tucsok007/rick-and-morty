export default {
  preset: 'ts-jest',
  rootDir: '.',
  roots: ['./src'],
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts, tsx}', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.{ts|tsx}?$': 'ts-jest',
  },
  coveragePathIgnorePatterns: ['/node_modules', '/coverage', 'main.tsx'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '^@src/(.*)$': ['<rootDir>/src/$1'],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.app.json',
    },
  },
};
