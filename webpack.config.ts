import {Configuration, ProgressPlugin} from "webpack";
import { join } from "path";

const config: Configuration = {
	name: "bundler",
	mode: "production",
	entry: "./src/index.ts",
	target: "node",
	output: {
		library: "md-crawler",
		libraryTarget: "commonjs2",
		filename: "index.js",
		path: join(__dirname, "dist")
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.ts*/,
				use: "ts-loader",
				exclude: /node_modules/
			}
		]
	},
	optimization: {
		usedExports: true,
		minimize: true
	},
	plugins: [
		new ProgressPlugin()
	]
}
export default config;
