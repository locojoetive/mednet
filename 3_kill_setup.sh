#!/bin/bash
export PROJECT_DIR=$HOME/hyperledger/mednet

pm2 stop tunnel-backend
pm2 delete tunnel-backend

pm2 stop tunnel-frontend
pm2 delete tunnel-frontend

pm2 stop backend
pm2 delete backend

pm2 stop mednet-crud
pm2 delete mednet-crud

pm2 stop medsave-ui
pm2 delete medsave-ui

cd $PROJECT_DIR/test-network
./2_kill_bc.sh