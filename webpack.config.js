module.exports={
    entry: __dirname+'/static/js/main.js',
    output:{
        path:__dirname+'/build',
        filename:'FreeToDo.js',
    },
    module:{
        loaders:[
            {
                test: /\.css$/,
                loaders:['style-loader','css-loader'],
            },
            {
                test:/\.(png|jpg|gif)$/,
                loaders:['url-loader',],
            }
        ],
    },
    devServer:{
        hot:true,
        inline:true,
        historyApiFallback:true,
    }
};
