const express = require('express');
const app = express();
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const session = require('cookie-session');
const mongoose = require('mongoose');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');
const fs = require('fs');


/* helmet :1* X-Powered-BY  2* X-XSS- Protection; 3* X-permittedCrossDomainPolicies; 4*frameguard; 5*ieNoOpen; 6* dnsPrefetchControl; 7* originAgentCluster; 8*noSniff; 9*hsts; 10* referrerPolicy; 11*expectCt; 12*contentSecurityPolicy */
app.use(helmet());
app.use(helmet.xssFilter())
// surviller logging----OWASP(10: Insufficient logging & Monitoring)
app.use(morgan('dev'));
app.use(bodyParser.json());


app.use((req, res, next) => {//set header
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // connect mongodb cluster , remplace user et password et soPekocko collection
  mongoose.connect('mongodb+srv://sellers:password00@cluster0.rvcqm.mongodb.net/soPekocko?retryWrites=true&w=majority',
{
  userNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
.then(()=>{
  console.log('connexion a monodb reussie');
})
.catch(()=>{
  console.log(('connxion a mongodb echouee!'));
})

// parametre les cookies en http-only
/* app.use(session({
  secret:'any',
  cookie:{
    secure:true,
    httpOnly: true,
    domain: 'http://localhost:3000',
  }
}));
 */

app.use('/images', express.static(path.join(__dirname, 'images')));//pour ajouter des images par frontend
app.use('/api/sauces', sauceRoutes);//page sauces
app.use('/api/auth', userRoutes);// login et inscription


module.exports = app;
  