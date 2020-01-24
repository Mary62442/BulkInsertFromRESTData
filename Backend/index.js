
// Redis is single threaded then there is no concurrent read/write. If there are 2 client connection sending command to the redis they will be queued.
// Sharding can be implemented on a redis cluster of n nodes. In our development we have only a redis server that should be hosted on a cloud vm.

process.on('exit', (code) => redisClient.quit() );
//catches ctrl+c event
process.on('SIGINT', () => process.exit(2));
//################################################################################
const uuidv4 = require('uuid/v4');
const path = require("path");
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const server = http.Server(app);
const redis = require("redis"); // redis already installed on local machine
const { Worker } = require('worker_threads');
const redisChunkSize = 5000;

const allowCrossDomain =  (req, res, next) => {
  let allowedOrigins = process.env.NODE_ENV === "production" ? ['http://35.222.121.136']  : ['http://localhost:3000'];  
  let origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1) res.setHeader('Access-Control-Allow-Origin', origin); 
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, csrf-token, Custom-Auth-Step1, Custom-Auth-Step2, Custom-Auth-Step3, Custom-Auth-Step4');
  if ('OPTIONS' == req.method) {res.sendStatus(200); }
  else { next(); }
};

app.use(allowCrossDomain);


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
  const result = await runService(redisChunkSize);
  console.log(result);
}


let PORT;
/* redis installation on ubuntu 18.04
sudo apt update
sudo apt install redis-server
sudo nano /etc/redis/redis.conf
look for the supervised key and set it as follows:
supervised systemd
then restart redis:
sudo systemctl restart redis.service
in order to access the redis server use the following command:
redis-cli
*/

const redisClient = redis.createClient({detect_buffers: true});
//  we initially flush the list
redisClient.del("scorelist");

app.use('/', express.static(path.join(__dirname, 'react')));
app.get("/help",(req,res,next ) => {res.json({help:"Thanks for inquiring. please visit algorithmnemesis.com",servingNode:`The serving node in this call is the node listening on port ${PORT}`})});

app.post("/setscoreinlist",(req,res,next ) => {
  const score = req.body.scoredata;
  score.uniqueId = uuidv4(); 
  score.date = new Date().toISOString();
  redisClient.rpush("scorelist",JSON.stringify(score));
  redisClient.llen("scorelist",(err,number)=> {
     if(number === redisChunkSize) runWorker().catch(err => console.error(err))
     res.json({ok:true,len: number });
 }) 
 
 
});

if ( parseInt(process.argv[2])) {
  PORT = parseInt(process.argv[2]);
  const listener = server.listen(PORT || 6000, () => {
    console.log(`Application worker ${process.pid} started... on port ${listener.address().port} `);
    console.log("############################");
    console.log("The value of NODE_ENV is:",process.env.NODE_ENV);
  });

  console.log(process.memoryUsage());
  console.log(`This process is pid ${process.pid}`);
  console.log(`This platform is ${process.platform}`);
  console.log(process.env);

}

else console.log("Please specify the correct port");

























