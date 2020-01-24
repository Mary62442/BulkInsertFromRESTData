#!/bin/bash
echo -e "Building ...";
cd FrontendReact;
npm run build;
rm -rf ../Backend/react/*;
cp -a build/. ../Backend/react;
cd ..;
ssh -i ../googlemary.pem maria_bu62442@35.222.121.136 'bash -s' < cleanallonserver.sh;
mkdir guessit;
cp -a Backend/. guessit;
rm -rf guessit/node_modules*;
rm -rf guessit/stresstest;
scp -i ../googlemary.pem -r guessit maria_bu62442@35.222.121.136:guessit;
rm -rf guessit;
# Build the project.
echo -e "Updating remote cluster...";
ssh -i ../googlemary.pem maria_bu62442@35.222.121.136 'bash -s' < deployonserver.sh;
echo -e "Cluster correctly updated.";
else
echo -e "Nothing to deploy since the environment is up to date...";
fi




