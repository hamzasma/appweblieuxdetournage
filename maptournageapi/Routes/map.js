const express = require('express');
const router = express.Router();

const mapCtrl = require('../controllers/map');
//configuration des routages//
router.get('/arrondissement', mapCtrl.getarrondissements);
router.get('/lieuxtournage', mapCtrl.getlieuxtournage);
router.get('/nbofyears',mapCtrl.getnbofyears);

module.exports = router;