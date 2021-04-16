const rateLimit = require('express-rate-limit');

// limiter creer trop de comptes par même IP.
const createAccountLimiter = rateLimit({
    windowMs: 60*60*1000, // une heuse
    max: 15,
    message: "Trop de comptes crées par cette adresse Ip, essayez encore， une heure plus tard !"
});

// limiter les utilisateurs login 
const loginAccountLimiter = rateLimit({
    windowMs: 15*60*1000,// limit 15 
    max: 3,
    message:"Vous avez déjà essayé 3 fois d'accéder à votre compte,  essayez 15 minutes plus tard !"
});

module.exports = {
    createAccountLimiter,
    loginAccountLimiter
};
