const fs = require('fs-extra')
const _ = require('lodash');
const chalk = require('chalk');
const {resolve} = require('path');
const {fileDisplay,strToPagesJson,removeIllegalSign,updateProgress,stopProgress} = require('./util');
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
 */
function strGetValue(codeStr,rule){
    let valueStr=``;
    for(let [key,reg] of Object.entries(rule)){
        codeStr=codeStr.replace(eval(reg),function(value){
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
        includes,
        nodemon:{
            watch:[watchDisFile]
        } 
    }=cacheJson;
   const pagesStr=await getPagesStr();
   const codeStr=await getDisFileCont(includes,watchDisFile);
   const writePagesStr=strGetValue(codeStr,cacheJson.rule);
   try {
    await strToPagesJson({
        path:pagesJsonPath,
        pagesStr,
        writeStr:writePagesStr
    });
   } catch (error) {
    log(chalk.red.bold(`写入 pages.json 失败。`));
    log(error)
   }
   stopProgress();
})()