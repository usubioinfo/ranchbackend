const express = require('express');
const router = express.Router();
const { IndexedFasta } = require('@gmod/indexedfasta')
const getSeq = require('../data/getSeq')
const getPrimers = require('../primers/getPrimers')
const runEPCR = require('../primers/runEPCR')
const runPrediction = require('../prediction/prediction')
const runBlast = require('../prediction/blast')

const Bos = require("../models/bosTaurus");
const path = require('path');

const fs = require('fs');


router.route('/total/').get((req, res) => {

  let {motif, type, annotation, chromosome, start, stop, min, table} = req.query

   let query ={}
  

  if (chromosome){
    query['chromosome'] = chromosome
  }

   if (motif){
     query['motif']=motif
   }
   if (type){
    query['motif_type']=type
  }
  
  if (annotation){
    query['annotation'] = annotation
  }

  if (start){
    query['motif_start']= {$gte:start}
  }
  
  if (stop){
    query['motif_end']= {$lte:stop}
  }
  
  if (min){
    query['motif_length'] = {$gte:parseInt(min)}
  }
  


   Bos[table].count(query)
   .then(count => res.json(count))
   .catch(err => res.status(400).json('Error:' + err))

});


router.route('/seq').get(async(req, res) => {


 const {chr, start, stop, filename} = req.query

  const chr1Region = await getSeq(chr, start, stop, filename)

  res.json(chr1Region)

});


router.route('/').get(async (req, res, next) => {
 
let {page, size, motif, type, annotation, chromosome, start, stop, min, table} = req.query
let results;
   
 if(!page){
   page = 1
 }
if (page){
  page = parseInt(page) + 1
}
 if (!size){
   size = 10
 }
 
 let query ={}

 if (chromosome){
  query['chromosome'] = chromosome
  
}

 if (motif){
   query['motif'] = motif
 }
 if (type){
  query['motif_type'] = type
}

if (annotation){
  query['annotation'] = annotation
}

if (start){
  query['motif_start']= {$gte:parseInt(start)}
}

if (stop){
  query['motif_end']= {$lte:parseInt(stop)}
}

if (min){
  query['motif_length'] = {$gte:parseInt(min)}
}


 const limit = parseInt(size)
//  console.log(page-1)
 const skip = (page-1) * size;

// console.log(skip)

results = await Bos[table].find(query).limit(limit).skip(skip).exec()



res.json(results)
 
next();

});

router.route('/sinfo').get(async(req, res) => {
  
  let {infotable} = req.query

  results = await Bos[infotable].find({}).exec()
 
   res.json(results)

  //  console.log(results)

 
 });
 

 router.route('/primers').get(async(req, res) => {


  const {seq, motif_length, minS, maxS, minTM, maxTM, minGC, maxGC, flank} = req.query
 
   const pdata = await getPrimers(seq, motif_length, minS, maxS, minTM, maxTM, minGC, maxGC, flank)
 
   res.send(pdata)
 
 });

 router.route('/epcr').get(async(req, res) => {


  const primerdata = JSON.parse(req.query.primerdata)
  const seqdata = req.query.seq
  const mismatch = req.query.mismatch
  const genome = req.query.genome
 
   const pdata = await runEPCR(primerdata, seqdata, mismatch, genome)
 
   res.send(pdata)
 
 });
 
 router.route('/prediction').post( async(req, res) => {
  
  
  let filedata;
  const id = Date.now()

  const genome = req.body.genome
  
  const minRepeat = req.body.minRepeat
  const maxRepeat = req.body.maxRepeat
  const mono = req.body.mono
  const all = req.body.all
  if (req.files != null){
  const filename = req.files.file
  
  await filename.mv(path.join(__dirname,'../prediction/preddata/') + id+'.fa')
  filedata = path.join(__dirname,'../prediction/preddata/') + id+'.fa'
  }
  if (genome !=''){
    fs.writeFileSync(path.join(__dirname,`../prediction/preddata/${id}.fa`), genome)
    filedata = path.join(__dirname,`../prediction/preddata/${id}.fa`)
  }
  const result = await runPrediction(id, filedata,  minRepeat, maxRepeat, mono, all)

  res.send(result)
  
 
 });
 
 router.route('/blast').post( async(req, res) => {
  
  
  let filedata;
  const id = Date.now()

  const genome = req.body.genome

  const gdata = req.body.gdata
  
  const word = req.body.word
  const target = req.body.target
  const evalue = req.body.evalue
  const program = req.body.program

  console.log(program)

  if (req.files != null){
  const filename = req.files.file
  
  await filename.mv(path.join(__dirname,'../prediction/preddata/') + id+'.fa')
  filedata = path.join(__dirname,'../prediction/preddata/') + id+'.fa'
  }
  if (gdata !=''){
    fs.writeFileSync(path.join(__dirname,`../prediction/preddata/${id}.fa`), gdata)
    filedata = path.join(__dirname,`../prediction/preddata/${id}.fa`)
  }
  const result = await runBlast(id, filedata, program, genome, word, target, evalue)

  res.send(result)
  
 
 });
module.exports = router;