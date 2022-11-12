const { spawn } = require('child_process');
const { once } = require('events');
const fs = require('fs');
const path = require('path');

const getPrimers = (seq, motif_length, minS, maxS, minTM, maxTM, minGC, maxGC, flank) => {

    console.log(flank)
    let excludeStart = parseInt(flank) - 3
    console.log(excludeStart)
    let a = excludeStart - 1
    let b = parseInt(excludeStart) + 1
    let excluseEnd = parseInt(motif_length) + 3
    let excludeRegion = `${excludeStart},${excluseEnd}`
    let okEnd = parseInt(excluseEnd) + parseInt(excludeStart) + 2
    let okRegion = `1,${a},${okEnd},${b}`

    let datainput = `SEQUENCE_ID=example\nSEQUENCE_TEMPLATE=${seq}\nPRIMER_TASK=generic\nPRIMER_NUM_RETURN=3
PRIMER_PICK_LEFT_PRIMER=1\nPRIMER_PICK_INTERNAL_OLIGO=0\nPRIMER_PICK_RIGHT_PRIMER=1\nPRIMER_OPT_SIZE=20
PRIMER_MIN_SIZE=${minS}\nPRIMER_MAX_SIZE=${maxS}\nPRIMER_MIN_TM=${minTM}\nPRIMER_MAX_TM=${maxTM}
PRIMER_MIN_GC=${minGC}\nPRIMER_MAX_GC=${maxGC}\nSEQUENCE_TARGET=${excludeRegion}\nSEQUENCE_INTERNAL_EXCLUDE_REGION=${excludeRegion}
PRIMER_PRODUCT_SIZE_RANGE=100-200\nPRIMER_EXPLAIN_FLAG=1\n=`
    fs.writeFileSync(path.join(__dirname,"input.txt"), datainput);
    // console.log(__dirname)


    let output;
    let prpath = '/opt/software/primer3/2.6.1/src/primer3_core'
    // let prpath = '/opt/primer3/src/primer3_core'
    const getS = spawn(prpath, [path.join(__dirname,'/input.txt')]);
    getS.stdout.on('data', (data) => {
        output = data.toString();

        // console.log('output was generated: ' + output);
    });

    getS.stdin.setEncoding = 'utf-8';
    // Handle error output
    getS.stderr.on('data', (data) => {
        // As said before, convert the Uint8Array to a readable string.
        console.log('error:' + data);
    });
    return new Promise((res, rej) => {

        getS.stdout.on('end', async function (code) {

            
            const dataPrimer = output.split('\n')
            const pdata = {
                'f1': dataPrimer[28].split("=")[1],
                'r1': dataPrimer[29].split("=")[1],
                'f1tm': dataPrimer[32].split("=")[1],
                'r1tm': dataPrimer[33].split("=")[1],
                'f1GC': dataPrimer[34].split("=")[1],
                'r1GC': dataPrimer[35].split("=")[1],
                'p1psize': dataPrimer[46].split("=")[1],
                'f2': dataPrimer[51].split("=")[1],
                'r2': dataPrimer[52].split("=")[1],
                'f2tm': dataPrimer[55].split("=")[1],
                'r2tm': dataPrimer[56].split("=")[1],
                'f2GC': dataPrimer[57].split("=")[1],
                'r2GC': dataPrimer[58].split("=")[1],
                'p2psize': dataPrimer[69].split("=")[1],
                'f3': dataPrimer[74].split("=")[1],
                'r3': dataPrimer[75].split("=")[1],
                'f3tm': dataPrimer[78].split("=")[1],
                'r3tm': dataPrimer[79].split("=")[1],
                'f3GC': dataPrimer[80].split("=")[1],
                'r3GC': dataPrimer[81].split("=")[1],
                'p3psize': dataPrimer[92].split("=")[1],

            }
            // console.log(output)

                res(pdata);
            
            

        })
    });

}

// getPrimers("ATACGCTAAAACATTCATTTCATGATTGCTTACTTGGTAATTGTCTATTGAGTCTTTTTTGCTGCTCATTCTTTAAGCTTTAGCTGTATTCTTTTGACAATTTTAGAGGAGGGTCAGGGAAAAGAAAGAAAATGAGCCACATCTAGAATAAATATTAAGACTCACAAAATTTGGAGGAGGTACATAATTAACACTATACATATATATATTGGGGCTTTCCAGGTGGCACCTGTGGTACAGAACCTGACTGCCAATGCAGGAGACATAAGAGATGCGGGTTTGATCCCTTGGTCGGGAAGATCCCCTGGAGAAGGGCGTGGCACTCTGCTCCAATATTCTTGCCTGGAGAATCCCCTGGACAGAGGAGCCTGGGTTACTACTGTCCATAGGGTCACACAGAGTCAGACAC",10, 18, 22, 45,65,40,60,180)




module.exports = getPrimers

