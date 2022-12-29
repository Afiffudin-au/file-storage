import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { DownloaderHelper } from 'node-downloader-helper'
// deteksi dir name
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const router = express.Router()
// file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/images')
  },
  filename: function (req, file, cb) {
    cb(
      null,
      path.parse(file.originalname).name +
        '-' +
        Date.now() +
        path.extname(file.originalname)
    )
  },
})
const upload = multer({ storage: storage })
router.post('/upload/image/movie', upload.single('photo'), async (req, res) => {
  try {
    const finalImageURL =
      req.protocol +
      '://' +
      req.get('host') +
      '/uploads/images/' +
      req.file.filename
    res.status(201).json({ data: finalImageURL })
  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal server erorr' })
  }
})
router.post('/upload/image/with-url', async (req, res) => {
  try {
    const { url, title } = req.body
    const fileName = `${title}_${Date.now()}${path.extname(url)}`
    const download = new DownloaderHelper(url, './public/uploads/images', {
      fileName: fileName,
    })
    download.on('end', () => {
      const finalImageURL =
        req.protocol + '://' + req.get('host') + '/uploads/images/' + fileName
      res.status(201).json({ data: finalImageURL })
    })
    download.on('error', (err) => {
      res.status(err.status || 500).json({ data: err })
    })
    download.start().catch((err) => console.error(err))
  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal server erorr' })
  }
})
export default router
