

module.exports = function({type, media}) {
  const utils = require('./utils.js');
  cml.media = media;
  cml.log.startBuilding();
  utils.startReleaseOne(media, type);
}