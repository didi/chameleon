#! /usr/bin/env node
const path = require('path');
const fs = require('fs')
var exec = require('child_process').exec
let context = process.cwd();
let jsonFile = path.join(context,'./package.json');
let packageObj = JSON.parse(fs.readFileSync(jsonFile,{encoding: 'utf-8'}));
let {devDependencies = {}, dependencies = {}} = packageObj;
const ora = require('ora');
const program = require('commander');
let npmClient = 'npm';
program
    .version(require('../package.json').version)
    .option('--npm-client [client]', 'choose npm client')
    .action(() => {
      if (program.npmClient.indexOf('yarn') !== -1) {
        console.error('Not support yarn as npm client for now.');
        process.exit(-1);
      }
      npmClient = program.npmClient;
    });
program.parse(process.argv);
//项目中存在的依赖
let hasDeps = {
  ...devDependencies,
  ...dependencies
}

let requireDeps = {
}

let devRequire = {
  "babel-plugin-chameleon-import": "0.0.24",
  "babel-plugin-transform-remove-strict-mode": "0.0.2",
  "babel-plugin-transform-runtime": "^6.23.0",
  "babel-preset-env": "^1.7.0",
  "babel-preset-flow": "^6.23.0",
  "babel-preset-stage-0": "^6.24.1",
 
  "autoprefixer": "8.6.4",
  "css-hot-loader": "1.3.9",
  "css-loader": "0.28.11",
  "less": "3.0.4",
  "less-loader": "4.1.0",
  "postcss-import": "11.1.0",
  "postcss-loader": "2.1.5",
  "postcss-plugin-px2rem": "0.7.0",
  "postcss-plugin-weex": "0.1.6",
  "style-loader": "0.18.2",
  "vue-loader": "14.2.3",
}


let depInstall = [];
let devDepInstall = [];

Object.keys(requireDeps).forEach(key=>{
  let value = requireDeps[key];
  if(!hasDeps[key]) {
    depInstall.push({
      key,
      value
    })
  }
})

Object.keys(devRequire).forEach(key=>{
  let value = devRequire[key];
  if(!hasDeps[key]) {
    devDepInstall.push({
      key,
      value
    })
  }
})


let depInstallPromise = new Promise(function(resolve, reject){
  if(depInstall.length === 0) {
    resolve(depInstall.length);
  } else {
    let npmlist = depInstall.map(item=>{
      return item.key + '@' + item.value
    }).join(' ')
    let installcml = `${npmClient} i ${npmlist}`
    exec(installcml,function(err, stdot) {
      if(err) {
        reject(err)
      } else {
        resolve(depInstall.length)
      }
    })
  }
})

let devDepInstallPromise = new Promise(function(resolve, reject){
  if(devDepInstall.length === 0) {
    resolve(devDepInstall.length);
  } else {
    let npmlist = devDepInstall.map(item=>{
      return item.key + '@' + item.value
    }).join(' ')
    let installcml = `${npmClient} i ${npmlist} --save-dev `
    exec(installcml,function(err, stdot) {
      if(err) {
        reject(err)
      } else {
        resolve(devDepInstall.length)
      }
    })
  }
})

const installSpinner = ora(`${npmClient} dependencies installing...`).start()

depInstallPromise.then(res=>{
  installSpinner.succeed('dependencies install success')

  depInstall.forEach(item=>{
    installSpinner.succeed(`${item.key}@${item.value}`)
  })
  const devSpinner = ora(`${npmClient} devDependencies installing...`).start()
  devDepInstallPromise.then(res=>{

    devSpinner.succeed('devDependencies install success')
    devDepInstall.forEach(item=>{
      devSpinner.succeed(`${item.key}@${item.value}`)
    })
  },err=>{
    throw err;
  })
},err=>{
  throw err;
})





