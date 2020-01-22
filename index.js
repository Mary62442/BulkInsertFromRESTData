
process.on('exit', (code) => client.quit() );
//catches ctrl+c event
process.on('SIGINT', () => process.exit(2));
//################################################################################
const path = require("path");
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const server = http.Server(app);
const redis = require("redis"); // redis already installed on local machine

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

const client = redis.createClient({detect_buffers: true});

app.use('/', express.static(path.join(__dirname, 'staticfolder')));

app.get("/help",(req,res,next ) => {res.json({help:"Thanks for inquiring. please visit algorithmnemesis.com"})});

app.get("/rediskey",(req,res,next ) => {  
  client.get("diegus1",  (err, reply)=> { 
    res.json(JSON.parse(reply));
  });   
});

app.post("/setscore",(req,res,next ) => {
  const score = req.body.scoredata;
  client.set("diegus1", JSON.stringify(score));
  res.json({ok:true});
});

app.post("/setscoreinlist",(req,res,next ) => {
  const score = req.body.scoredata;
  client.lpush("scorelist",JSON.stringify(score));
  res.json({ok:true});
});


const listener = server.listen(process.env.PORT || 8005, () => {
    console.log(`Application worker ${process.pid} started... on port ${listener.address().port} `);
    console.log("############################");
    console.log("The value of NODE_ENV is:",process.env.NODE_ENV);
});

console.log(process.memoryUsage());
console.log(`This process is pid ${process.pid}`);
console.log(`This platform is ${process.platform}`);
console.log(process.env);


















