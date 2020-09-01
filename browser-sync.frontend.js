const { createProxyMiddleware } = require('http-proxy-middleware')

const options = {
  target: 'https://chorus.fightthe.pw',
  changeOrigin: true, // needed for virtual hosted sites
}

module.exports = {
  host: "localhost",
  port: 8080,
  server: {
    "baseDir": "dist",
    middleware: [createProxyMiddleware('/api', options)]
  },
  files: [
    "dist/**/*",
    "!dist/*.map"
  ]
}
