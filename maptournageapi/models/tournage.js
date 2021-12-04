class Tournage{
    constructor (){

        this.annee_tournage=null
        this.type_tournage=null
        this.nom_producteur=null
        this.nom_tournage=null
         this.nom_realisateur=null
        this.date_fin=null
        this.adresse_lieu=null
    }
    fromarray(array){
        this.annee_tournage=array["annee_tournage"];
        this.type_tournage=array["type_tournage"];
        this.nom_producteur=array["nom_producteur"];
        this.nom_tournage=array["nom_tournage"];
         this.nom_realisateur=array["nom_realisateur"];
        this.date_fin=array["date_fin"];
        this.adresse_lieu=array["adresse_lieu"];
    }

}
module.exports = { Tournage }