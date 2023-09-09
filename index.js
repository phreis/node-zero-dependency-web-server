import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import url from 'node:url';

// maps file extension to MIME typere
const map = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
};

const serverConfig = { host: '127.0.0.1', port: '3000' };
const rootDir = './public';

// instantiate a server
const server = http.createServer(requestListener);

// start server
server.listen(serverConfig.port, serverStarted);

// define listener function
function requestListener(req, res) {
  console.log(`${req.method} ${req.url}`);

  // parse URL
  const parsedUrl = url.parse(req.url);

  // extract URL path
  const requestedFilePath = parsedUrl.pathname;

  // based on the URL path, extract the file extension. e.g. .js, .doc, ...
  // defaults to .html
  const ext = path.parse(requestedFilePath).ext
    ? path.parse(requestedFilePath).ext
    : '.html';

  let absoluteFilePath = `${rootDir}${requestedFilePath}`;

  try {
    if (!fs.existsSync(absoluteFilePath)) {
      // if the file is not found, return 404
      res.statusCode = 404;
      res.end(`File ${absoluteFilePath} not found!`);
      return;
    }
  } catch (err) {
    console.error(err);
  }

  // if is a directory search for index file matching the extension
  if (fs.statSync(absoluteFilePath).isDirectory()) {
    absoluteFilePath += '/index' + ext;
  }

  // read file from file system
  fs.readFile(absoluteFilePath, function (err, data) {
    if (err) {
      res.statusCode = 500;
      res.end(`Error getting the file: ${err}.`);
    } else {
      // if the file is found, set Content-type and send data
      res.setHeader('Content-type', map[ext] || 'text/plain');
      res.end(data);
    }
  });
}

// function to be called after server has been started
function serverStarted() {
  console.log(`Server startet on ${serverConfig.host}:${serverConfig.port}`);
}
