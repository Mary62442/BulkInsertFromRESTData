#!/bin/bash
export NODE_ENV=production;
cd guessit;
npm install;
echo -e "Updating nodes and bulk restart cluster...";
nohup node index.js 8001 > node1.log &
nohup node index.js 8002 > node2.log &
echo -e "Finished on server...";


