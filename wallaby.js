const url = require('node:url');

module.exports = function wallaby () {
	return {
		testFramework: 'mocha',
		files: [
			'src/**/*.ts',
			'src/**/*.json',
			'scripts/**/*.ts',
			'scripts/**/*.json',
			'data/**/*.json',
			'package.json',
		],
		tests: [
			'tests/*.test.ts',
		],
		env: {
			type: 'node',
			params: {
				runner: '--experimental-specifier-resolution=node --loader tsx',
			},
		},
		workers: { restart: true, initial: 1, regular: 1 },
	};
}
