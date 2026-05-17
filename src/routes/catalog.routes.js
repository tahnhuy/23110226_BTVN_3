const express = require('express');
const { listMajors } = require('../controllers/catalog.controller');

const router = express.Router();

router.get('/majors', listMajors);

module.exports = router;
