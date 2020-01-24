#!/bin/bash
sudo kill -9 $(sudo lsof -t -i:8001);
sudo kill -9 $(sudo lsof -t -i:8002);
rm -rf guessit;
echo -e "Performed cleanup on server...";
