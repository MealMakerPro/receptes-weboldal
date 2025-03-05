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
            favicon: "./img/logo.PNG",
        }),
        new htmlWebpackPlugin({
            template: './html/blog.html',
            filename: 'blog.html',
            favicon: "./img/logo.PNG",
        }),
        new htmlWebpackPlugin({
            template: './html/login.html',
            filename: 'login.html',
            favicon: "./img/logo.PNG",
        }),
        new htmlWebpackPlugin({
            template: './html/recipes.html',
            filename: 'recipes.html',
            favicon: "./img/logo.PNG",
        }),
        new htmlWebpackPlugin({
            template: './html/registration.html',
            filename: 'registration.html',
            favicon: "./img/logo.PNG",
        }),
        new htmlWebpackPlugin({
            template: './html/shopping_list.html',
            filename: 'shopping_list.html',
            favicon: "./img/logo.PNG",
        }),
        new htmlWebpackPlugin({
            template: './html/what_meal.html',
            filename: 'what_meal.html',
            favicon: "./img/logo.PNG",
        }),
        new htmlWebpackPlugin({
            template: './html/profile.html',
            filename: 'profile.html',
            favicon: "./img/logo.PNG",
        }),
        new htmlWebpackPlugin({
            template: './html/recipeUpload.html',
            filename: 'recipeUpload.html',
            favicon: "./img/logo.PNG",
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