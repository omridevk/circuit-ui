module.exports = {
  rootDir: '.',
  roots: ['src', 'server'],
  transform: {
    '^.+\\.js$': '<rootDir>/jest.transform.js',
    '^.+\\.svg$': '<rootDir>/jest.fileTransform.js'
  },
  transformIgnorePatterns: ['node_modules/(?!@sumup/circuit-ui/)'],
  moduleFileExtensions: ['js'],
  setupTestFrameworkScriptFile: '<rootDir>/jest.setup.js',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '^config$': '<rootDir>/__mocks__/config.js'
  },
  coverageDirectory: './__coverage__',
  coverageReporters: ['cobertura', 'text-summary', 'html'],
  collectCoverageFrom: ['src/**/**/*.js', 'server/**/**/*.js']
};
