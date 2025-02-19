const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './javascript/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|PNG|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name][hash][ext][query]',
                },
            },
        ],
    },
    plugins: [
        new htmlWebpackPlugin({
            template: './html/index.html',
            filename: 'index.html',
        }),
        new htmlWebpackPlugin({
            template: './html/blog.html',
            filename: 'blog.html',
        }),
        new htmlWebpackPlugin({
            template: './html/login.html',
            filename: 'login.html',
        }),
        new htmlWebpackPlugin({
            template: './html/recipes.html',
            filename: 'recipes.html',
        }),
        new htmlWebpackPlugin({
            template: './html/registration.html',
            filename: 'registration.html',
        }),
        new htmlWebpackPlugin({
            template: './html/shopping_list.html',
            filename: 'shopping_list.html',
        }),
        new htmlWebpackPlugin({
            template: './html/what_meal.html',
            filename: 'what_meal.html',
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 8080,
    },
    devtool: 'eval-source-map',
    mode: 'development',
};