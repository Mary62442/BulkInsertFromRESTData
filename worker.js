const redis = require("redis"); // redis already installed on local machine
const {MONGODBCONNECTION} = require("./mongoconnection");
const mongoClient = require('mongodb');
const { workerData, parentPort } = require('worker_threads');
const redisClient = redis.createClient({detect_buffers: true});



mongoClient.connect(MONGODBCONNECTION,{ useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) res.json(err);                                       
    const db = client.db('scores');
    const collection = db.collection('scoredata');

    
        redisClient.lrange("scorelist", 0, workerData-1,  (err, reply)=> { 
            let scores = reply.map(e => JSON.parse(e));
            
            redisClient.ltrim("scorelist",  workerData, -1,  (err, reply)=> {

                console.log(scores);
                collection.insertMany(scores, (err, result) => {
                    if(err) console.log(err);                    
                       client.close();
                       redisClient.quit()
                       parentPort.postMessage({ scoresWritten: workerData })                                 
                   });
            })           
            return;            
        })

})


