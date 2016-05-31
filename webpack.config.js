module.exports = {
    entry: './src/App.jsx',
    output: {
        path: __dirname,
        filename: './public/bundle.js'
    },
    resolve: {
        root: __dirname,
        alias: {
            //Place aliases here
            //Example:
            //NameModule: 'path of own module to include'
        },
        extensions:['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0']
                },
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/
            }
        ],
        devServer: {
            historyApiFallback: true,
            contentBase: './public/',
            progress: true
        }
    },
    devtool: 'source-map'
};