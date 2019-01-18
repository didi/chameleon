#!/usr/bin/env node
const path = require('path');
const program = require('commander');
const packageJson = require('../package.json');
const Parser = require('../index');

program
  .version(packageJson.version)
  .usage('-i <dir> -o <dir> -f [format] -n [fileName]')
  .option('-i, --in-dir <dir>', 'The directory which contians components with interface files.')
  .option('-o, --out-dir <dir>', 'The directory which is used as output readme files folder.')
  .option('-f, --out-format [format]', 'The file format for output files, default type is markdown. valid values are: markdown or json.')
  .option('-n, --file-name [fileName]', 'If this option is set, then all outputs will be written into one single file named with file name value.')
  .parse(process.argv);

let inDir = program.inDir;
let outDir = program.outDir;
let outFormat = program.outFormat || 'markdown';
let fileName = program.fileName || '';
let isSingleFile = !!fileName;
let isMarkdown = outFormat === 'markdown';
let parser = new Parser();

if (inDir.indexOf('components') === -1) {
  inDir = path.resolve(process.cwd(), inDir, 'components');
} else {
  inDir = path.resolve(process.cwd(), inDir);
}

outDir = path.resolve(process.cwd(), outDir);

let singleFileContent = isMarkdown ? [] : {};

Parser.flatEntrance(inDir).forEach(async (interfaceFile) => {
  if (isSingleFile) {
    let content = parser.resetPath(interfaceFile)[isMarkdown ? 'getReadmeContent' : 'getJsonResultsWithComponentName']();
    isMarkdown ? singleFileContent.push(content) : (singleFileContent[content.name] = content.content);
  } else {
    await parser.resetPath(interfaceFile)[isMarkdown ? 'writeReadmeFileToDir' : 'writeJsonFileToDir'](outDir, fileName);
  }
});

// If output is targeted as single file, then write all content at this point once.
if (isSingleFile) {
  isMarkdown && (singleFileContent = singleFileContent.join(outFormat === 'json' ? ',\n' : '\n\n'));
  !isMarkdown && (singleFileContent = JSON.stringify(singleFileContent, null, '\t'));
  parser[outFormat === 'markdown' ? 'writeReadmeFileToDir' : 'writeJsonFileToDir'](outDir, fileName, singleFileContent)
    .then((res) => {
      console.info(`write ${outFormat} content into file ${fileName} ` + res);
      return res;
    })
    .catch((err) => {
      console.error(err.message);
    });
}
