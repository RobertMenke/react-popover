/**
 * Created by rbmenke on 1/19/17.
 */
const webpack = require("webpack");
const glob    = require("glob");
const path    = require('path')
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

module.exports = {
    // entry    : './src/Popover.js',
    entry    : './example/index.js',
    output   : {
        // path    : path.resolve(__dirname, 'dist'),
        path    : path.resolve(__dirname, 'example'),
        // filename: 'Popover.js',
        filename: 'bundle.js',
        // libraryTarget : "umd"
    },
    // devtool  : '#inline-source-map',
    module   : {
        rules : [
            {
                test  : /\.js$/,

                exclude: /node_modules/,
                use : {
                    loader : 'babel-loader',
                    options: {
                        presets : ['es2015', 'react'],
                        plugins : ['transform-flow-strip-types']
                    }
                }
            }
        ]
    },
    target : "web",
    // externals: ["react", "react-dom"],
    // plugins  : [
    //     new webpack.optimize.UglifyJsPlugin({
    //         compress: {
    //             warnings: false
    //         }
    //     })
    // ]
};