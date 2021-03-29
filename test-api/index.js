const express = require('express')
const app = express()
const port = 3000
const domain = 'http://www.chat-app-demo.xyz'


app.get('/test-api', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`test-api listening at ${domain}:${port}`);
})