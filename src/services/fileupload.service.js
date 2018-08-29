import multer from 'multer';

const storage = multer.diskStorage({
    destination: 'src/public/images',
    filename: (req, file, cb) => {
        file.timestamp = Date.now()
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const uploadFile = multer({ storage }).single('image')

const upload = (req, res) => {
    return new Promise((resolve, reject) => {
        uploadFile(req, res, (err) => {
            if (err) {
                reject(err);
            }
            resolve(req)
        })
    })
}
module.exports = {
    upload
};
