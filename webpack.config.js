const path = require('path');

module.exports = {
	entry: './reactSrc/studentData/index.js',
	output: {
		filename: 'studentData.js',
		path: path.resolve(__dirname, 'src/js')
	},
	resolve: {
		extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.scss', '.css', 'config.js']
	},
	module: {
		loaders: [{
			test: /\.(js|jsx)$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
			query: {
				// presets: ['r eact']
				presets: ['react', 'env']
			}
		},
		{
			test: /\.css$/,
			loader: 'style-loader!css-loader?sourceMap'
		}]
	},
	devtool:'source-map',
};
