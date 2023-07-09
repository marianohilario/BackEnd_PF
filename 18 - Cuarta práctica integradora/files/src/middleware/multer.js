import multer from 'multer'
import fs from 'fs'
import path from 'path'
import __dirname from '../utils.js'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = ''

        if (file.fieldname === 'profile'){
            folder = 'profile'
        }
        if (file.fieldname === 'products'){
            folder = 'products'
        }
        if (file.fieldname === 'documents'){
            folder = 'documents'
        }
        const uploadFolder = path.join(__dirname, `/files/${req.params.uid}/${folder}`)

        if (!fs.existsSync(uploadFolder)) {
            fs.mkdirSync(uploadFolder, {recursive: true})
        }

        cb(null, uploadFolder)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

export const uploader = multer({storage})