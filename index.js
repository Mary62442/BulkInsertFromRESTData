
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
const {MONGODBCONNECTION} = require("./mongoconnection");
const mongoClient = require('mongodb');

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

const client = redis.createClient({detect_buffers: true});
//  we initially flush the list
client.del("scorelist");

app.use('/', express.static(path.join(__dirname, 'staticfolder')));





app.get('/mongo', (req,res,next) => {


 
  mongoClient.connect(MONGODBCONNECTION,{ useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {

      if (err) res.json(err);                                       
      const db = client.db('scores');
      db.createCollection("test", { "capped": true, "size": 100000, "max": 5000},
      ( err, results)=> {

        client.close();
        res.json({res:"ok"});

      }
    );
})

})









app.get("/help",(req,res,next ) => {res.json({help:"Thanks for inquiring. please visit algorithmnemesis.com",servingNode:`The serving node in this call is the node listening on port ${PORT}`})});

app.get("/rediskey",(req,res,next ) => {  
  client.get("diegus1",  (err, reply)=> { 
    let response = JSON.parse(reply);
    response.servingNode = `The serving node in this call is the node listening on port ${PORT}`; 
    res.json(JSON.parse(reply));
  });   
});

app.post("/setscore",(req,res,next ) => {
  const score = req.body.scoredata;
  client.set("diegus1", JSON.stringify(score));
  res.json({ok:true, servingNode:`The serving node in this call is the node listening on port ${PORT}` });
});

app.post("/setscoreinlist",(req,res,next ) => {
  const score = req.body.scoredata;
  client.lpush("scorelist",JSON.stringify(score));
  res.json({ok:true});
});



//if ( parseInt(process.argv[2])) {
  PORT = parseInt(process.argv[2]);
  const listener = server.listen(8000 || 8005, () => {
    console.log(`Application worker ${process.pid} started... on port ${listener.address().port} `);
    console.log("############################");
    console.log("The value of NODE_ENV is:",process.env.NODE_ENV);
  });

  console.log(process.memoryUsage());
  console.log(`This process is pid ${process.pid}`);
  console.log(`This platform is ${process.platform}`);
  console.log(process.env);

//}

//else console.log("Please specify the correct port");

























