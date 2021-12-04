const arrondissements = require('../models//arrondissements.geojson');
const lieuxtournage = require('../models/lieux-de-tournage-a-paris.geojson');
const { Tournage } = require('../models/tournage');

//configuration des controllers//

exports.getarrondissements = (req, res, next) => {
  res.status(201).json(arrondissements);
}
exports.getlieuxtournage = (req, res, next) => {
  result = {
    nbpage: res.nbpage,
    lieuxtournage: {
      type: "FeatureCollection",
      features: res.paginatedResults.results
    },
    tournagedetails: []
  }
  for (let i = 0; i < res.paginatedResults.results.length; i++) {
    let tournage = new Tournage();
    tournage.fromarray(res.paginatedResults.results[i].properties);
    result.tournagedetails.push(tournage);
  }
  
  res.json(result);
}
exports.getnbofyears = (req, res, next) => {

  let years = [];
  let nomsrealisateurs = [];
  let typestournages = [];
  let nomstournages = [];
  let nomsproducteurs = [];
  let feature = {
    years,
    nomsrealisateurs,
    typestournages,
    nomstournages,
    nomsproducteurs
  }
  lieuxtournage.features.forEach((feature) => {
    if (!years.find(val => val === feature.properties.annee_tournage)) {
      years.push(feature.properties.annee_tournage);
    }
    if (feature.properties.nom_producteur !== undefined) {
      if (!nomsproducteurs.find(val => (val === feature.properties.nom_producteur.toUpperCase()))) {
        nomsproducteurs.push(feature.properties.nom_producteur.toUpperCase());
      }
    }
    if (feature.properties.nom_realisateur !== undefined) {
      if (!nomsrealisateurs.find(val => val === feature.properties.nom_realisateur.toUpperCase())) {
        nomsrealisateurs.push(feature.properties.nom_realisateur.toUpperCase());
      }
    }
    if (feature.properties.nom_tournage !== undefined) {
      if (!nomstournages.find(val => val === feature.properties.nom_tournage.toUpperCase())) {
        nomstournages.push(feature.properties.nom_tournage.toUpperCase());
      }
    }
    if (feature.properties.type_tournage !== undefined) {
      if (!typestournages.find(val => val === feature.properties.type_tournage.toUpperCase())) {
        typestournages.push(feature.properties.type_tournage.toUpperCase());
      }
    }
  });


  feature.years.sort((a, b) => b - a);
  feature.nomsproducteurs.sort();
  feature.nomsrealisateurs.sort();
  feature.nomstournages.sort();
  feature.typestournages.sort();


  res.status(201).json(feature);
}


