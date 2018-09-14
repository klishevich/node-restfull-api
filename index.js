const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
    // console.log(`Request received on path "${trimmedPath}" with method "${method}" and query "${JSON.stringify(queryStringObj)}"`);
    // console.log(`Request received headers ${JSON.stringify(headers)}`);
});

httpServer.listen(config.httpPort, () => {
    console.log(`Server listening on port ${config.httpPort}\n`);
});


const httpsServerOptions = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem')
}
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req, res);
});

httpsServer.listen(config.httpsPort, () => {
    console.log(`Server listening on port ${config.httpsPort}\n`);
});


const unifiedServer = function(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObj = parsedUrl.query;
    const headers = req.headers;

    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        // buffer += decoder.end(); Seems we do not need that

        const chosenHandler = router[trimmedPath] || handlers.notFound;
        const data = {
            trimmedPath,
            queryStringObj,
            method,
            headers,
            payload: buffer
        };
        chosenHandler(data, (statusCode, payload) => {
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
            payload = typeof(payload) === 'object' ? payload : {};
            const payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log('Response', statusCode, payloadString);
        });

        // console.log('Buffer JSON', JSON.parse(buffer));
    });
}

// DEFINE HANDLERS
const handlers = {};

// Sample handler
handlers.ping = (data, callback) => {
    callback(200);
}

handlers.notFound = (data, callback) => {
    callback(404);
}

const router = {
    ping: handlers.ping
}
