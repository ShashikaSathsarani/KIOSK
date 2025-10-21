const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

const EXHIBITS_SERVICE_URL = process.env.EXHIBITS_SERVICE_URL || `http://localhost:${process.env.BACKEND_EXHIBITS_SERVICE_PORT || 5003}`

app.use('/exhibits', createProxyMiddleware({
  target: EXHIBITS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/exhibits': '',
  },
}))

app.get('/', (req, res) => {
  res.send('API Gateway (exhibits) is running')
})

app.use((req, res, next) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found on API Gateway` })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'API Gateway error', error: err.message })
})

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`)
  console.log(`Proxying /exhibits -> ${EXHIBITS_SERVICE_URL}`)
})
