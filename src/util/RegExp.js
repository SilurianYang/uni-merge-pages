/**
 * 将一个字符串格式化为正在的json 去除非法结尾字符
 * @param {String} str  需要去除非法结尾的字符串
 */
function removeIllegalSign(str) {
    str = str.replace(/\,[\s]*(?=\})/g, sign => sign.replace(/\,/g, ''));
    return str.replace(/(?<=[\}\]])[\s]*\,[\s]*(?=[\}\]])/, sign => sign.replace(/\,/g, ''))
}

/**
 * 将一个字符串去除掉函数声明   因为json文件中禁止 函数声明 编译不通过
 * @param {String} str  需要去除函数的字符串
 */
function removeFunction(str){
    str= str.replace(/(?<=[{[,])[^{[,]*?function[\S\s]*?\}[\s]*,?/g,'');      //先去除带有function 的函数
    str=str.replace(/(?<=[{[,])[^{[,]*?\([^\(\)]*\)\s*{[\S\s]*?\}[\s]*,?/g,'');     //去除不带function关键字只有一个括号的函数
    str=str.replace(/(?<=[{[,])[^{[,]*?\:[\s]*\([^\(\)]*\)[\s]*\=\>[\s]*{[\S\s]*?\}[\s]*,?/g,'');   //去除不带function关键字只有一个括号和箭头的函数
    str=str.replace(/(?<=[{[,])[^{[,]*?\:[\s]*[a-zA-Z]+[\s]*\=\>[\s]*{[\S\s]*?\}[\s]*,?/g,'');  //去除箭头函数
    return str;
}
/**
 * 自动补全和删除不满足规则的前置路径
 * @param {String} key 当前需要替换的字符串 类型
 * @param {String} str 需要补全替换的字符串 
 * @param {String} publicPath 开发者预设的前置公共路径
 */
function pathPatch(key,str,publicPath){
    if(key.trim()!=='pages'){       //不是path  我们啥都不做
        return str;
    }
    return str.replace(/(?<=path[\W\s]*\:[\W\s]*)[^'"]+/g,sign=>{
        if(sign.trim()==''){
            return ''
        }
        sign= sign.replace(/^\//,'');        //先去除 / 开头
        return publicPath+sign;
    })
}
module.exports={
    removeIllegalSign,
    removeFunction,
    pathPatch
}