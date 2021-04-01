const rateLimit = require('express-rate-limit');

// limiter creer trop de comptes par même IP.
const createAccountLimiter = rateLimit({
    windowMs: 60*60*1000, // une heuse
    max: 10,
    message: "Trop de comptes creer par c'est IP, essaiez encore une heuse plus tard !"
});

// limiter les utilisateurs login 
const loginAccountLimiter = rateLimit({
    windowMs: 15*60*1000,// limit 15 
    max: 10,
    message:"Vous avez déjà essayé 3 fois accès votre compte,  essayez 15 minutes plus tard !"
});

module.exports = {
    createAccountLimiter,
    loginAccountLimiter
};
