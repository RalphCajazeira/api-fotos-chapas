const express = require('express');
const router = express.Router();
const { uploadChapa } = require('../controllers/uploadController');
const upload = require('../middlewares/multerMiddleware');

router.post('/upload', upload.single('foto'), uploadChapa);

module.exports = router;
