//*declaration des dependance*//
const express = require('express');
const bodyParser = require('body-parser');
const mapRoute = require('./routes/map');
const lieuxtournage = require('./models/lieux-de-tournage-a-paris.geojson');
const filterresult = require('./middleware/filter');
const paginatedResults = require('./middleware/pagination');
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//Utilisation des routes//
app.use(bodyParser.json());
app.use('/api/map', filterresult(lieuxtournage.features), paginatedResults(), mapRoute);


module.exports = app;