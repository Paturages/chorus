const express = require('express')
const cors = require('cors')
const proxy = require('http-proxy-middleware')

const PORT = process.env.PORT || 3000

const options = {
  target: 'https://chorus.fightthe.pw',
  changeOrigin: true, // needed for virtual hosted sites
}

var app = express()
app.use(cors())
app.use('/api', proxy(options))
app.listen(PORT, () => console.log('proxy started at http://localhost:' + PORT))
