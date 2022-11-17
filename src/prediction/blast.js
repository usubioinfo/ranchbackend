
const fs = require('fs');
const path = require('path');






const runBlast = (id, filedata, program, genome, word, target, evalue) => {

    console.log(filedata)

    const child = require('child_process').execSync(`"/opt/software/ncbi-blast-2.7.1+-src/c++/bin/"${program} -db ${path.join(__dirname, "../data/"+genome)} -query ${filedata} -max_target_seqs ${target} -word_size ${word} -evalue ${evalue} -num_threads 20 -outfmt 6 -out ${path.join(__dirname,`preddata/pred${id}.out.xml`)}`)
       
    return new Promise((res, rej) => {
       
   
    const ampli = fs.readFileSync(path.join(__dirname,`preddata/pred${id}.out.xml`), 'utf8')

    // const ampli = fs.readFileSync(path.join(__dirname,`preddata/test.out.xml`), 'utf8')

    const cells = ampli.split('\n').map(function (el) { return el.split(/\s+/); });

   


    const headings = ['qseqid', 'sseqid', 'pident', 'length', 'mismatch', 'gapopen', 'qstart', 'qend', 'sstart', 'send', 'evalue', 'bitscore']
   
    var objd = cells.filter(function (el) {
      return el != '';
    });

    console.log(objd)
    
    const obj = objd.map(function (el) {
        let obj = {};
        for (let i = 0, l = el.length; i < l; i++) {
           
          obj[headings[i]] = isNaN(Number(el[i])) ? el[i] : +el[i];
        
    }
        return obj;
      });

     
      
      const jsondata = JSON.stringify(obj);
  
    

    
    res(jsondata)

    });

}

module.exports = runBlast
