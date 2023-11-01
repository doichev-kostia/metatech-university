'use strict';

const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const { Readable } = require('node:stream');

const MIME_TYPES = {
  default: 'application/octet-stream',
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  json: 'application/json',
  css: 'text/css',
  png: 'image/png',
  jpg: 'image/jpg',
  gif: 'image/gif',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
};

const folderIndex = (staticPath) =>  (folder) => new Readable({
  async read() {
    const files = [];
    const folders = [];
    const rel = folder.substring(staticPath.length);
    const items = await fs.promises.readdir(folder, { withFileTypes: true });
    for (const item of items) {
      if (item.isDirectory()) folders.push(item.name + '/');
      else files.push(item.name);
    }
    const list = folders.concat(files)
        .map((item) => `<li><a href="${rel}/${item}">${item}</a></li>`)
        .join('\n');
    this.push(`<h2>Directory index:</h2><ul>${list}</ul>`);
    this.push(null);
  }
});

const prepareFile = async (staticPath, url) => {
  const name = url === '/' ? '/index.html' : url;
  const filePath = path.join(staticPath, name);
  const pathTraversal = !filePath.startsWith(staticPath);
  const stat = await fs.promises.lstat(filePath).catch(() => false);
  const exists = !!stat;
  const isDirectory = stat && stat.isDirectory();
  const found = !pathTraversal && exists;
  const streamPath = found ? filePath : staticPath + '/404.html';
  const ext = path.extname(streamPath).substring(1).toLowerCase();
  const factory = isDirectory ? folderIndex(staticPath) : fs.createReadStream;
  const stream = factory(streamPath);
  return { found, ext: isDirectory ? 'html' : ext, stream };
};

module.exports = (root, port) => {
  http.createServer(async (req, res) => {
    const file = await prepareFile(root, req.url);
    const statusCode = file.found ? 200 : 404;
    const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
    res.writeHead(statusCode, { 'Content-Type': mimeType });
    file.stream.pipe(res);
    console.log(`${req.method} ${req.url} ${statusCode}`);
  }).listen(port);

  console.log(`Static on port ${port}`);
};
