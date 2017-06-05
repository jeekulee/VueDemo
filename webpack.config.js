const webpack = require('webpack'),
	  path = require('path');


module.exports={
	entry: {
		dashboard:"./js/main.js"
	},
	output:{
		path: path.resolve(__dirname, "./build"),
		filename: '[name].js',
		publicPath: "/build/"
	},
	module:{
		loaders:[
			{test: /\.css$/, loader: "style!css"},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel',
				query: {
				  presets: ['es2015'],
				  plugins: ["transform-class-properties"]
				}
			},
			{test: /\.(jpg|png)$/, loader: "url?limit=8192"},
			{ test: /\.vue$/,
			  loader: 'vue' 
			}
		]
	},
   vue: {
		loaders: {
			css: 'style!css!autoprefixer',
			html:'html-loader'
		}
    },
	plugins: [
		//new webpack.optimize.UglifyJsPlugin({minimize: true, compress: {warnings: true}})
	],
	resolve:{
			extensions:['','.js','.json','.vue'],
			root: path.resolve(__dirname, "js"),
			alias : {
			  css : path.resolve(__dirname, "css")
			}
	}
};