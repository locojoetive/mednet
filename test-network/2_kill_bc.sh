#!/bin/bash
./network.sh down
docker volume prune -f
rm -rf /home/blackathon/hyperledger/mednet/asset-transfer-basic/application-javascript/wallet/*