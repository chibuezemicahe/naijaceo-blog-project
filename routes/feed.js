const express = require('express');
const router =  express.Router();

const feedController = require('../controllers/feedController');

router.get('/feed', feedController.getFeed);

module.exports = router;