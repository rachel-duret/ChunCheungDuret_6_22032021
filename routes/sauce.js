const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const sauceCtrl = require('../controllers/sauce');
const multer = require('../middleware/multer-config')


// routes CRUD: Create, Read, Update, Delete, tout les routes comtenir auth pour l'autentification

// routes: multer pour gérer les fichiers images
router.get('/', auth, sauceCtrl.getAllSauce );// routes read
router.get('/:id', auth, sauceCtrl.findOneSauce);// routes renvoie le produit avce un id
router.post('/',auth, multer, sauceCtrl.createSauce);// routes create et multer pour gérer des images
router.put('/:id', auth, multer, sauceCtrl.updataSauce);// routes update st muler pour gérer des images
router.delete('/:id', auth, sauceCtrl.deleteSauce);//routes delete
router.post('/:id/like', auth, sauceCtrl.likeDislikeSauce);// routes like 


module.exports = router;