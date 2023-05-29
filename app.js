import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { readFileSync, writeFileSync } from 'fs';
import multer from 'multer';
import logger from './logger.js';

const PORT = parseInt(process.env.GEOLOCATION_PORT || '5040');
const HOST = process.env.GEOLOCATION_HOST || '127.0.0.1';

const uplaod = multer();

class App {
  constructor() {
    this.server = express();
    this.server.disable('x-powered-by');

    this.server.get('/', this.index.bind(this));
    this.server.get('/location', this.getLocation.bind(this));
    this.server.get('/setup', this.setup.bind(this));
    this.server.post('/setup', uplaod.none(), this.saveLocation.bind(this));
    this.server.get('/icon.png', this.getIcon.bind(this));

    this.server.use(this.errorHandler.bind(this));
  }

  start(port = PORT, host = HOST) {
    this.server.listen(port, host, () => {
      console.log(`App running on ${host}:${port}`);
    });
  }

  index(req, res) {
    res.sendFile('index.html', { root: process.cwd() });
  }

  setup(req, res) {
    res.sendFile('setup.html', { root: process.cwd() });
  }

  getLocation(req, res) {
    let content = '{"latitude":"0","longitude":"0"}';
    res.setHeader('content-type', 'application/json').status(StatusCodes.OK);
    try {
      content = readFileSync('location.json', 'utf-8');
    } catch (error) {
      console.error(error);
    }
    res.end(content);
  }

  saveLocation(req, res) {
    logger.info(`Save location: ${JSON.stringify(req.body)}`);
    writeFileSync('location.json', JSON.stringify(req.body), 'utf-8');
    this.index(req, res);
  }

  getIcon(req, res) {
    res.sendFile('icon.png', { root: process.cwd() });
  }

  errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
}

new App().start();
