const { spawn } = require('child_process');
const { once } = require('events');
const fs = require('fs');
const path = require('path');
  

const runEPCR = (item, seq, mismatch, genome) => {

    var csvString = [];
    
      csvString = [
        [
          "Primer1",  
          item.f1,
          item.r1,
        ],

        [
            "Primer2", 
            item.f2,
            item.r2,
          ],
          [
            "Primer3", 
            item.f3,
            item.r3,
          ],
      ]
        .map((e) => e.join("\t"))
        .join("\n");
       console.log(item)
       fs.writeFileSync(path.join(__dirname,"epcrdata/pinput.txt"), csvString);
       fs.writeFileSync(path.join(__dirname,"epcrdata/dnaseq.fa"), seq);
       

    let sequence;
    let prpath = '/opt/software/emboss/EMBOSS-6.6.0/emboss/primersearch'
    // let prpath = '/opt/homebrew/bin/primersearch'
    if (seq != ''){
        sequence = path.join(__dirname,'epcrdata/dnaseq.fa')
    }
    else{
        sequence = path.join(__dirname,`../data/${genome}`)
    }
    
    const child = require('child_process').execSync(`${prpath} -infile ${path.join(__dirname,'epcrdata/pinput.txt')} -seqall ${sequence} -mismatchpercent ${mismatch} -outfile ${path.join(__dirname,'epcrdata/test.txt')}`)
       
    return new Promise((res, rej) => {
    const ampli = fs.readFileSync(path.join(__dirname,"epcrdata/test.txt"))
    res(ampli)
       
    });
}



module.exports = runEPCR


