const multer = require('multer');

const MIME_TYPES = {// accepted types d'images
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};


//lien pour stoquer des images 
const storage = multer.diskStorage({
    destination:(req, file, callback) =>{
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');// parser l'origine name des images
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
      }
});


module.exports = multer({storage:storage}).single('image');