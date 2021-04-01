const express = require('express');
const app = express();
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');
const fs = require('fs');


/* helmet :1* X-Powered-BY  2* X-XSS- Protection; 3* X-permittedCrossDomainPolicies; 4*frameguard; 5*ieNoOpen; 6* dnsPrefetchControl; 7* originAgentCluster; 8*noSniff; 9*hsts; 10* referrerPolicy; 11*expectCt; 12*contentSecurityPolicy */
app.use(helmet());
// surviller logging----OWASP(10: Insufficient logging & Monitoring)
app.use(morgan('dev'));
app.use(bodyParser.json());
//app.use(cookieParser('name', 'httpOnly'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   // res.setHeader('Content-Security-Policy', "default-src 'self'");//against Xss attack
    next();
  });

  // ajouter 
  mongoose.connect('mongodb+srv://rachelDuret:Rachel.879568@cluster0.rvcqm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{
  userNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=>{
  console.log('connexion a monodb reussie');
})
.catch(()=>{
  console.log(('connxion a mongodb echouee!'));
})


app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;
  