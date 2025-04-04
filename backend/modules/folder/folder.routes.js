const express = require('express');
const router = express.Router();
const controller = require('./folder.controller');

router.post('/', controller.createFolder);

module.exports = router;
