/**
 * Created by rbmenke on 1/19/17.
 */
const webpack = require("webpack")
const path    = require('path')
const is_production = true

process.env.NODE_ENV = is_production ? "production" : "development"
process.env.BABEL_ENV = is_production ? "production" : "development"

const lib_entry = {
    Popover: './src/Popover.js'
}

const lib_output = {
    path    : path.join(__dirname, './dist/'),
    filename: '[name].js',
    libraryTarget: "umd"
}


const dev_plugins = [
    new webpack.DefinePlugin({
        'process.env' : {
            NODE_ENV : JSON.stringify('development'),
            BABEL_ENV : JSON.stringify('development')
        }
    })
]

const prod_plugins = [
    new webpack.DefinePlugin({
        'process.env' : {
            NODE_ENV : JSON.stringify('production'),
            BABEL_ENV : JSON.stringify('production')
        }
    }),
    new webpack.optimize.UglifyJsPlugin( {
        compress: {
            warnings: false
        }
    } )
]


module.exports = {
    entry    : lib_entry,
    output   : lib_output,
    devtool  : is_production ? '#inline-source-map' : false,
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
    externals: ["react", "react-dom"],
    plugins  : is_production ? prod_plugins : dev_plugins
}
