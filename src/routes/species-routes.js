const express = require('express');

const router = express.Router();
const { IndexedFasta } = require('@gmod/indexedfasta')
const getSeq = require('../data/getSeq')
const getPrimers = require('../primers/getPrimers')

const Bos = require("../models/bosTaurus");


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


  results = await Bos['binfo'].find({}).exec()
 
   res.json(results)

  //  console.log(results)

 
 });
 

 router.route('/primers').get(async(req, res) => {


  const {seq, motif_length, minS, maxS, minTM, maxTM, minGC, maxGC, flank} = req.query
 
   const pdata = await getPrimers(seq, motif_length, minS, maxS, minTM, maxTM, minGC, maxGC, flank)
 
   res.send(pdata)
 
 });
 




module.exports = router;