#!/bin/bash
echo "Killing all the nodes of getscore application";
sudo kill -9 $(sudo lsof -t -i:8001);
sudo kill -9 $(sudo lsof -t -i:8002);
sudo kill -9 $(sudo lsof -t -i:8003);
sudo kill -9 $(sudo lsof -t -i:8004);
sudo kill -9 $(sudo lsof -t -i:8005);
