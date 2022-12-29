import express from 'express'
import cors from 'cors'
import fileUploadRouter from './router/fileUpload/index.js'
import path from 'path'
import { fileURLToPath } from 'url'
// deteksi dir name
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
//port
const port = 4001
const URL = '/api/v1'
const app = express()
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//router
app.use(URL, fileUploadRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
