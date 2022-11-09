const mongoose = require('mongoose');

const SpeciesSchema = new mongoose.Schema({
    chromosome: {

        type: String,
    },
    c_length: {
        type: Number,
    },
    motif_type: {
        type: String,
    },
    motif: {
        type: String,

    },
    unit: {
        type: Number,
    },

    motif_length: {
        type: Number,
    },

    motif_start: {
        type: Number,
    },
    motif_end: {
        type: Number,
    },
    gene: {
        type: String,
    },
    gene_start: {
        type: Number,
    },
    gene_end: {
        type: Number,
    },
    strand: {
        type: String,
    },
    annotation: {
        type: String,
    },
    promoter: {
        type: String,
    },
    tss: {
        type: Number,
    }

});
const SpeciesInfoSchema = new mongoose.Schema({
    motif:{
    type:String,
    } ,
    frequency: {
        type:Number,
        } ,
    totalbp:{
        type:Number,
        } ,
    intron:{
        type:Number,
        } ,
    intergenic:{
        type:Number,
        } ,
    exon:{
        type:Number,
        } ,
    non_promoter:{
        type:Number,
        } ,
    promoter:{
        type:Number,
        } 
});

const bInfo = mongoose.model('spinfo_bos', SpeciesInfoSchema)
const chInfo = mongoose.model('spinfo_capras', SpeciesInfoSchema)
const dogInfo = mongoose.model('spinfo_dogs', SpeciesInfoSchema)
const catInfo = mongoose.model('spinfo_cats', SpeciesInfoSchema)
const donkeyInfo = mongoose.model('spinfo_donkeys', SpeciesInfoSchema)
const horseInfo = mongoose.model('spinfo_horses', SpeciesInfoSchema)
const pigInfo = mongoose.model('spinfo_pigs', SpeciesInfoSchema)
const buffaloInfo = mongoose.model('spinfo_buffalos', SpeciesInfoSchema)
const sheepInfo = mongoose.model('spinfo_sheeps', SpeciesInfoSchema)
const yakInfo = mongoose.model('spinfo_yaks', SpeciesInfoSchema)
const chickenInfo = mongoose.model('spinfo_chickens', SpeciesInfoSchema)
const apisInfo = mongoose.model('spinfo_bees', SpeciesInfoSchema)

const Bos_taurus = mongoose.model('bos_taurus', SpeciesSchema)
const Capra_hircus = mongoose.model('capra_hircus', SpeciesSchema)
const Canis_lupus = mongoose.model('canis_lupus', SpeciesSchema)
const Felis_catus = mongoose.model('felis_catus', SpeciesSchema)
const Equus_asinus = mongoose.model('equus_asinus', SpeciesSchema)
const Equus_callabus = mongoose.model('equus_caballus', SpeciesSchema)
const Sus_sacrofa = mongoose.model('sus_sucrofas', SpeciesSchema)
const Bubalus_bubalis = mongoose.model('bubalus_bubalis', SpeciesSchema)
const Ovis_aries = mongoose.model('ovis_aries', SpeciesSchema)
const Bos_grunniens = mongoose.model('bos_grunniens', SpeciesSchema)
const Gallus_gallus = mongoose.model('gallus_gallus', SpeciesSchema)
const Apis_meliferas = mongoose.model('apis_meliferas', SpeciesSchema)

module.exports ={
    'bos_taurus':Bos_taurus,
    'spinfo_bos':bInfo,
    'capra_hircus':Capra_hircus,
    'spinfo_capras':chInfo,
    'canis_lupus':Canis_lupus,
    'spinfo_dogs':dogInfo,
    'felis_catus':Felis_catus,
    'spinfo_cats':catInfo,
    'equus_asinus':Equus_asinus,
    'spinfo_donkeys':donkeyInfo,
    'equus_caballus':Equus_callabus,
    'spinfo_horses':horseInfo,
    'sus_sucrofas':Sus_sacrofa,
    'spinfo_pigs':pigInfo,
    'bubalus_bubalis': Bubalus_bubalis,
    'spinfo_buffalos': buffaloInfo,
    'ovis_aries':Ovis_aries,
    'spinfo_sheeps':sheepInfo,
    'bos_grunniens':Bos_grunniens,
    'spinfo_yaks': yakInfo,
    'gallus_gallus': Gallus_gallus,
    'spinfo_chickens': chickenInfo,
    'apis_meliferas': Apis_meliferas,
    'spinfo_bees': apisInfo



}

