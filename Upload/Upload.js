const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "upload/image")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

// Define file filter to accept only image files
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//         cb(null, true); // Accept the file
//     } else {
//         cb(new Error('Only image files are allowed'), false); // Reject the file
//     }
// };

const upload = multer({  storage: storage,
    // fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // Limit file size to 10 MB (adjust as needed)
    }})

module.exports = {upload}