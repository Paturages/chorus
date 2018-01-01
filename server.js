const {
  search,
  getByCharter,
  getByArtist,
  getBySource,
  getLatestCharts,
  getNbSongs
} = require('./src/utils/db');
const Express = require('express');
const { Server } = require('http');
const Fs = require('fs');
const Path = require('path');

const express = Express();
const server = Server(express);
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV != 'production') {
  express.use(Express.static(Path.resolve(process.env.NODE_DIR || 'dist')));
}

express.get('/search', (req, res) => res.sendFile(Path.resolve(__dirname, 'dist', 'index.html')));
express.get('/artist/:name', (req, res) => res.sendFile(Path.resolve(__dirname, 'dist', 'index.html')));
express.get('/charter/:name', (req, res) => res.sendFile(Path.resolve(__dirname, 'dist', 'index.html')));
express.get('/source/:name', (req, res) => res.sendFile(Path.resolve(__dirname, 'dist', 'index.html')));

express.get('/api/count', async (req, res) => {
  try {
    const count = await getNbSongs();
    return res.send(count);
  } catch (err) {
    console.error(err.stack);
    res.sendStatus(500);
  }
});

express.get('/api/latest', async (req, res) => {
  try {
    const results = await getLatestCharts();
    return res.json(results);
  } catch (err) {
    console.error(err.stack);
    res.sendStatus(500);
  }
});

express.get('/api/search', async (req, res) => {
  try {
    const { from, query } = req.query;
    const results = await search(query, from);
    return res.json(results);
  } catch (err) {
    console.error(err.stack);
    res.sendStatus(500);
  }
});

express.get('/api/charter', async (req, res) => {
  try {
    const { from, name } = req.query;
    const results = await getByCharter(name, from);
    return res.json(results);
  } catch (err) {
    console.error(err.stack);
    res.sendStatus(500);
  }
});

express.get('/api/artist', async (req, res) => {
  try {
    const { from, name } = req.query;
    const results = await getByCharter(name, from);
    return res.json(results);
  } catch (err) {
    console.error(err.stack);
    res.sendStatus(500);
  }
});

express.get('/api/source', async (req, res) => {
  try {
    const { from, name } = req.query;
    const results = await getBySource(name, from);
    return res.json(results);
  } catch (err) {
    console.error(err.stack);
    res.sendStatus(500);
  }
});

server.listen(port, () => console.log(`Server: Listening to http://localhost:${port}`));
