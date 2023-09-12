module.exports = {
  extends: require.resolve('npm-package-json-lint-config-default'),
  rules: {
    'require-author': 'error',
    'require-bugs': 'error',
    'require-description': 'error',
    'require-keywords': 'error',
    'require-license': 'error',
    'require-repository': 'error',
    'no-repeated-dependencies': 'error',
    'description-format': [
      'error',
      {
        requireCapitalFirstLetter: true,
        requireEndingPeriod: true
      }
    ],
    'name-format': 'error',
    'version-format': 'error',
    'no-duplicate-properties': 'error',
    'prefer-no-engineStrict': 'error',
    'prefer-property-order': [
      'error',
      [
        'name',
        'type',
        'private',
        'version',
        'description',
        'author',
        'authors',
        'license',
        'homepage',
        'funding',
        'repository',
        'bugs',
        'keywords',
        'engines',
        'bin',
        'sideEffects',
        'types',
        'main',
        'module',
        'umd',
        'exports',
        'publishConfig',
        'files',
        'scripts',
        'peerDependencies',
        'dependencies',
        'devDependencies',
        'overrides',
        'workspaces',
        'tsd',
        'readme'
      ]
    ]
  }
}
