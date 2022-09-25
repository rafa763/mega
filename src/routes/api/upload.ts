import express, { Request, Response } from 'express'
import toAws from '../../utils/sharp'
import multer from 'multer'

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const s = express.Router()

s.get('/upload', (req: Request, res: Response) => {
    res.render('upload', {layout: false})
})

// https://github.com/expressjs/multer
s.post('/upload', upload.single('file'), (req: Request, res: Response) => {
    // console.log(upload)
    const f = req.file?.buffer
    console.log(req.body)
    toAws(f as Buffer)
    res.redirect('/')
})

export default s
