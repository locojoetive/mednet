#!/bin/bash
./network.sh down
docker volume prune -f
rm -rf /home/blackathon/hyperledger/mednet/asset-transfer-basic/application-javascript/wallet/*
./network.sh up createChannel -ca
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript/ -ccl javascript

cd asset-transfer-basic/application-javascript
npm install
node app.js