const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const rateLimits = require('../middleware/ratelimit');
const createAccountLimiter = rateLimits.createAccountLimiter;
const loginAccountLimiter = rateLimits.loginAccountLimiter;

//routes inscription , createAccountLimiter pour limiter d'inscription dans un temp court
router.post('/signup', createAccountLimiter, userCtrl.signup);

// routes conextion , loginAccountLimiter pour limiter user login mot de pass incorrect.
router.post('/login', loginAccountLimiter, userCtrl.login );



module.exports = router;