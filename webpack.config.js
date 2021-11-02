const path = require('path');

const config = {
	entry: './reactSrc/studentData/index.js',
	output: {
		filename: 'build_studentData.js',
		path: path.resolve(__dirname, 'src/js')
	},
	resolve: {
		extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.scss', '.css', 'config.js']
	},
	module: {
		rules:[
			{
				test: /\.(js|jsx)$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				options:{
					presets: ["@babel/preset-react", "@babel/preset-env"]
				}
			},
			{
				test: /\.css$/,
				use: 'style-loader!css-loader?sourceMap'
			}
		]
	},
	devtool:'source-map',
};

module.exports = config;