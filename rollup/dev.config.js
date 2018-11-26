const fs = require('fs')
const path = require('path')

const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const globals = require('rollup-plugin-node-globals')
const builtins = require('rollup-plugin-node-builtins')
const replace = require('rollup-plugin-replace')
const string = require('rollup-plugin-string')

const EXPERIMENTS_ROOT = path.join(__dirname, '../experiments')

const fileExists = filepath => {
	try {
		return fs.statSync(filepath).isFile()
	} catch (err) {
		return false
	}
}

const experiments = fs.readdirSync(EXPERIMENTS_ROOT).filter(name => {
	return fs.statSync(path.join(EXPERIMENTS_ROOT, name)).isDirectory() &&
				 fileExists(path.join(EXPERIMENTS_ROOT, name, 'index.js'))
})

const experimentConfig = experimentName => ({
	input: `experiments/${experimentName}/index.js`,
	output: {
		name: `experiment`,
		file: 'index.bundle.js',
		dir: `experiments/${experimentName}`,
		format: 'umd',
	},
	watch: {},
	plugins: [
		babel({
			exclude: 'node_modules/**'
		}),
		replace({
			'process.env.NODE_ENV': '"development"',
		}),
		resolve({
			browser: true,
		}),
		commonjs({
			namedExports: {
				'node_modules/react-dom/index.js': ['render', 'createPortal', 'findDOMNode'],
				'node_modules/react/index.js': ['Children', 'Component', 'PureComponent', 'createElement'],
				'node_modules/redux-logger/dist/redux-logger.js': ['createLogger'],
				'node_modules/react-is/index.js': ['isValidElementType'],
			},
		}),
		globals(),
		builtins({
			crypto: true
		}),
		string({
			include: ['experiments/**/*.css', 'node_modules/**/*.css'],
		}),
	]
})

module.exports = experiments.map(experimentConfig).slice(-1)
