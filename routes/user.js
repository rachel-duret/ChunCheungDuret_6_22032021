const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const rateLimits = require('../middleware/ratelimit');
const createAccountLimiter = rateLimits.createAccountLimiter;
const loginAccountLimiter = rateLimits.loginAccountLimiter;

router.post('/signup', createAccountLimiter, userCtrl.signup);
router.post('/login', loginAccountLimiter, userCtrl.login );



module.exports = router;