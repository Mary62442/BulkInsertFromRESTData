#!/bin/bash
echo "Starting the load balancer for the getscore application";
sudo kill -9 $(sudo lsof -t -i:8001);
sudo kill -9 $(sudo lsof -t -i:8002);
sudo kill -9 $(sudo lsof -t -i:8003);
sudo kill -9 $(sudo lsof -t -i:8004);
sudo kill -9 $(sudo lsof -t -i:8005);
nohup node index.js 8001 > node1.log &
nohup node index.js 8002 > node2.log &
nohup node index.js 8003 > node3.log &
nohup node index.js 8004 > node4.log &
nohup node index.js 8005 > node5.log &

echo "All nodes of the load balancer are up and running";


