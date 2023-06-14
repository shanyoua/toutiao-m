module.exports = {
    // 配置要是有的PostCSS插件
    plugins: {
        // 自动生成浏览器css样式规则前缀
        // VueCLI已经配置了,不需要重新配置
        // 'autoprefixer': {
        //     browsers: ['Android >= 4.0', 'ios >= 8']
        // },

        // 将px转为rem,  * 表示所有
        'postcss-pxtorem': {
            rootValue({ file }) {
                return file.indexOf('vant') !== -1 ? 37.5 : 75
            },
            // rootValue: 75,
            propList: ['*'],

            // 配置不要转换的样式资源
            exclude: 'github-markdown'
        },
    },
}; 
  