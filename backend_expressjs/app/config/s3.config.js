const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

const REGION = process.env.REGION;
const BUCKET_NAME = process.env.BUCKET;
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRETE_KEY = process.env.SECRETE_KEY;

const s3Client = new S3Client({
	region: REGION,
	credentials: {
		secretAccessKey: SECRETE_KEY,
		accessKeyId: ACCESS_KEY_ID,
	},
});
const fileFilter = (req, file, cb) => {
	if (['image/jpeg', 'image/png', 'image/jpeg'].includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error('Only images are allowed'), false);
	}
};
const s3Upload = multer({
	storage: multerS3({
		s3: s3Client,
		bucket: BUCKET_NAME,
		acl: 'public-read',
		contentType: multerS3.AUTO_CONTENT_TYPE,
		metadata(req, file, cb) {
			cb(null, { fieldName: file.fieldname });
		},
		key(req, file, cb) {
			console.log(file);
			cb(null, file.originalname); //use Date.now() for unique file keys
		},
	}),
	fileFilter,
});

module.exports = { s3Upload };
