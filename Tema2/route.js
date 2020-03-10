const http = require('http');
const url = require('url');

module.exports = http.createServer((req, res) => {
    var userOps = require('./controller.js');
    const reqUrl = url.parse(req.url, true);
    console.log('Request type:' + req.method + ' Endpoint: ' + req.url);
    if (reqUrl.pathname === '/users') {
        if (req.method === 'GET')
            userOps.getUsers(req, res);
        if (req.method === 'POST')
            userOps.postUsers(req, res);
        if (req.method === 'DELETE')
            userOps.delete(req, res);
        if (req.method === 'PUT')
            userOps.put(req, res);
    } else {
        link = reqUrl.pathname.split('/');
        if (link[1] === 'users' && link.length === 3) {
            if (req.method === 'GET')
                userOps.getUserById(req, res, link[2]);
            if (req.method === 'POST')
                userOps.postUserById(req, res, link[2]);
            if (req.method === 'DELETE')
                userOps.deleteUserById(req, res, link[2]);
            if (req.method === 'PUT')
                userOps.putUserById(req, res, link[2]);
        } else
            userOps.errorEndpoint(req, res);
    }
});