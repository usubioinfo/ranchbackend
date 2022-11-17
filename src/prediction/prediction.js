const { spawn } = require('child_process');
const { once } = require('events');
const fs = require('fs');
const path = require('path');
const FileReader = require('filereader')





const runPrediction = (id, filedata, minRepeat, maxRepeat, mono, all) => {

    const cmd = `perl ${path.join(__dirname,"MicroSatMiner.pl")} -i ${filedata} -min ${minRepeat} -max ${maxRepeat} -ml ${mono} -t ${all} -sp ${path.join(__dirname,"preddata/pred"+id)}`
    console.log(cmd)
    const child = require('child_process').execSync(`perl ${path.join(__dirname,"MicroSatMiner.pl")} -i ${filedata} -min ${minRepeat} -max ${maxRepeat} -ml ${mono} -t ${all} -sp ${path.join(__dirname,"preddata/pred"+id)}`)
       
    return new Promise((res, rej) => {
       
   
    const ampli = fs.readFileSync(path.join(__dirname,`preddata/pred${id}.ssr.txt`), 'utf8')
    
    
    const cells = ampli.split('\n').map(function (el) { return el.split(/\s+/); });
    
    const headings = cells.shift();

   
    
    const obj = cells.map(function (el) {
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

module.exports = runPrediction
