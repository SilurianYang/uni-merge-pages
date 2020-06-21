const fs = require('fs-extra')
const _ = require('lodash');
const {resolve} = require('path');
const {fileDisplay} = require('./util');
const rootPath = process.cwd(); //当前用户项目根目录
const cacheJsonPath=resolve(__dirname,'../cache.config.json');      //缓存文件路径

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
            codeStr+=`\r\n!${await fs.readFile(fileList[i], 'utf8')}`
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
    const valueList=[];
    for(let [key,reg] of Object.entries(rule)){
        codeStr=codeStr.replace(eval(reg),function(value){
            valueList.push({
                [key]:value,
            })
            return ''
        })
    }
    return valueList;
}

(async ()=>{
    const cacheJson= await fs.readJson(cacheJsonPath);
    const {
        includes,
        nodemon:{
            watch:[watchDisFile]
        } 
    }=cacheJson;
   const codeStr=await getDisFileCont(includes,watchDisFile);
   strGetValue(codeStr,cacheJson.rule);
})()