#! /usr/bin/env node

const {resolve} = require('path');
const {
    argv: {
        config: configPath,
        watch: watchPath,
    }
} = require('yargs');
const _ = require('lodash');
const fs = require('fs-extra')
const shell = require("shelljs");
const chalk = require('chalk');
const CONFIG = require('../src/config');
const rootPath = process.cwd(); //当前用户项目根目录

const evalJsPath = resolve(__dirname, '../src/index.js'); //内部执行入口js
const monConfigPath = resolve(__dirname, '../nodemon.json'); //获取到nodemon 默认配置
let uniConfigJsPath = resolve(rootPath, './uni.config.js'); //获取到用户定义配置文件 uni.config.js
let uniConfigJSON = {}; //uni.config.js内容

(async () => {
    if (configPath === true || configPath == null) {
        const exists = await fs.pathExists(uniConfigJsPath);
        if (!exists) { //文件不存在的时候
            return console.log(chalk.red.bold(`配置文件 uni-config.js 不存在，请配置或者通过命令行传递 --config`))
        }
    } else {
        uniConfigJsPath = resolve(rootPath, configPath);
    }

    try {
        uniConfigJSON = require(uniConfigJsPath); //开始读取 配置文件内容 uni.config.js
        if (watchPath === true || watchPath == null) { //没有通过cli传递的 watch 读取 配置文件中的
            if (uniConfigJSON.nodemon == null) {
                return console.log(chalk.red.bold(`nodemon节点不存在且 watch 目录不存在，请检查配置`))
            }
            if (uniConfigJSON.nodemon !=null&&uniConfigJSON.nodemon.watch==null) {
                return console.log(chalk.red.bold(`watch 目录不存在，请检查配置`))
            }
        } else {
            if(uniConfigJSON.nodemon==null){
                CONFIG.nodemon={};
            }
            uniConfigJSON.nodemon.watch=[resolve(rootPath, watchPath)];
        }

    } catch (error) {
        console.error(error)
        return console.log(chalk.red.bold(`配置文件读取失败，请检查配置文件`))
    }
    const nodemonJSON = await fs.readJson(monConfigPath);
    _.merge(CONFIG, uniConfigJSON); //将配置合并
    _.merge(nodemonJSON, CONFIG.nodemon); //将配置合并 nodemon.json
    try {
        await fs.writeJson(monConfigPath, nodemonJSON);
    } catch (error) {
        console.error(error)
        return console.log(chalk.red.bold(`写入 nodemon.json 失败，请检查 config.js 配置`))
    }
    for(let [key,value] of Object.entries(CONFIG.rule)){
        CONFIG.rule[key]=value.toString();
    }
    await fs.writeJson(resolve(__dirname, '../cache.config.json'),{...CONFIG,uniConfigJsPath});  //写入到缓存文件中
    shell.exec(`nodemon ${evalJsPath} --config ${monConfigPath}`);
})()