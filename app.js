const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');
const fs = require('fs');

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
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
  