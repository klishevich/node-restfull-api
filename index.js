const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

const server = http.createServer((req, res) => {
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

    // console.log(`Request received on path "${trimmedPath}" with method "${method}" and query "${JSON.stringify(queryStringObj)}"`);
    // console.log(`Request received headers ${JSON.stringify(headers)}`);
});

server.listen(config.port, () => {
    console.log(`Server listening on port ${config.port} in config.envName ${config.envName}\n`);
});

// DEFINE HANDLERS
const handlers = {};

// Sample handler
handlers.sample = (data, callback) => {
    callback(406, { name: 'sample handler'});
}

handlers.notFound = (data, callback) => {
    callback(404);
}

const router = {
    sample: handlers.sample
}
