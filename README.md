# BulkInsertFromRESTData

A server system that operates with Node.js, Express.js, MongoDB and RedisDB.

At present I have tested this application on a single machine with a load balancer of five nodes on different ports of localhost, and a MongoDB database installed locally and also on a sandbox using Mongo Atlas.

However, in a production environment we would require seven virtual machines: five for the five nodes, one for the MongoDB database, and one for the installation of nginx with the configured load balancer (please see nginx_config.conf file). It would also be useful to implement sharding and create a cluster for the RedisDB.

## Functionality

A simple post API receives json data and stores it in memory into a RedisDB list. Once the list reaches a certain length (parametrized bulk size) we instantiate a Worker thread (stable in Node.js v12 and above) that gets that amount of data from the RedisDB, trims it and bulk writes it in a MongoDB collection.
Once the RedisDB fills once more with the specified bulk size, the worker is called once again with the recently added data to write it in MongoDB.

I have successfully tested this server application using Apache JMeter v5.2.1 with 25000 threads that take a mean time of 8 seconds to access the API and write into the MongoDB database.

The results are promising considering the workload on a single machine and they become stable and effective when we expand in the cloud using the microservices indicated.

