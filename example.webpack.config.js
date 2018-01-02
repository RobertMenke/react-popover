/**
 * Created by rbmenke on 1/19/17.
 */
const webpack       = require( "webpack" )
const glob          = require( "glob" )
const path          = require('path')
const is_production = false

process.env.NODE_ENV = is_production ? "production" : "development"
process.env.BABEL_ENV = is_production ? "production" : "development"

const example_entry = {
    bundle: './example/index.js'
}

const example_output = {
    path    : path.join(__dirname, './example/'),
    filename: '[name].js'
}


const dev_plugins = [
    new webpack.DefinePlugin({
        'process.env' : {
            NODE_ENV : JSON.stringify('development')
        }
    })
]

const prod_plugins = [
    new webpack.DefinePlugin({
        'process.env' : {
            NODE_ENV : JSON.stringify('production')
        }
    }),
    new webpack.optimize.UglifyJsPlugin( {
        compress: {
            warnings: false
        }
    } )
]


module.exports = {
    entry    : example_entry,
    cache    : true,
    output   : example_output,
    devtool  : '#inline-source-map',
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
    plugins  : is_production ? prod_plugins : dev_plugins
}
