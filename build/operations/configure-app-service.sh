# Set Subscription
az account set --subscription "456b8669-6142-4a7b-b4a6-adf39c80289e"

# List configurations for Component Explorer
az webapp config show --name fast-explore --resource-group fast-design-rg

# resource group = fast-staging-rg
az webapp config set --name fast-design \
    --always-on true \
    --auto-heal-enabled true \
    --ftps-state FtpsOnly \
    --http20-enabled true \
    --linux-fx-version "NODE|lts" \
    --min-tls-version "1.2" \
    --name "fast-design-app" \
    --resource-group "fast-design-rg" \
    --startup-file "pm2 start /home/site/wwwroot/server.js --no-daemon" \
    --subscription "456b8669-6142-4a7b-b4a6-adf39c80289e" \
    --use-32bit-worker-process false \
    
#    --number-of-workers 4 \ # What is this and how many should be used?