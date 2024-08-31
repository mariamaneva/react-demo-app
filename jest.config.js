module.exports = {
    setupFiles: ['<rootDir>/src/config/test-setup.js'],
    roots: ['<rootDir>/src'],
    collectCoverage: true,
    coverageReporters: ['cobertura', 'text'],
    coverageDirectory: 'coverage',
}
