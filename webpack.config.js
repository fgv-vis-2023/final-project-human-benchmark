const path = require('path')

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    watch: true,
    module: {
        rules: [
        {
            test: /\.css$/,
            use: [
                { loader: 'style-loader'},
                { loader: 'css-loader'}
            ]
        },
        {  
            test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
            use: [
                { loader: 'url-loader',
                options: {
                    limit: 100000
                }}
            ]
        }]
    }
}