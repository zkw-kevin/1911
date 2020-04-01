
// 1.导入gulp第三方模块
const gulp = require('gulp');
// 导入gulp-cssmin第三方模块
const cssmin = require('gulp-cssmin');
// 导入gulp-autoprefixer第三方模块，css文件自动添加前缀
const autoprefixer = require('gulp-autoprefixer');
// 导入js文件
const uglify = require("gulp-uglify");

// 导入es6转换为es5语法的模块
const babel = require('gulp-babel');

// 导入html第三方模块
const htmlmin = require('gulp-htmlmin');

// 导入del第三方模块
const del=require('del');

// 导入服务器
const webserver=require('gulp-webserver');

// 2.打包css的方法
const cssHandler = () => {
    return gulp
        .src('./src/css/*.css')/*找得到src目录下的css目录下所有后缀为.css文件*/
        .pipe(autoprefixer())/*css文件自动添加前缀*/
        .pipe(cssmin())/*压缩css代码*/
        .pipe(gulp.dest('./dist/css'))/*压缩完的css代码放在dist目录下的css文件夹里*/
}

// 2.打包js的方法
const jsHandler = () => {
    return gulp
        .src('./src/js/*.js')/*找得到src目录下的js目录下所有后缀为.js文件*/
        .pipe(babel({
            presets: ['@babel/env']
        }))/*压缩es6转换为es5代码*/
        .pipe(uglify())/*压缩js代码*/
        .pipe(gulp.dest('./dist/js'))/*压缩完的js代码放在dist目录下的js文件夹里*/
}

// 2.打包html的方法
const htmlHandler = () => {
    return gulp
        .src('./src/pages/*.html')/*找得到src目录下的html目录下所有后缀为.html文件*/
        .pipe(htmlmin({
            removeAttributeQuotes: true,//移除属性双引号
            removeComments: true,//移除注释
            collapseBooleanAttributes: true,//布尔值简写
            collapseWhitespace: true,//移除空格
            minifyCSS: true,//页面中的style标签里面css样式也去空格
            minifyJS: true,//页面中的js也去空格
        }))/*压缩html代码*/
        .pipe(gulp.dest('./dist/pages'))/*压缩完的html代码放在dist目录下的pages文件夹里*/
}

// 图片转移
const imgHandler = () => {
    return gulp
        .src('./src/images/**')
        .pipe(gulp.dest('./dist/images'))
}

// lib转移
const libHandler = () => {
    return gulp
        .src('./src/lib/**')
        .pipe(gulp.dest('./dist/lib'))
}

// 书写一个任务自动删除dist目录，用最新的src重新生成一遍内容
const delHandler=()=>{
    return del(['./dist'])
}

// 书写一个服务器
const serverHandler=()=>{
    return gulp
    .src('./dist')//找到要打开的页面文件夹
    .pipe(webserver({
        host:'localhost',//域名
        port:8080,//端口
        open:'./pages/test.html',//默认打开的首页，从dist下面的目录打开
        livereload:true,//自动刷新浏览器
        proxies:[{
            source:'/gx',//你的代理标识符
            target:'http://127.0.0.1/test.php',//你要代理的地址
        }]//跨域配置
    }))//开启服务器
    
}
// 自动监控文件
const watchHandler=()=>{
    gulp.watch('./src/css/*.css',cssHandler)
    gulp.watch('./src/js/*.js',jsHandler)
    gulp.watch('./src/pages/*.html',htmlHandler)
    gulp.watch('./src/lib/**',libHandler)
    gulp.watch('./src/images/**',imgHandler)
}
// 导出一个默认任务，先执行删除同时执行压缩任务，在进行服务器，在自动监控
module.exports.default=gulp.series(delHandler,
    gulp.parallel(cssHandler,jsHandler,htmlHandler,imgHandler,libHandler),
    serverHandler,
    watchHandler)

// 导出一个默认任务，逐步执行任务
// module.exports.default=gulp.series(cssHandler,jsHandler,htmlHandler,imgHandler,libHandler)

// 导出文件一个任务一个任务执行
// module.exports.css = cssHandler;
// module.exports.js = jsHandler;
// module.exports.html = htmlHandler;
// module.exports.image = imgHandler;
// module.exports.lib = libHandler;