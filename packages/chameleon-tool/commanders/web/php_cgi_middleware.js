

var phpcgi = require('node-phpcgi');

module.exports = function(root) {
  return phpcgi({
    documentRoot: root,
    entryPoint: '/index.php',
    includePath: '/',
    handler: 'php-cgi'
  })
}
