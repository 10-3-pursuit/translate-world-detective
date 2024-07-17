const express = require('express')
const fs = require('fs')
const cors = require('cors')
require('dotenv').config()
const { Translate } = require('@google-cloud/translate').v2

const app = express()
const apiKey = process.env.API_KEY
console.log('google', process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64)

const base64Credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64

const jsonString = Buffer.from(base64Credentials, 'base64').toString('utf-8')

const credentials = JSON.parse(jsonString)

fs.writeFileSync('/tmp/translate.json', JSON.stringify(credentials))

process.env.GOOGLE_APPLICATION_CREDENTIALS = '/tmp/translate.json'

app.use(cors())
app.use(express.json())

// ROUTES
app.get('/', (req, res) => {
  res.send('Welcome to Google Translate App')
})

const port = process.env.PORT
app.use(express.json())
// Instantiates a client
const translate = new Translate({ key: apiKey })

app.post('/translate', async (req, res) => {
  const { text, target } = req.body

  try {
    const [translation] = await translate.translate(text, target)
    res.json({ text, translation })
  } catch (error) {
    res.status(500).send(error.message)
  }
})

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`)
// })

// 404 PAGE
app.get('*', (req, res) => {
  res.json({ error: 'Page not found' })
})
// EXPORT
module.exports = app
