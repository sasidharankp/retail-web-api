module.exports={
	'env': {
		'commonjs': true,
		'node': true,
		'mocha':true
	},
	'overrides': [{
		'files': ['*.test.*'],
		'env': {
			'mocha': true,
		},
		'plugins': [
			'mocha',
		],
		'rules': {
			'mocha/no-skipped-tests': 'error',
			'mocha/no-exclusive-tests': 'error'
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