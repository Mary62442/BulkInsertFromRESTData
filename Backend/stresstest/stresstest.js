const { Worker } = require('worker_threads');
const concurrencyThreshold = 10; // this number contemplates entropy in the process of insertion, no pure cuncurrency but a mix of serialization and concurrency

const runService = (workerData)=> {
    return new Promise((resolve, reject) => {
      const worker = new Worker('./worker.js', { workerData });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      })
    })
  }

  async function runWorker() {
    const result = await runService(concurrencyThreshold); 
    console.log(result);
  } 

for(let i = 0 ; i < 501; i++ )  runWorker().catch(err => console.error(err));





   

