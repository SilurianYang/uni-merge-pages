const path = require('path');
const fs = require('fs-extra');

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
                    const fileArray= await new Promise((next, reject1) => {
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
                    Filelist=Filelist.concat(fileArray);
                }
                resolve(Filelist);
            }
        });
    })
}

module.exports = {
    fileDisplay
}