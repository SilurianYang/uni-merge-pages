const path = require('path');
const fs = require('fs-extra');
const progressBar = require('./progress-bar.js');

const progress = new progressBar('正在构建', 0);
const progressTotal = 100;
let [speed, clearStop] = [0, null];

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay(filePath) {
    return new Promise((resolve, reject) => {
        fs.readdir(filePath, async function (err, files) {
            if (err) {
                console.log('获取文件列表错误')
                reject(err);
            } else {
                let Filelist = [];
                if (files.length == 0) {
                    return resolve([]);
                }
                //遍历读取到的文件列表
                for (let i = 0; i < files.length; i++) {
                    //获取当前文件的绝对路径
                    const filedir = path.join(filePath, files[i]);
                    //根据文件路径获取文件信息，返回一个fs.Stats对象
                    const fileArray = await new Promise((next, reject1) => {
                        fs.stat(filedir, async function (eror, stats) {
                            if (eror) {
                                console.warn('获取文件stats失败');
                                reject1(eror);
                            } else {
                                const isFile = stats.isFile(); //是文件
                                const isDir = stats.isDirectory(); //是文件夹
                                if (isFile) {
                                    next([filedir]);
                                }
                                if (isDir) {
                                    const Filelist = await fileDisplay(filedir);
                                    next(Filelist) //递归，如果是文件夹，就继续遍历该文件夹下面的文件
                                }
                            }
                        })
                    })
                    Filelist = Filelist.concat(fileArray);
                }
                resolve(Filelist);
            }
        });
    })
}
/**
 * 将一个字符串格式化为正在的json 去除非法结尾字符
 * @param {String} str  需要去除非法结尾的字符串
 */
function removeIllegalSign(str) {
    str = str.replace(/\,[\s]*(?=\})/g, sign => sign.replace(/\,/g, ''));
    return str.replace(/(?<=[\}\]])[\s]*\,[\s]*(?=[\}\]])/, sign => sign.replace(/\,/g, ''))
}

function updateProgress(reset=false) {
    if(reset){
        speed=0;
        progress.description='正在构建'
    }
    if (speed <= progressTotal) {
        progress.render({
            completed: speed,
            total: progressTotal
        });
        speed+=parseInt(Math.random()*50);
        clearTimeout(clearStop)
        clearStop = setTimeout(function () {
            updateProgress();
        }, 200)
    }else{
        stopProgress();
    }
}

function stopProgress(){
    progress.description='构建完成'
    speed=0;
    progress.render({
        completed: progressTotal,
        total: progressTotal
    });
    clearTimeout(clearStop)
}

function strToPagesJson({
    path,
    pagesStr,
    writeStr
}) {
    return new Promise(async (resolve, reject) => {
        try {
            await fs.outputFile(path, `{${writeStr}}`);
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    fileDisplay,
    strToPagesJson,
    removeIllegalSign,
    updateProgress,
    stopProgress
}