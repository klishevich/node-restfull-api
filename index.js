const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

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
        res.end('Hello world!\n');
        console.log(`Buffer ${buffer}`);
        // console.log('Buffer JSON', JSON.parse(buffer));
    });

    console.log(`Request received on path "${trimmedPath}" with method "${method}" and query "${JSON.stringify(queryStringObj)}"`);
    console.log(`Request received headers ${JSON.stringify(headers)}`);
});

server.listen(3000, () => {
    console.log('Server listening on port 3000 now\n');
});
