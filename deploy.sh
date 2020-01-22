#!/bin/bash
rm -rf node_modules;
npm install;
export NODE_ENV=development;
sudo kill -9 $(sudo lsof -t -i:8005);
npm start;
