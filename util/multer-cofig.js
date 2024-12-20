
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination:(req,file, cb) =>{
        cb (null,path.join(__dirname, '../images'));
    },
    filename: (req,file,cb)=>{
        cb(null, new Date().toISOString().replace(/:/g,'-') + '-' + file.originalname);
    }
})

const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' ){
        cb(null, true);
    }

    else{
        cb(new Error('Only images are allowed'));
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });
// Here I export the multer setup
module.exports = upload;
