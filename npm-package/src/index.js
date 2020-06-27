const fs = require('fs-extra')
const _ = require('lodash');
const chalk = require('chalk');
const {resolve} = require('path');
const {fileDisplay,strToPagesJson,updateProgress,stopProgress} = require('./util');
const {removeIllegalSign,removeFunction,pathPatch} = require('./util/RegExp');
const rootPath = process.cwd(); //当前用户项目根目录
const pagesJsonPath=resolve(rootPath,'./pages.json');       //需要写入的pages.json 目录
const cacheJsonPath=resolve(__dirname,'../cache.config.json');      //缓存文件路径
const log = console.log;


/**
 * 遍历制定目录并提取指定文件的内容
 * @param {Array} includes 开发者预设的监控文件集合
 * @param {String} watchDisFile 需要遍历的文件目录
 */
 function getDisFileCont(includes,watchDisFile){
    return new Promise(async resolve=>{
        let fileList= await fileDisplay(watchDisFile.replace(/\*/,''));
        let codeStr='';
        if(includes.length!=0){     //开发者有传递指定文件时 筛选出来
            fileList= _.intersection(fileList,includes);
        }
        for(let i=0;i<fileList.length;i++){
            let str=`!${await fs.readFile(fileList[i], 'utf8')}`;
            str=str.replace(/\w+(?=\:)/g,function(it){
                return `"${it}"`
            })
            codeStr+=str;
        }
        resolve(codeStr);
    })
}
/**
 * 通过字符串提取指定内容 到pages.json中可用的数据
 * @param {String} codeStr 已经提取出来的字符窜
 * @param {Object} rule 需要遍历的正则规则集合
 * @param {String} publicPath  补全的前部分路径
 */
function strGetValue(codeStr,rule,publicPath){
    let valueStr=``;
    for(let [key,reg] of Object.entries(rule)){
        codeStr=codeStr.replace(eval(reg),function(value){
            value=removeFunction(value);        //先进行函数去除 在pages.json文件中禁止出现 函数声明
            value=pathPatch(key,value,publicPath);         //补全和去除不满足pages.json的规则路径
            value=value.replace(/\'/g,"\"");
            if(key === 'pagesother'){       //其他配置直接读取json 不用管条件编译
                let otherJSON='';
                eval(`((json=${value})=>{otherJSON=json})()`);
                Object.entries(otherJSON).forEach(it=>{
                    const [k,val]=it;
                    valueStr+=`"${k}":${JSON.stringify(val)},`
                })
            }else{
                value=removeIllegalSign(value);     //去除非法字符结尾
                valueStr+=`"${key}":${value},`
            }
            return ''
        })
    }
    return valueStr.replace(/\,$/,'');
}
/**
 * 获取到开发者目录下的pages.json内容
 */
function getPagesStr(){
    return new Promise(async (resolve,reject)=>{
        try {
            let pagesStr= await fs.readFile(pagesJsonPath,'utf8');
            if(pagesStr.trim()==''){
                pagesStr='{}';  
            }     
            resolve(pagesStr);
        } catch (error) {
            log(chalk.red.bold(`配置文件 pages.json 读取失败，请检查文件内容是否正确或者文件是否存在`));
            log(error)
            reject();
        }
    })
}

(async ()=>{
    updateProgress(true);       //更新进度条
    const cacheJson= await fs.readJson(cacheJsonPath);
    const {
        uniConfigJsPath,
        publicPath,
        includes,
        nodemon:{
            watch:[watchDisFile]
        } 
    }=cacheJson;
   const pagesStr=await getPagesStr();
   const codeStr=await getDisFileCont(includes,watchDisFile);
   const writePagesStr=strGetValue(codeStr,cacheJson.rule,publicPath);
   const finalData=await new Promise (resolve=>{        //获取到开发者格式后的数据 最终的数据 直接写入
            const {transformHook}= require(uniConfigJsPath);      //读取用户 uni.config.js 下的构建生命周期
            if(transformHook==null || transformHook.constructor!==Function){
                    return resolve(writePagesStr);
            }
            transformHook(pagesStr,writePagesStr,resolve);
        })
   try {
    await strToPagesJson({
        path:pagesJsonPath,
        writeStr:finalData
    });
   } catch (error) {
    log(chalk.red.bold(`写入 pages.json 失败。`));
    log(error)
   }
   stopProgress();
})()