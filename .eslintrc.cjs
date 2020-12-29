module.exports={
	'env': {
		'commonjs': true,
		'node': true,
		'mocha':true
	},
	'overrides': [{
		'files': ['*.test.*'],
		'env': {
			'jest/globals': true,
		},
		'plugins': [
			'jest',
		],
		'rules': {
			'one-var': ['error', 'never'],
			'lodash/prefer-lodash-method': [2, {
				'ignoreMethods': ['find', 'forEach'],
			}],
			'@typescript-eslint/no-non-null-assertion': 'off',
			'dot-notation': 'off',
			'jest/expect-expect': 'warn',
			'jest/no-commented-out-tests': 'error',
			'jest/no-disabled-tests': 'error',
			'jest/no-focused-tests': 'error',
			'jest/no-identical-title': 'error',
			'jest/no-jasmine-globals': 'warn',
			'jest/no-jest-import': 'error',
			'jest/no-mocks-import': 'error',
			'jest/no-standalone-expect': 'error',
			'jest/no-test-prefixes': 'error',
			'jest/valid-describe': 'error',
			'jest/valid-expect': 'error',
			'jest/valid-expect-in-promise': 'error',
		},
	},
	{
		'files': ['*.json'],
		'plugins': [
			'json',
		],
		'rules': {
			'json/*': ['error', { 'allowComments': true }],
		},
	},
	],
	'extends': 'eslint:recommended',
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		]
	},
	
	'parser': 'babel-eslint',
	'parserOptions': {
		'sourceType': 'module',
		'ecmaVersion': 2015,
		'allowImportExportEverywhere': true
	}
}