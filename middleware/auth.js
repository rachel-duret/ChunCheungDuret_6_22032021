const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];// separe le bearer et recuperer le token

    /*  vérifie (avec la méthode verify de jsonwebtoken) que le token, correspeond au secret (token) que l'on a dans process.env */
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } 
      next(); 
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};