const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const sauceCtrl = require('../controllers/sauce');
const multer = require('../middleware/multer-config')

router.get('/', auth, sauceCtrl.getAllSauce );
router.get('/:id', auth, sauceCtrl.findOneSauce);
router.post('/',auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.updataSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeDislikeSauce);


module.exports = router;