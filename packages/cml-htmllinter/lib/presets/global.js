var proc = require('../process_option');

module.exports = {
  'template-lang': {
    process: proc.str
  },
  'platform-lang': {
    process: proc.str
  },
  'origin-tag-list': {
    process: proc.arrayOfStr
  }
}