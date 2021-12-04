<template>
  <div class="hello">
    <div class="filter">
      <div class="select">
        <label for="year">Année du tournage</label>
        <select
          name="year"
          id="year"
          v-model="selected"
          @change="filterhchange(1)"
        >
          <option value="0" selected>Tout les années</option>
          <option v-for="val in years" :key="val" v-bind:value="val">
            {{ val }}
          </option>
        </select>
      </div>
      <div class="select">
        <label for="nom_producteur">Nom du producteur</label>
        <select
          name="nom producteur"
          id="nom_producteur"
          v-model="nom_producteur"
          @change="filterhchange(1)"
        >
          <option value="0" selected>Tout les producteurs</option>
          <option v-for="val in noms_producteurs" :key="val" v-bind:value="val">
            {{ val }}
          </option>
        </select>
      </div>
      <div class="select">
        <label for="nom_realisateur">Nom du realisateur</label>
        <select
          name="nom realisateur"
          id="nom_realisateur"
          v-model="nom_realisateur"
          @change="filterhchange(1)"
        >
          <option value="0" selected>Tout les realisateurs</option>
          <option
            v-for="val in noms_realisateurs"
            :key="val"
            v-bind:value="val"
          >
            {{ val }}
          </option>
        </select>
      </div>
      <div class="select">
        <label for="nom_tournage">Nom du tournage</label>
        <select
          name="nom tournage"
          id="nom_tournage"
          v-model="nom_tournage"
          @change="filterhchange(1)"
        >
          <option value="0" selected>Tout les tournages</option>
          <option v-for="val in noms_tournages" :key="val" v-bind:value="val">
            {{ val }}
          </option>
        </select>
      </div>
      <div class="select">
        <label for="type_tournage">Type du tournage</label>
        <select
          name="type tournage"
          id="type_tournage"
          v-model="type_tournage"
          @change="filterhchange(1)"
        >
          <option value="0" selected>Tout les types tournages</option>
          <option v-for="val in types_tournages" :key="val" v-bind:value="val">
            {{ val }}
          </option>
        </select>
      </div>
    </div>
    <span>{{ arrondissement }}</span>
    <div id="map"></div>
    <div class="pages-list" v-if="tournagedetails.length > 0">
      <div class="select">
        <label for="pages">Page</label>
        <select
          name="pages"
          id="pages"
          v-model="selected_page"
          @change="pageschange($event.target.value)"
        >
          <option v-for="p in pages" :key="p" v-bind:value="p">
            {{ p }}
          </option>
        </select>
      </div>
    </div>
    <div class="tournage-list" v-if="tournagedetails.length > 0">
      <div class="tournage" v-for="tournage in tournagedetails" :key="tournage">
        <h2>
          Nom du tournage: <br />
          {{ tournage.nom_tournage }}
        </h2>
        <p v-if="tournage.annee_tournage != undefined">Année du tournage: {{ tournage.annee_tournage }}</p>
        <p v-if="tournage.annee_tournage == undefined">Année du tournage: Non fournis</p>
        <p v-if="tournage.type_tournage != undefined">Type du tournage: {{ tournage.type_tournage }}</p>
        <p v-if="tournage.type_tournage == undefined">Type du tournage: Non fournis</p>
        <p v-if="tournage.nom_realisateur != undefined">Nom du realisateur: {{ tournage.nom_realisateur }}</p>
        <p v-if="tournage.nom_realisateur == undefined">Nom du realisateur: Non fournis</p>
        <p v-if="tournage.nom_producteur != undefined">Nom du producteur: {{ tournage.nom_producteur }}</p>
        <p v-if="tournage.nom_producteur == undefined">Nom du producteur: Non fournis</p>
      </div>
    </div>
    <div class="pages-list" v-if="pages > 1">
      <div class="select">
        <label for="pages">Page</label>
        <select
          name="pages"
          id="pages"
          v-model="selected_page"
          @change="pageschange($event.target.value)"
        >
          <option v-for="p in pages" :key="p" v-bind:value="p">
            {{ p }}
          </option>
        </select>
      </div>
    </div>
    <span v-if="tournagedetails.length <= 0">Aucun tournage trouver</span>
  </div>
</template>

<script>
import { Loader } from "@googlemaps/js-api-loader";
import axios from "axios";
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data: () => {
    return {
      arrondissement: "Selectionnez un arrondissement sur la carte",
      tournagepos: {
        type: "FeatureCollection",
        features: [],
      },
      pages: 0,
      tournagedetails: [],
      years: [],
      selected: 0,
      types_tournages: [],
      noms_tournages: [],
      noms_realisateurs: [],
      noms_producteurs: [],
      type_tournage: 0,
      nom_tournage: 0,
      nom_realisateur: 0,
      nom_producteur: 0,
      selected_page: 1,
    };
  },
  created: function () {
    this.initMap(1);
    this.createyears();
  },
  methods: {
    initMap(page) {
      let ths = this;
      this.arrondissement = "Selectionnez un arrondissement sur la carte";
      const loader = new Loader({
        apiKey: "AIzaSyCX8CkYWwV3YJLPXlAI2-SBi_YAolGLjSA",
        version: "weekly",
        libraries: ["places"],
      });
      loader.load().then(() => {
        const map = new window.google.maps.Map(document.getElementById("map"), {
          zoom: 12,
          center: {
            lat: 48.862402481265065,
            lng: 2.337425311994615,
          },
          disableDefaultUI: true,
        });
        axios
          .get("http://localhost:3000/api/map/arrondissement")
          .then((result) => {
            map.data.addGeoJson(result.data);
          })
          .catch(function (error) {
            console.log(error);
          });

        map.data.setStyle({
          fillOpacity: 0,
          strokeColor: "red",
          strokeWeight: 4,
        });
        var infowindow = new window.google.maps.InfoWindow();

        map.data.addListener("click", function (event) {
          if (!event.feature.getProperty("perimetre")) {
            var contentString = `
            <div id="content">
              <div id="siteNotice">
              </div>
              <p><center><h1 id="firstHeading" class="firstHeading">Details du tournage</h1></center></p>
              <p><center><h3>Nom tournage :${event.feature.getProperty(
                "nom_tournage"
              )}</h3></center></p>
              <div id="bodyContent">
              <center><b>Nom producteur</b>: ${event.feature.getProperty(
                "nom_producteur"
              )}</center>
              <center><b>Nom realisateur</b>: ${event.feature.getProperty(
                "nom_realisateur"
              )} </center>
              <center><b>Adresse</b>: ${event.feature.getProperty(
                "adresse_lieu"
              )} </center> </p>
              <center><b>Type tournage</b>: ${event.feature.getProperty(
                "type_tournage"
              )}</center>
              </div>
              </div>
            `;
            infowindow.setContent(contentString); // show the html variable in the infowindow
            infowindow.setPosition(event.latLng); // anchor the infowindow at the marker
            infowindow.setOptions({
              pixelOffset: new window.google.maps.Size(0, -30),
            }); // move the infowindow up slightly to the top of the marker icon
            infowindow.open(map);
          } else {
            let urlcompletion = "";
            map.setCenter(event.latLng);
            map.setZoom(13);
            if (ths.selected != 0) {
              urlcompletion += "&annee_tournage=" + ths.selected;
            }
            if (ths.nom_tournage != 0) {
              urlcompletion += "&nom_tournage=" + ths.nom_tournage;
            }
            if (ths.nom_realisateur != 0) {
              urlcompletion += "&nom_realisateur=" + ths.nom_realisateur;
            }
            if (ths.nom_producteur != 0) {
              urlcompletion += "&nom_producteur=" + ths.nom_producteur;
            }
            if (ths.type_tournage != 0) {
              urlcompletion += "&type_tournage=" + ths.type_tournage;
            }
            axios
              .get(
                "http://localhost:3000/api/map/lieuxtournage?page=" +
                  page +
                  "&limit=100" +
                  urlcompletion
              )
              .then((result) => {
                let i = 0;
                ths.pages = result.data.nbpage;
                ths.tournagedetails = result.data.tournagedetails;
                ths.tournagepos.features = [];

                map.data.forEach(function (feature) {
                  // If you want, check here for some constraints
                  if (i > 19) map.data.remove(feature);
                  i++;
                });
                let features = result.data.lieuxtournage.features;
                var polyPath = event.feature.getGeometry().getAt(0).getArray();
                var poly = new window.google.maps.Polygon({
                  paths: polyPath,
                });

                for (let i = 0; i < features.length; i++) {
                  let latlng = {
                    lat: features[i].geometry.coordinates[1],
                    lng: features[i].geometry.coordinates[0],
                  };
                  if (
                    window.google.maps.geometry.poly.containsLocation(
                      latlng,
                      poly
                    )
                  ) {
                    ths.tournagepos.features.push(features[i]);
                  }
                }
                map.data.addGeoJson(ths.tournagepos);
                map.data.revertStyle();
                let state = event.feature.getProperty("l_ar");
                ths.arrondissement = state.split(" ")[0] + " Arrondissement"; // combine state name with a label
                infowindow.setContent(ths.arrondissement); // show the html variable in the infowindow
                infowindow.setPosition(event.latLng); // anchor the infowindow at the marker
                infowindow.setOptions({
                  pixelOffset: new window.google.maps.Size(0, -30),
                }); // move the infowindow up slightly to the top of the marker icon
                infowindow.open(map);
                map.data.overrideStyle(event.feature, {
                  fillOpacity: 0.3,
                  fillColor: "green",
                });
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        });
        map;
      });
    },
    filterhchange(page) {
      this.selected_page = page;
      this.pageschange(page);
    },
    pageschange(page) {
      let urlcompletion = "";
      if (this.selected != 0) {
        urlcompletion += "&annee_tournage=" + this.selected;
      }
      if (this.nom_tournage != 0) {
        urlcompletion += "&nom_tournage=" + this.nom_tournage;
      }
      if (this.nom_realisateur != 0) {
        urlcompletion += "&nom_realisateur=" + this.nom_realisateur;
      }
      if (this.nom_producteur != 0) {
        urlcompletion += "&nom_producteur=" + this.nom_producteur;
      }
      if (this.type_tournage != 0) {
        urlcompletion += "&type_tournage=" + this.type_tournage;
      }
      axios
        .get(
          "http://localhost:3000/api/map/lieuxtournage?page=" +
            page +
            "&limit=100" +
            urlcompletion
        )
        .then((result) => {
          this.tournagedetails = result.data.tournagedetails;
          this.pages = result.data.nbpage;
          this.initMap(page);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    createyears() {
      axios
        .get("http://localhost:3000/api/map/nbofyears")
        .then((result) => {
          this.years = result.data.years;
          this.noms_producteurs = result.data.nomsproducteurs;
          this.noms_realisateurs = result.data.nomsrealisateurs;
          this.noms_tournages = result.data.nomstournages;
          this.types_tournages = result.data.typestournages;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
#map {
  width: 90%;
  height: 500px;
  margin: auto;
  margin-top: 30px;
  margin-bottom: 30px;
  box-shadow: 0px 0px 9px 5px black;
}
span {
  font-size: 25px;
  margin: 20px;
}
label {
  position: relative;
  width: 149px;
  top: 10px;
  left: 34px;
  border-top: solid;
  border-right: solid;
  border-left: solid;
  border-radius: 9px 9px 0px 0px;
  padding: 5px;
  background-color: #42b983;
  font-weight: 600;
}
select {
  margin-top: 30px;
  width: 214px;
  color: black;
  border: none;
  border-radius: 20px;
  padding-left: 10px;
  padding-right: 10px;
  height: 35px;
  margin: 10px;
  outline: none;
  box-shadow: 0 1px 3px rgb(0 0 0 / 50%);
}
.tournage-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 80%;
  margin: auto;
}
.tournage {
  box-shadow: 0 1px 3px rgb(0 0 0 / 50%);
  width: 31%;
  margin-top: 20px;
  padding: 10px;
}
.filter {
  display: flex;
  flex-direction: row;
  justify-content: center;
  border: 1px solid black;
  border-radius: 4px;
  padding: 30px;
}
.filter::before {
  content: "Filtre";
  position: absolute;
  top: 68px;
  background-color: bisque;
  width: 50px;
  padding: 10px;
  border-radius: 9px;
  font-weight: 700;
  height: 16px;
}
.pages-list {
  display: flex;
  justify-content: center;
}
input {
  width: 70%;
  border-radius: 0px;
  height: 30px;
  padding-left: 5px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 50%);
  border: none;
  outline: none;
  margin-left: 30px;
  margin-right: 10px;
  margin: 10px;
  border-radius: 0px;
  border-bottom: 1px solid rgb(17, 253, 29);
}
.select {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
@media screen and (max-width: 1200px) {
  .filter {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .select {
    flex-direction: row;
  }
  label {
    top: 11px;
    left: 32px;
    border-bottom: solid;
    border-radius: 13px 0px 0px 13px;
    padding-right: 31px;
    z-index: -1;
  }
  .tournage {
    width: 46%;
  }
}
@media screen and (max-width: 950px) {
  .select {
    width: 100%;
  }
  select {
    width: 60%;
  }
}
@media screen and (max-width: 750px) {
  .tournage {
    width: 100%;
  }
}
@media screen and (max-width: 640px) {
  .select {
    flex-direction: column;
    align-items: center;
  }
  label {
    width: 149px;
    top: 10px;
    left: 0px;
    border-top: solid;
    border-right: solid;
    border-left: solid;
    border-bottom: none;
    border-radius: 9px 9px 0px 0px;
    padding: 5px;
  }

  .tournage {
    width: 100%;
  }
  select {
    width: 80%;
  }
}
</style>
