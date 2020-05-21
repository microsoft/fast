#!/bin/bash

: 'AZURE FAST PRODUCTION => CREATION
This will create/configure all resources for Production in West Region
'
# TODO: Only thing that differs between east/west creation files is the location
# Create a command prompt to ask which region to create.  Then merge these two files

# GLOBAL Configurations
    source config.sh

    # Web Apps: Valid values
    declare -a subscriptions=("production" "development")
    declare -a names=("app" "color" "create" "explore" "motion" "www")
    declare -a locations=("westus" "eastus")

    product=fast
    subscription=production

## SHELL Arguments
source inputs.sh --debug true --subscription $subscription

for location in ${locations[@]}; do

    location_abbr=${location:0:4}
    echo $location_abbr
    
    resource_group=$product-$location-rg
    echo $resource_group
    
    for name in ${names[@]}; do

        # az webapp config show --resource-group $resource_group --name $name-$location_abbr-app

        echo "updating webapp configuration ..."
        az webapp config set  --resource-group $resource_group --name $name-$location_abbr-app \
            --startup-file "" \
            --php-version 7.3
            # --startup-file "pm2 start /home/site/wwwroot/server.js --no-daemon" \
            # --runtime "NODE|12-lts"
        
        # echo "updating webapp app settings ..." 
        # az webapp config appsettings set --resource-group $resource_group --name $name-$location_abbr-app \
        #     --settings PORT="7001"

        # Slots CLI has a bug refer: https://github.com/Azure/azure-cli/issues/6638 
        # echo "deleting staging slot configuration ..."
        # az webapp deployment slot delete --name $name --resource-group $resource_group --slot stage

        # echo "recreating staging slot configuration ..."
        # az webapp deployment slot delete --name $name --resource-group $resource_group --slot stage --configuration-source 
    done

done
