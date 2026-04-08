const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 3000

const server = http.createServer((req, res) => {
  if (req.url === '/api/questions') {
    fs.readFile(path.join(__dirname, 'questions.json'), (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Failed to load questions' }))
        return
      }
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(data)
    })
    return
  }

  const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url)
  const ext = path.extname(filePath)
  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.ico': 'image/x-icon'
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not found')
      return
    }
    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' })
    res.end(data)
  })
})

server.listen(PORT, () => {
  console.log(`Quiz Arena running at http://localhost:${PORT}`)
})
