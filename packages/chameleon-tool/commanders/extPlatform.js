

module.exports = function({type, media}) {
  const utils = require('./utils.js');
  cml.media = media;
  utils.startReleaseOne(media, type);
}