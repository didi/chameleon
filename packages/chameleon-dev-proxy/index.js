'use strict';

require('babel-polyfill');



var tlsUtils = require('node-mitmproxy/lib/tls/tlsUtils');
var qrcode = require('qrcode-terminal');
var http = require('http');
var config = require('node-mitmproxy/lib/common/config');
var colors = require('colors');
var createRequestHandler = require('node-mitmproxy/lib/mitmproxy/createRequestHandler');
var createConnectHandler = require('node-mitmproxy/lib/mitmproxy/createConnectHandler');
var createFakeServerCenter = require('node-mitmproxy/lib/mitmproxy/createFakeServerCenter');
var createUpgradeHandler = require('node-mitmproxy/lib/mitmproxy/createUpgradeHandler');

module.exports = {
    createProxy: function createProxy(_ref) {
        var _ref$port = _ref.port;
        var port = _ref$port === undefined ? config.defaultPort : _ref$port;
        var caCertPath = _ref.caCertPath;
        var caKeyPath = _ref.caKeyPath;
        var sslConnectInterceptor = _ref.sslConnectInterceptor;
        var requestInterceptor = _ref.requestInterceptor;
        var responseInterceptor = _ref.responseInterceptor;
        var _ref$getCertSocketTim = _ref.getCertSocketTimeout;
        var getCertSocketTimeout = _ref$getCertSocketTim === undefined ? 1 * 1000 : _ref$getCertSocketTim;
        var _ref$middlewares = _ref.middlewares;
        var middlewares = _ref$middlewares === undefined ? [] : _ref$middlewares;
        var externalProxy = _ref.externalProxy;


        // Don't reject unauthorized
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

        //if (!caCertPath && !caKeyPath) {
        var rs = this.createCA(caCertPath);
        caCertPath = rs.caCertPath;
        caKeyPath = rs.caKeyPath;
        if (rs.create) {
            console.log(colors.cyan('CA Cert saved in: ' + caCertPath));
            console.log(colors.cyan('CA private key saved in: ' + caKeyPath));
        }
        //}

        port = ~~port;
        var requestHandler = createRequestHandler(requestInterceptor, responseInterceptor, middlewares, externalProxy);

        var upgradeHandler = createUpgradeHandler();

        var fakeServersCenter = createFakeServerCenter({
            caCertPath: caCertPath,
            caKeyPath: caKeyPath,
            requestHandler: requestHandler,
            upgradeHandler: upgradeHandler,
            getCertSocketTimeout: getCertSocketTimeout
        });

        var connectHandler = createConnectHandler(sslConnectInterceptor, fakeServersCenter);

        var server = new http.Server();
        server.listen(port, function () {
            let crlUrl = _ref.devServer + config.caCertFileName;
            console.log(colors.green('代理端口: ' + port));
            console.log(colors.green(`证书地址：${crlUrl}`));
            console.log(colors.green(`扫一扫安装证书：`));
            qrcode.generate(`${crlUrl}`, {small: true});
            server.on('error', function (e) {
                console.error(colors.red(e));
            });
            server.on('request', function (req, res) {
                var ssl = false;
                requestHandler(req, res, ssl);
            });
            // tunneling for https
            server.on('connect', function (req, cltSocket, head) {
                connectHandler(req, cltSocket, head);
            });
            // TODO: handler WebSocket
            server.on('upgrade', function (req, socket, head) {
                var ssl = false;
                upgradeHandler(req, socket, head, ssl);
            });
        });
    },
    createCA: function createCA() {
        var caBasePath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : config.getDefaultCABasePath();

        return tlsUtils.initCA(caBasePath);
    }
};