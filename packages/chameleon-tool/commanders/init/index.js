let fs = null;
let path = null;
let tpl = null;
let inquirer = null;
let ora = null;
let shelljs = null;
let fse = null;
let chalk = null;
let glob = null;
const platformMap = require('./platform.json');
const platformTotal = 5;

exports.name = 'init';
exports.usage = '[command] [options]';
exports.desc = 'initialize template for chameleon project';
const cmdOptions = {
  lang: 'cml',
  tpl: 'html',
  demo: 'blank'
}
exports.register = function (commander) {
  commander
    .option('-r, --root [root]', 'specify project root')
    .option('-g, --lang [cml|vue]', 'specify project template default language, example: cml init project -g vue ')
    .option('-t, --tpl [html|smarty]', 'specify project templateType, example: cml init project -t html')
    .option('-d, --demo [blank|todo]', 'specify init project demo, example: cml init project -d todo ')
  commander
    .action(function (...args) {
      /* eslint-disable */
      fs = require('fs');
      path = require('path');
      tpl = require('chameleon-templates');
      inquirer = require('inquirer');
      ora = require('ora');
      shelljs = require('shelljs');
      fse = require('fs-extra');
      glob = require('glob');
      chalk = require('chalk');
      /* eslint-disable */

      // 不能删除
      var options = args.pop(); // eslint-disable-line 
      if (options.lang === 'vue') {
        cmdOptions.lang = options.lang;
      }
      if (options.tpl === 'smarty') {
        cmdOptions.tpl = options.tpl;
      }
      if (~['todo'].indexOf(options.demo)) {
        cmdOptions.demo = options.demo;
      }
      var type = args.shift();
      if (type) {
        initMethod(type);
      } else {
        let questions = [{
          type: 'list',
          name: 'type',
          message: 'Which do you want to init?',
          choices: [
            'project',
            'page',
            'component'
          ]
        }]
        inquirer.prompt(questions).then(answers => {
          initMethod(answers.type)
        })

      }
    })

  commander.on('--help', function() {
    var cmd = `
  Commands:
    project   initialize a chameleon project
    page      initialize a chameleon page in project
    component initialize a chameleon component in project
    server    initialize the php server for dev
  Examples:
    cml init project
    cml init page
    cml init component
  `
    console.log(cmd)
  })

  function initMethod(type) {
    if (!~['project', 'page', 'component'].indexOf(type)) {
      cml.log.error(`init type must in ['project', 'page', 'component']`);
      return;
    }
    if (type !== 'project') {
      cml.utils.checkProjectConfig();
    }
    switch (type) {
      case 'project':
        initProject();
        break;
      case 'page':
        initPage();
        break;
      case 'component':
        initComponent();
        break;
      default: break;
    }
  }

  function initProject() {
    let questions = [
      // {
      //   type: 'checkbox',
      //   name: 'platforms',
      //   message: '请选择项目需要支持的平台，默认已全选',
      //   choices: [
      //     'h5',
      //     'weex',
      //     '微信小程序'
      //   ],
      //   validate: function(value) {
      //     value = value || [];
      //     if (value.length === 0) {
      //       return '至少选择一个平台'
      //     }
      //     return true;
      //   },
      //   default: ['h5', 'weex', '微信小程序']
      // },
      {
        type: 'input',
        name: 'projectName',
        message: '请输入项目名称',
        validate: function (value) {
          if (!value) {
            return 'project name can not be empty'
          }
          let nameReg = /^[0-9a-zA-Z_\-\.]+$/;
          if (!nameReg.test(value)) {
            return `project name characters must only in [0-9a-zA-Z_\-\.]`
          }

          if (fs.existsSync(value)) {
            return 'There is already a project with the same name in the current directory,please change one'
          }

          return true;
        }
      }
    ]

    inquirer.prompt(questions).then(answers => {
      let {projectName } = answers;
      let platforms = ['h5', 'weex', '微信小程序','支付宝小程序','百度小程序'];
      let templateType = cmdOptions.tpl;
      let templateLang = cmdOptions.lang;
      platforms = platforms.map(item => platformMap[item]);
      let pagedir = path.join(cml.projectRoot, projectName);
      let projectMap = {
        blank: tpl.blankDemoTpl,
        todo: tpl.todoDemoTpl
      }
      let projectTpl = projectMap[cmdOptions.demo];

      fse.copySync(projectTpl, pagedir);
      // package.json文件中的name需要更改
      var packagePath = path.join(pagedir, 'package.json');
      let packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      packageContent.name = projectName;
      fs.writeFileSync(packagePath, JSON.stringify(packageContent, '', 2))

      // 修改配置文件
      let configFile = path.join(pagedir, 'chameleon.config.js');
      let content = fs.readFileSync(configFile, {encoding: 'utf-8'}).replace(/templateLang\s*:\s*["'](cml|vue)["']/g, function() {
        return `templateLang: "${templateLang}"`
      })
        .replace(/templateType\s*:\s*["'](smarty|html)["']/g, function() {
          return `templateType: "${templateType}"`
        })
        .replace(/platforms\s*:\s*\[(.+?)\]/g, function() {
          return `platforms: ${JSON.stringify(platforms)}`
        })
      fs.writeFileSync(configFile, content);

      var npmignore = path.join(pagedir, '.npmignore');

      // npm包中的.gitignore变成了.npmignore
      if (cml.utils.isFile(npmignore)) {
        fse.moveSync(npmignore, path.join(pagedir, '.gitignore'));
      }
      // 处理平台文件
      if (platforms.length < platformTotal) {
        let { ignorePlatform, ignoreReg } = getIgnorePlatform(platforms);
        let currentPlatforms = platforms;
        let currentReg = new RegExp(`\\.(${currentPlatforms.join('|')})\\.cml$`);
        // 处理.cml文件
        let cmlFilePath = path.join(pagedir, '**/*.cml');
        glob.sync(cmlFilePath).forEach(cfp => {
          // 删除忽略平台的文件
          if (ignoreReg.test(cfp)) {
            fse.removeSync(cfp);
          } else {
            if (cfp.endsWith('.cml') && !currentReg.test(cfp)) {
              let content = fs.readFileSync(cfp, {encoding: 'utf-8'});
              let splitContent = cml.utils.getScriptPart({content, cmlType: 'json'});
              let jsonObj = JSON.parse(splitContent.content);
              ignorePlatform.forEach(item => {
                delete jsonObj[item];
              });
              content = content.replace(splitContent.content, `\n${JSON.stringify(jsonObj, null, 2)}\n`);
              fs.writeFileSync(cfp, content);
            }
          }
        })
        // 处理 .interface文件
        let interfaceFilePath = path.join(pagedir, '**/*.interface');
        glob.sync(interfaceFilePath).forEach(ifp => {
          content = fs.readFileSync(ifp, {encoding: 'utf-8'});
          ignorePlatform.forEach(item => {
            content = cml.utils.deleteScript({
              content,
              cmlType: item
            });
          });

          fs.writeFileSync(ifp, content);
        })

      }

      const installSpinner = ora('npm installing...').start()
      const install = shelljs.exec(`cd ${projectName} && npm install`, {
        silent: true
      })
      if (install.code === 0) {
        installSpinner.color = 'green'
        installSpinner.succeed('install success')
        console.log(chalk.yellow('To get started:\n'))
        console.log(chalk.yellow(`cd ${projectName}\n`))
        console.log(chalk.yellow(`cml dev\n`))
        // installSpinner.succeed(`Please exec: cd ${projectName}; cml dev`)
        // console.log(`${install.stderr}${install.stdout}`)
      } else {
        installSpinner.color = 'red'
        installSpinner.fail(chalk.red('install fail, please exec npm install youself'))
        console.log(`${install.stderr}${install.stdout}`)
      }
    })


  }

  function initPage() {
    let questions = [{
      type: 'input',
      name: 'pageName',
      message: 'please input page name:',
      validate: function (value) {
        if (!value) {
          return 'page name can not be empty'
        }

        if (fs.existsSync(path.join(cml.projectRoot, `src/pages/${value}`))) {
          return 'There is already a page with the same name in the current project, please change one'
        }
        return true;
      }
    }]

    inquirer.prompt(questions).then(answers => {
      let {pageName} = answers;
      let pagedir = path.join(cml.projectRoot, `src/pages/${pageName}`)
      let UpperName = toUpperCase(pageName);
      fs.readdirSync(tpl.pageTpl).forEach(fileName => {
        let filePath = path.join(tpl.pageTpl, fileName);
        let newFilePath = path.join(pagedir, fileName.replace('index', pageName));
        let content = fs.readFileSync(filePath, {encoding: 'utf-8'}).replace(/Replace/ig, UpperName);
        if (cml.config.get().templateLang === 'vue') {
          content = content.replace(/<template>/, '<template lang="vue">')
        }
        content = contentIgnoreHanle(content, 'cml');
        fse.outputFile(newFilePath, content);

      })
      cml.log.notice(`init page ${pageName} success!`)
    })
  }

  function initComponent() {
    let questions = [{
      type: 'list',
      name: 'componentType',
      message: 'please select the type of component',
      choices: [
        'normal-component',
        'multimode-component',
        'multimode-interface'
      ]
    }, {
      type: 'input',
      name: 'componentName',
      message: 'please input component name:',
      validate: function (value) {
        if (!value) {
          return 'component name can not be empty'
        }

        if (fs.existsSync(path.join(cml.projectRoot, `src/components/${value}`))) {
          return 'There is already a component with the same name in the current project, please change one'
        }

        return true;
      }
    }]

    inquirer.prompt(questions).then(answers => {
      let {componentName, componentType} = answers;
      let comdir = path.join(cml.projectRoot, `src/components/${componentName}`);
      let comPathMap = {
        'normal-component': 'component',
        'multimode-component': 'interface-component',
        'multimode-interface': 'interface-js'
      }
      let tplPath = path.join(tpl.componentTpl, comPathMap[componentType]);
      let UpperName = toUpperCase(componentName);
      let { ignoreReg } = getIgnorePlatform();
      fs.readdirSync(tplPath).forEach(fileName => {
        if (ignoreReg.test(fileName)) {
          return;
        }
        let filePath = path.join(tplPath, fileName);
        let newFilePath = path.join(comdir, fileName.replace('index', componentName));
        let content = fs.readFileSync(filePath, {encoding: 'utf-8'}).replace(/Replace/ig, UpperName);
        if (cml.config.get().templateLang === 'vue') {
          content = content.replace(/<template>/, '<template lang="vue">')
        }
        if (newFilePath.endsWith('.cml')) {
          content = contentIgnoreHanle(content, 'cml');
        }
        if (newFilePath.endsWith('.interface')) {
          content = contentIgnoreHanle(content, 'interface');
        }
        fse.outputFile(newFilePath, content);
      })
      cml.log.notice(`init component ${componentName} success!`)
    })
  }

  function toUpperCase(content) {
    content = content[0].toUpperCase() + content.slice(1);
    return content.replace(/-(\w)/ig, function(m, s1) {
      return s1.toUpperCase()
    })
  }

  function getIgnorePlatform(platforms) {
    platforms = platforms || cml.config.get().platforms.map(item => item.trim());
    let platformValues = Object.values(platformMap);
    let ignorePlatform = platformValues.filter(item => platforms.indexOf(item) === -1);
    let ignoreReg = new RegExp(`\\.(${ignorePlatform.join('|')})\\.cml$`);
    return {
      ignorePlatform,
      ignoreReg
    }
  }
  // 处理文件
  function contentIgnoreHanle(content, type) {
    let { ignorePlatform } = getIgnorePlatform();
    if (type === 'interface') {
      ignorePlatform.forEach(item => {
        content = cml.utils.deleteScript({
          content,
          cmlType: item
        });
      });
    } else if (type === 'cml') {
      let splitContent = cml.utils.getScriptPart({content, cmlType: 'json'});
      if (splitContent) {
        let jsonObj = JSON.parse(splitContent.content);
        ignorePlatform.forEach(item => {
          delete jsonObj[item];
        });
        content = content.replace(splitContent.content, `\n${JSON.stringify(jsonObj, null, 2)}\n`);
      }
    }
    return content;
  }

}
