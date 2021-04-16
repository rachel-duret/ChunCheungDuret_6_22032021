const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const MaskData = require('maskdata');

const emailMask2Options = {
  maskWith: "*", 
  unmaskedStartCharactersBeforeAt: 3,
  unmaskedEndCharactersAfterAt: 2,
  maskAtTheRate: false
};



exports.signup = (req, res, next) => {
  const email = req.body.email;
  const maskedEmail = MaskData.maskEmail2(email, emailMask2Options);
  const password = req.body.password;
  //pour verifier un mot de pass au mions Au moins 8 à 16 caractères, au moins 1 lettre majuscule, 1 lettre minuscule et 1 chiffre, les autres peuvent être n'importe quel caractère:
  const regPasswordCheck =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/g;
  //pour verifier si le format d'email  est correct
  const regEmailCheck = /\b[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,6}\b/g;
  if (!email.match(regEmailCheck)){
    throw new Error("Votre email format  n'est pas correct !")
  }else if(!password.match(regPasswordCheck)){
    throw new Error("Votre password n'est pas assez sécurisé !")
  }else{
    // sécuriser le mot de passe
    bcrypt.hash(password, 10)
    .then(hash => {
      const user = new User({
        email: maskedEmail,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ message:'conect'+error }));
  }
    
  };

  exports.login = (req, res, next) => {
    const email = req.body.email;
    const maskedEmail = MaskData.maskEmail2(email, emailMask2Options);
    User.findOne({ email: maskedEmail})
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)// compare le mot de passe 
          .then(valid => {
           
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            let token = jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            );
            res.status(200).json({
              userId: user._id,
              token: token
            });
            
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };