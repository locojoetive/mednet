#!/bin/bash
export PROJECT_DIR=$(pwd)
echo "current directory is " $PROJECT_DIR
echo "current directory is project folder"

# 1. Start Blockchain
cd $PROJECT_DIR/test-network
./0_restart_bc.sh

# 2. Start Backend
cd $PROJECT_DIR/asset-transfer-basic/application-javascript
pm2 stop backend
pm2 delete backend
pm2 start app.js --name backend

# 6. Start MedSAVE-UI
cd $PROJECT_DIR/medsave-ui/
pm2 stop medsave-ui
pm2 delete medsave-ui
pm2 start pm2_start.sh --name medsave-ui 

# 5. Start MedNet-CRUD
cd $PROJECT_DIR/mednet-crud/
pm2 stop mednet-crud
pm2 delete mednet-crud
pm2 start pm2_start.sh --name mednet-crud

# 3. Tunnel Backend
cd $HOME/Desktop
pm2 stop tunnel-backend
pm2 delete tunnel-backend
pm2 start 1_tunnel_backend.sh --name tunnel-backend

# 7. Tunnel MedSAVE-UI
cd $HOME/Desktop
pm2 stop tunnel-frontend
pm2 delete tunnel-frontend
pm2 start 2_tunnel_frontend.sh --name tunnel-frontend
