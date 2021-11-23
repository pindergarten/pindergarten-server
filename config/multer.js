const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('./s3');

const upload_pet = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'pindergarten/pet',
        acl: 'public-read',
        key: function(req, file, cb) {

            var ext = file.mimetype.split('/')[1];
            if (!['png', 'jpg', 'jpeg', 'gif', 'bmp'].includes(ext)) {
                return cb(new Error('Only images are allowed'));
            }
            cb(null, Date.now() + '.' + file.originalname.split('.').pop()); // 이름 설정
        }
    })
}, 'NONE');

const upload_profile = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'pindergarten/user',
        acl: 'public-read',
        key: function(req, file, cb) {

            var ext = file.mimetype.split('/')[1];
            if (!['png', 'jpg', 'jpeg', 'gif', 'bmp'].includes(ext)) {
                return cb(new Error('Only images are allowed'));
            }
            cb(null, Date.now() + '.' + file.originalname.split('.').pop()); // 이름 설정
        }
    })
}, 'NONE');

const upload_post = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'pindergarten/post',
        acl: 'public-read',
        key: function(req, file, cb) {

            var ext = file.mimetype.split('/')[1];
            if (!['png', 'jpg', 'jpeg', 'gif', 'bmp'].includes(ext)) {
                return cb(new Error('Only images are allowed'));
            }
            cb(null, Date.now() + '.' + file.originalname.split('.').pop()); // 이름 설정
        }
    })
}, 'NONE');

module.exports = {
    upload_pet,
    upload_profile,
    upload_post,
};