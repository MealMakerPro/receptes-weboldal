const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './javascript/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                type: "asset/resource",
            },
        ],
    },
    plugins: [
        new htmlWebpackPlugin({
            template: './html/index.html',
            filename: 'index.html',
        }),
        new htmlWebpackPlugin({
            template: './html/registration.html',
            filename: 'registration.html',
        }),
        new htmlWebpackPlugin({
            template: './html/login.html',
            filename: 'login.html',
        }),
        new htmlWebpackPlugin({
            template: './html/blog.html',
            filename: 'blog.html',
        }),
        new htmlWebpackPlugin({
            template: './html/recipes.html',
            filename: 'recipes.html',
        }),
        new htmlWebpackPlugin({
            template: './html/shopping_list.html',
            filename: 'shopping_list.html',
        }),
        new htmlWebpackPlugin({
            template: './html/what_meal.html',
            filename: 'what_meal.html',
        })
    ],
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        open: true,
    },
    devtool: 'eval-source-map',
    mode: 'development',
};