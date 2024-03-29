// PostCSS配置插件
module.exports = {
    // 配置要使用的PostCSS插件
    plugins: {
        // 配置使用 postcss-pxtorem插件
        // 作用： 把 px 转为 rem
        'postcss-pxtorem': {
            // lib-flexible 的 REM 适配方案：把一行分为10份，每份就是十分之一
            // 所以rootValue 应该设置为你的设计稿宽度的十分之一
            // 我们的设计稿是750，所以应该设置为 750 / 10 = 75
            // 但是 Vant 建议设置为37.5，为什么？因为 Vant 是基于375写的
            // 所以必须设置为37.5，唯一的缺点就是使用我们设计稿的尺寸都必须/2
            // 有没有更好的放法？
            //   如果是 Vant 的样式，就按照 37.5 来转换
            //   如果是 我们自己的样式，就按照75来转换
            // 通过查阅文档，我们发现 rootValue 支持两种类型： 
            // 数字：固定的数值
            // 函数：可以动态处理返回
            // postcss-pxtorem 处理每个CSS 文件的时候都会来调用这个函数
            // 它会把被处理的 CSS 文件相关的信息通过参数传递给该函数
            rootValue({ file }) {
                return file.indexOf('vant') !== -1 ? 37.5 : 75

            },
            // rootValue:75,

            // 配置要转换的 CSS 属性
            // * 表示所有
            propList: ['*'],
            // 配置不要转换的样式资源
            exclude: 'github-markdown'
        },
    },
};