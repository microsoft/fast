#!/bin/bash

: 'AZURE FAST DEPLOYING
This will deploy from staging to production via Azure Web App Slot swapping.

'

# GLOBAL Configurations
    source config.sh

    # Web Apps: Valid values
    declare -a subscriptions=("production" "development")
    declare -a names=("create" "explore" "www")
    #declare -a names=("app" "color" "create" "explore" "motion" "www")
    declare -a locations=("west" "east")

    product=fast
    subscription=production

## SHELL Arguments
source inputs.sh --debug true --subscription $subscription

## JOBS
for location in ${locations[@]}; do

    # configure resource group and IP address
    resource_group=fast-$location'us'-rg
    public_ip="$(wget -qO- ipinfo.io/ip)"/16
    echo "public IP: ${public_ip}"

    echo "performing release deployment into $resource_group ..."
    for name in ${names[@]}; do

        new_app_name=$name-$location-app
        echo "deploying production server name $new_app_name ..."

        # Create IP address network access restriction exception for this IP address
        echo "configuring network access exception for testing from $public_ip ..."
        az webapp config access-restriction add --priority 300 \
            --resource-group $resource_group \
            --name $new_app_name \
            --description "Allow public IP access for testing from local system" \
            --rule-name "Front Door IPv4 IP Testing" \
            --action Allow \
            --ip-address ${public_ip}

        echo "Verify website => http://$new_app_name.azurewebsites.net"

        read -p "Press [Enter] key to resume ..."

    done
done
exit 
echo "deploying from staging to production in east region ..."
az webapp deployment slot swap --resource-group fast-eastus-rg --name create-east-app --slot stage --action swap --target-slot production

# Validate updated succeedeed.  Prompt user to choose yes or no based on success to proceed to primary
# Set IP address exception to match local IP address of the person running the script
# Test access at https://www-west-app.azurewebsites.net 

echo "deploying from staging to production in west region ..."
az webapp deployment slot swap --resource-group fast-westus-rg --name create-west-app --slot stage --action swap --target-slot production

# Validate updated succeedeed.  Prompt user to choose yes or no based on success to proceed to primary

echo "${bold}${green}Success !!!${reset}${unbold}"

