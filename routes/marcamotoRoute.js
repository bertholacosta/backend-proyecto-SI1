const router = require('express').Router();
const marcamotoController = require('../controllers/marcamotoController');

router.post('/', marcamotoController.createmarcamoto);

module.exports = router