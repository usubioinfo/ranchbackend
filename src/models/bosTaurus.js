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

const bInfo = mongoose.model('test_bos', SpeciesInfoSchema)

const Bos_taurus = mongoose.model('bos_taurus', SpeciesSchema)
const Capra_hircus = mongoose.model('capra_hircus', SpeciesSchema)



module.exports ={
    'bos_taurus':Bos_taurus,
    'binfo':bInfo,
    'capra_hircus':Capra_hircus,
}

